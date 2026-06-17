/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReturnReservationDto } from './dto/return-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: number) {
    return this.prisma.reservation.findMany({
      where: userId
        ? {
            userId,
          }
        : undefined,

      include: {
        user: true,
        equipments: {
          include: {
            equipment: {
              include: {
                room: true,
              },
            },
          },
        },
      },

      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
        equipments: {
          include: {
            equipment: {
              include: {
                room: true,
              },
            },
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reserva ${id} não encontrada`);
    }

    return reservation;
  }

  private async validateReservationConflicts(
    equipments: {
      equipmentId: number;
      subdivisionsQuantity?: number;
    }[],
    startDate: Date,
    endDate: Date,
    reservationId?: number,
  ) {
    if (!equipments || equipments.length === 0) {
      throw new BadRequestException(
        'A reserva deve possuir pelo menos um equipamento',
      );
    }

    for (const item of equipments) {
      const equipment = await this.prisma.equipment.findUnique({
        where: {
          id: item.equipmentId,
        },
      });

      if (!equipment) {
        throw new NotFoundException(
          `Equipamento ${item.equipmentId} não encontrado`,
        );
      }

      const reservations = await this.prisma.reservationEquipment.findMany({
        where: {
          equipmentId: item.equipmentId,
          reservation: {
            returnedAt: null,
            status: {
              in: ['ATIVA', 'PENDENTE_APROVACAO'],
            },
            ...(reservationId
              ? {
                  id: {
                    not: reservationId,
                  },
                }
              : {}),
            startDate: {
              lte: endDate,
            },
            endDate: {
              gte: startDate,
            },
          },
        },
      });

      const totalSubdivisions = Math.max(equipment.subdivisions ?? 1, 1);

      const reservedSubdivisions = reservations.reduce(
        (total, reservation) => total + (reservation.subdivisionsQuantity ?? 1),
        0,
      );

      const requestedSubdivisions = item.subdivisionsQuantity ?? 1;
      if (requestedSubdivisions <= 0) {
        throw new BadRequestException(
          'A quantidade de subdivisões deve ser maior que zero',
        );
      }
      const availableSubdivisions = totalSubdivisions - reservedSubdivisions;

      if (requestedSubdivisions > availableSubdivisions) {
        throw new BadRequestException(
          `O equipamento "${equipment.name}" possui apenas ${availableSubdivisions} subdivisão(ões) disponível(is) neste período`,
        );
      }
    }
  }

  async create(dto: CreateReservationDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('Datas inválidas');
    }

    if (endDate <= startDate) {
      throw new BadRequestException(
        'A data final deve ser maior que a data inicial',
      );
    }

    await this.validateReservationConflicts(dto.equipments, startDate, endDate);

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    const status = diffDias > 7 ? 'PENDENTE_APROVACAO' : 'ATIVA';

    return this.prisma.reservation.create({
      data: {
        userId: dto.userId,
        startDate,
        endDate,
        observations: dto.observations,

        status,

        equipments: {
          create: dto.equipments.map((e) => ({
            equipmentId: e.equipmentId,
            subdivisionsQuantity: e.subdivisionsQuantity,
          })),
        },
      },
      include: {
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateReservationDto) {
    const reservation = await this.findOne(id);

    const startDate = data.startDate
      ? new Date(data.startDate)
      : reservation.startDate;

    const endDate = data.endDate ? new Date(data.endDate) : reservation.endDate;

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('Datas inválidas');
    }

    if (endDate <= startDate) {
      throw new BadRequestException(
        'A data final deve ser maior que a data inicial',
      );
    }

    const updateData: any = {};

    if (data.observations !== undefined) {
      updateData.observations = data.observations;
    }

    if (data.startDate !== undefined) {
      updateData.startDate = startDate;
    }

    if (data.endDate !== undefined) {
      updateData.endDate = endDate;
    }

    if (data.equipments !== undefined) {
      await this.validateReservationConflicts(
        data.equipments,
        startDate,
        endDate,
        id,
      );

      return this.prisma.$transaction(async (tx) => {
        await tx.reservationEquipment.deleteMany({
          where: {
            reservationId: id,
          },
        });

        return tx.reservation.update({
          where: { id },
          data: {
            ...updateData,
            equipments: {
              create: data.equipments!.map((item) => ({
                equipmentId: item.equipmentId,
                subdivisionsQuantity: item.subdivisionsQuantity,
              })),
            },
          },
          include: {
            user: true,
            equipments: {
              include: {
                equipment: true,
              },
            },
          },
        });
      });
    }

    return this.prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.reservation.delete({
      where: { id },
    });
  }

  async returnReservation(id: number, dto: ReturnReservationDto) {
    const reservation = await this.findOne(id);

    if (reservation.returnedAt) {
      throw new BadRequestException('Esta reserva já foi devolvida');
    }

    if (dto.hadIssue && !dto.returnObservations?.trim()) {
      throw new BadRequestException(
        'É necessário descrever o problema quando houver defeito',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedReservation = await tx.reservation.update({
        where: { id },
        data: {
          returnedAt: new Date(),
          hadIssue: dto.hadIssue ?? false,
          returnObservations: dto.returnObservations ?? null,
        },
        include: {
          user: true,
          equipments: {
            include: {
              equipment: true,
            },
          },
        },
      });

      if (dto.hadIssue) {
        const equipmentIds = reservation.equipments.map((e) => e.equipmentId);

        await tx.equipment.updateMany({
          where: { id: { in: equipmentIds } },
          data: { status: 'AGUARDANDO_REVISAO' },
        });
      }

      return updatedReservation;
    });
  }

  async approve(id: number) {
    const reservation = await this.findOne(id);

    if (reservation.status !== 'PENDENTE_APROVACAO') {
      throw new BadRequestException(
        'Apenas reservas pendentes podem ser aprovadas',
      );
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'ATIVA',
      },
      include: {
        user: true,
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
    });
  }

  async reject(id: number) {
    const reservation = await this.findOne(id);

    if (reservation.status !== 'PENDENTE_APROVACAO') {
      throw new BadRequestException(
        'Apenas reservas pendentes podem ser rejeitadas',
      );
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'REJEITADA',
      },
      include: {
        user: true,
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
    });
  }
}
