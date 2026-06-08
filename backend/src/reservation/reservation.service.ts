/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

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

  findAll() {
    return this.prisma.reservation.findMany({
      include: {
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
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
      throw new NotFoundException('Reserva não encontrada');
    }

    return reservation;
  }

  async create(data: CreateReservationDto) {
    const startDate = new Date(data.startDate);

    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException(
        'A data final deve ser maior que a data inicial',
      );
    }

    for (const item of data.equipments) {
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
    }

    return this.prisma.reservation.create({
      data: {
        user: data.user,
        startDate,
        endDate,
        observations: data.observations,

        equipments: {
          create: data.equipments.map((item) => ({
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
  }

  async update(id: number, data: UpdateReservationDto) {
    await this.findOne(id);

    const updateData: any = {};

    if (data.user !== undefined) {
      updateData.user = data.user;
    }

    if (data.observations !== undefined) {
      updateData.observations = data.observations;
    }

    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }

    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }

    if (
      updateData.startDate &&
      updateData.endDate &&
      updateData.endDate <= updateData.startDate
    ) {
      throw new BadRequestException(
        'A data final deve ser maior que a data inicial',
      );
    }

    if (data.equipments) {
      for (const item of data.equipments) {
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
      }

      await this.prisma.reservationEquipment.deleteMany({
        where: {
          reservationId: id,
        },
      });

      updateData.equipments = {
        create: data.equipments.map((item) => ({
          equipmentId: item.equipmentId,
          subdivisionsQuantity: item.subdivisionsQuantity,
        })),
      };
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
}
