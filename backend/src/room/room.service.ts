import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.room.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: {
            equipments: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        equipments: true,
        _count: {
          select: {
            equipments: true,
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Sala não encontrada');
    }

    return room;
  }

  create(data: CreateRoomDto) {
    return this.prisma.room.create({
      data,
    });
  }

  async update(id: number, data: UpdateRoomDto) {
    await this.findOne(id);

    return this.prisma.room.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.room.delete({
      where: { id },
    });
  }
}
