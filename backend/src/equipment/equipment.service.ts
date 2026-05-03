import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Response } from 'express';
import PDFDocument from 'pdfkit';
@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.equipment.findMany({
      include: {
        room: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        room: true,
      },
    });

    if (!equipment) {
      throw new NotFoundException('Equipamento não encontrado');
    }

    return equipment;
  }

  create(data: CreateEquipmentDto) {
    return this.prisma.equipment.create({
      data,
    });
  }

  async update(id: number, data: UpdateEquipmentDto) {
    await this.findOne(id);

    return this.prisma.equipment.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.equipment.delete({
      where: { id },
    });
  }

  async generateReport(id: number, res: Response) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        room: true,
        reservations: true,
      },
    });

    if (!equipment) {
      throw new NotFoundException('Equipamento não encontrado');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=relatorio-equipamento-${equipment.id}.pdf`,
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(18).text('Relatório de Equipamento', { align: 'center' });

    doc.moveDown();

    doc.fontSize(16).text('Informações Gerais', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Nome: ${equipment.name}`);
    doc.text(`Descrição: ${equipment.description}`);
    doc.text(`Obs.: ${equipment.notes}`);

    doc.moveDown(2);

    doc.fontSize(16).text('Sala', { underline: true });
    doc.moveDown(0.5);

    if (equipment.room) {
      doc.fontSize(12).text(`Nome: ${equipment.room.name}`);
      doc.text(`Prédio: ${equipment.room.building}`);
      doc.text(`Andar: ${equipment.room.floor}`);
      doc.text(`Campus: ${equipment.room.campus}`);
    } else {
      doc.text('Sem sala vinculada');
    }

    doc.moveDown(2);

    doc.fontSize(16).text('Reservas', { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12);
    if (!equipment.reservations.length) {
      doc.text('Nenhuma reserva cadastrada.');
    } else {
      equipment.reservations.forEach((r, i) => {
        doc.text(`${i + 1}. ${r.requester}`);
        doc.text(`Início: ${new Date(r.startDate).toLocaleString('pt-BR')}`);
        doc.text(`Fim: ${new Date(r.endDate).toLocaleString('pt-BR')}`);
        doc.moveDown(1);
      });
    }

    doc.end();
  }
}
