/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
        equipment: true,
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
        equipment: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    return reservation;
  }

  async create(data: CreateReservationDto) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id: data.equipmentId },
    });

    if (!equipment) {
      throw new NotFoundException('Equipamento não encontrado');
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException(
        'A data final deve ser maior que a data inicial',
      );
    }

    return this.prisma.reservation.create({
      data: {
        equipmentId: data.equipmentId,
        requester: data.requester,
        startDate,
        endDate,
        notes: data.notes,
      },
      include: {
        equipment: true,
      },
    });
  }

  async update(id: number, data: UpdateReservationDto) {
    await this.findOne(id);

    if (data.equipmentId) {
      const equipment = await this.prisma.equipment.findUnique({
        where: { id: data.equipmentId },
      });

      if (!equipment) {
        throw new NotFoundException('Equipamento não encontrado');
      }
    }

    const startDate = data.startDate ? new Date(data.startDate) : undefined;
    const endDate = data.endDate ? new Date(data.endDate) : undefined;

    if (startDate && endDate && endDate <= startDate) {
      throw new BadRequestException(
        'A data final deve ser maior que a data inicial',
      );
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        equipmentId: data.equipmentId,
        requester: data.requester,
        startDate,
        endDate,
        notes: data.notes,
      },
      include: {
        equipment: true,
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
