/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
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
    const currentEquipment = await this.findOne(id);

    if (data.status && data.status !== currentEquipment.status) {
      if (data.status === 'MANUTENCAO') {
        await this.prisma.maintenance.create({
          data: {
            equipmentId: id,
            startDate: new Date(),
            responsiblePerson: (data as any)['maintenanceResponsiblePerson'],
            observations: (data as any)['maintenanceObservations'],
          },
        });
      }

      if (
        currentEquipment.status === 'MANUTENCAO' &&
        data.status === 'DISPONIVEL'
      ) {
        const openMaintenance = await this.prisma.maintenance.findFirst({
          where: {
            equipmentId: id,
            endDate: null,
          },
          orderBy: { startDate: 'desc' },
        });

        if (openMaintenance) {
          await this.prisma.maintenance.update({
            where: { id: openMaintenance.id },
            data: { endDate: new Date() },
          });
        }
      }
    }

    const {
      maintenanceResponsiblePerson,
      maintenanceObservations,
      ...equipmentData
    } = data as any;

    return this.prisma.equipment.update({
      where: { id },
      data: equipmentData,
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
        maintenances: true,
        reservations: {
          include: {
            reservation: {
              include: {
                user: true,
              },
            },
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

    doc.fontSize(16).text('Métricas de Utilização e Manutenção', {
      underline: true,
    });

    doc.moveDown(0.5);
    doc.fontSize(12);

    const totalReservas = equipment.reservations.length;
    const agora = new Date();
    const reservasFuturas = equipment.reservations.filter(
      (r) => new Date(r.reservation.startDate) >= agora,
    ).length;

    let totalDiasReservados = 0;
    equipment.reservations.forEach((r) => {
      const inicio = new Date(r.reservation.startDate);
      const fim = new Date(r.reservation.endDate);
      const diffTime = Math.abs(fim.getTime() - inicio.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      totalDiasReservados += diffDays;
    });

    const tempoMedioReserva =
      totalReservas > 0 ? (totalDiasReservados / totalReservas).toFixed(1) : 0;

    const dataCriacao = new Date(equipment.createdAt);
    const tempoTotalExistencia = Math.abs(
      agora.getTime() - dataCriacao.getTime(),
    );
    const diasTotaisExistencia = tempoTotalExistencia / (1000 * 60 * 60 * 24);
    const taxaUtilizacao =
      diasTotaisExistencia > 0
        ? Math.min(
            (totalDiasReservados / diasTotaisExistencia) * 100,
            100,
          ).toFixed(1)
        : 0;

    doc.text(`Total de Reservas (Histórico): ${totalReservas}`);
    doc.text(`Reservas Agendadas (Atual/Futuras): ${reservasFuturas}`);
    doc.text(`Tempo Médio de Reserva: ${tempoMedioReserva} dias`);
    doc.text(`Taxa de Utilização Total: ${taxaUtilizacao}%`);
    doc.text(
      `Quantidade de Manutenções Realizadas: ${equipment.maintenances.length}`,
    );

    doc.moveDown(2);

    doc.fontSize(16).text('Histórico de Manutenções', {
      underline: true,
    });

    doc.moveDown(0.5);
    doc.fontSize(12);

    if (equipment.maintenances.length === 0) {
      doc.text('Nenhuma manutenção registrada.');
    } else {
      equipment.maintenances.forEach((m, index) => {
        doc.text(
          `${index + 1}. Início: ${m.startDate.toLocaleString('pt-BR')}`,
        );
        doc.text(
          `   Fim: ${
            m.endDate ? m.endDate.toLocaleString('pt-BR') : 'Em andamento'
          }`,
        );
        if (m.responsiblePerson)
          doc.text(`   Responsável: ${m.responsiblePerson}`);
        if (m.observations) doc.text(`   Observações: ${m.observations}`);
        doc.moveDown(0.5);
      });
    }

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

        doc.text(`${index + 1}. ${reservation.user.name}`);

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
