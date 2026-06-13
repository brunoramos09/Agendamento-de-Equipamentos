import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMaintenanceDto) {
    return this.prisma.$transaction(async (tx) => {
      const maintenance = await tx.maintenance.create({
        data,
        include: {
          equipment: true,
        },
      });

      await tx.equipment.update({
        where: { id: data.equipmentId },
        data: { status: 'MANUTENCAO' },
      });

      return maintenance;
    });
  }

  async findAll() {
    return this.prisma.maintenance.findMany({
      include: {
        equipment: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
      include: {
        equipment: true,
      },
    });

    if (!maintenance) {
      throw new NotFoundException('Registro de manutenção não encontrado');
    }

    return maintenance;
  }

  async update(id: number, data: UpdateMaintenanceDto) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      const maintenance = await tx.maintenance.update({
        where: { id },
        data,
        include: {
          equipment: true,
        },
      });

      if (data.endDate) {
        await tx.equipment.update({
          where: { id: maintenance.equipmentId },
          data: { status: 'DISPONIVEL' },
        });
      }

      return maintenance;
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.maintenance.delete({
      where: { id },
    });
  }
}