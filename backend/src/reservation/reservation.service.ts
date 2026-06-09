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

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reservation.findMany({
      include: {
        equipments: {
          include: {
            equipment: true,
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
        equipments: {
          include: {
            equipment: true,
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

      const conflict = await this.prisma.reservationEquipment.findFirst({
        where: {
          equipmentId: item.equipmentId,

          reservation: {
            returnedAt: null,

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
        include: {
          reservation: true,
        },
      });

      if (conflict) {
        throw new BadRequestException(
          `O equipamento "${equipment.name}" já está reservado neste período`,
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

    return this.prisma.reservation.create({
      data: {
        user: dto.user,
        startDate,
        endDate,
        observations: dto.observations,

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

    if (data.user !== undefined) {
      updateData.user = data.user;
    }

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

  async returnReservation(id: number) {
    const reservation = await this.findOne(id);

    if (reservation.returnedAt) {
      throw new BadRequestException('Esta reserva já foi devolvida');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        returnedAt: new Date(),
      },
    });
  }
}
