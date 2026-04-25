import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.equipment.findMany({
      orderBy: { id: 'asc' },
    });
  }

  create(data: CreateEquipmentDto) {
    return this.prisma.equipment.create({
      data,
    });
  }
}
