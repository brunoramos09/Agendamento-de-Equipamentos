/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        room: true,
        reservations: {
          include: {
            reservation: true,
          },
        },
      },
    });

    if (!equipment) {
      throw new NotFoundException('Equipamento não encontrado');
    }

    return equipment;
  }

  create(data: CreateEquipmentDto, photo?: any) {
    return this.prisma.equipment.create({
      data: {
        ...data,
        photo: photo?.filename,
      },
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
        reservations: {
          include: {
            reservation: true,
          },
        },
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

    const doc = new PDFDocument({
      margin: 50,
    });

    doc.pipe(res);

    doc.fontSize(18).text('Relatório de Equipamento', {
      align: 'center',
    });

    doc.moveDown();

    doc.fontSize(16).text('Informações Gerais', {
      underline: true,
    });

    doc.moveDown(0.5);

    doc.fontSize(12).text(`Nome: ${equipment.name}`);

    doc.text(`Patrimônio/Série: ${equipment.serialNumber ?? '-'}`);

    doc.text(`Responsável: ${equipment.responsibleEmployee ?? '-'}`);

    doc.text(`Status: ${equipment.status}`);

    doc.text(`Subdivisões: ${equipment.subdivisions ?? '-'}`);

    doc.moveDown();

    doc.text(`Observações: ${equipment.observations ?? '-'}`);

    doc.moveDown();

    doc.text(`Instruções: ${equipment.instructions ?? '-'}`);

    doc.moveDown();

    doc.text(`Foto: ${equipment.photo ?? '-'}`);

    doc.moveDown();

    doc.text(
      `Documentos anexados: ${
        equipment.attachedDocuments.length
          ? equipment.attachedDocuments.join(', ')
          : '-'
      }`,
    );

    doc.moveDown(2);

    doc.fontSize(16).text('Sala', {
      underline: true,
    });

    doc.moveDown(0.5);

    doc.fontSize(12);

    if (equipment.room) {
      doc.text(`Nome: ${equipment.room.name}`);

      doc.text(`Prédio: ${equipment.room.building}`);

      doc.text(`Andar: ${equipment.room.floor}`);

      doc.text(`Campus: ${equipment.room.campus}`);
    } else {
      doc.text('Sem sala vinculada');
    }

    doc.moveDown(2);

    doc.fontSize(16).text('Reservas', {
      underline: true,
    });

    doc.moveDown(0.5);

    doc.fontSize(12);

    if (!equipment.reservations.length) {
      doc.text('Nenhuma reserva cadastrada.');
    } else {
      equipment.reservations.forEach((item, index) => {
        const reservation = item.reservation;

        doc.text(`${index + 1}. ${reservation.user}`);

        doc.text(
          `Início: ${new Date(reservation.startDate).toLocaleString('pt-BR')}`,
        );

        doc.text(
          `Fim: ${new Date(reservation.endDate).toLocaleString('pt-BR')}`,
        );

        doc.text(
          `Devolvido: ${
            reservation.returnedAt
              ? new Date(reservation.returnedAt).toLocaleString('pt-BR')
              : 'Não devolvido'
          }`,
        );

        doc.text(
          `Quantidade de subdivisões: ${item.subdivisionsQuantity ?? '-'}`,
        );

        if (reservation.observations) {
          doc.text(`Observações: ${reservation.observations}`);
        }

        doc.moveDown();
      });
    }

    doc.end();
  }
}
