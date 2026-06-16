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

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    doc.pipe(res);

    const pageW = 595;
    const pageH = 842;
    const margin = 48;
    const contentW = pageW - margin * 2;
    const bottomLimit = pageH - 60;

    const statusColors: Record<string, { bg: string; text: string }> = {
      DISPONIVEL: { bg: '#dcfce7', text: '#166534' },
      MANUTENCAO: { bg: '#fef3c7', text: '#92400e' },
      INATIVO: { bg: '#fee2e2', text: '#991b1b' },
      AGUARDANDO_REVISAO: { bg: '#ede9fe', text: '#6d28d9' },
    };
    const statusLabels: Record<string, string> = {
      DISPONIVEL: 'Disponível',
      MANUTENCAO: 'Em Manutenção',
      INATIVO: 'Inativo',
      AGUARDANDO_REVISAO: 'Ag. Revisão',
    };

    function drawFooter() {
      doc.rect(0, pageH - 36, pageW, 36).fill('#1e293b');
      doc
        .fillColor('#94a3b8')
        .fontSize(8)
        .font('Helvetica')
        .text(
          `Sistema de Reserva de Equipamentos  ·  ${equipment!.name}  ·  ${new Date().toLocaleDateString('pt-BR')}`,
          0,
          pageH - 22,
          { width: pageW, align: 'center' },
        );
    }

    function addPage(): number {
      drawFooter();
      doc.addPage({ margin: 0, size: 'A4' });
      doc.rect(0, 0, pageW, 48).fill('#1e293b');
      doc
        .fillColor('#94a3b8')
        .fontSize(8)
        .font('Helvetica')
        .text('RELATÓRIO DE EQUIPAMENTO', margin, 14, { characterSpacing: 2 });
      doc
        .fillColor('#ffffff')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(equipment!.name, margin, 26);
      return 68;
    }

    function checkPageBreak(y: number, needed = 40): number {
      if (y + needed > bottomLimit) return addPage();
      return y;
    }

    function sectionTitle(label: string, y: number): number {
      y = checkPageBreak(y, 36);
      doc
        .fillColor('#1e293b')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(label, margin, y, { characterSpacing: 1.5 });
      y += 14;
      doc.rect(margin, y, contentW, 1).fill('#e2e8f0');
      return y + 12;
    }

    function infoRow(label: string, value: string, y: number): number {
      y = checkPageBreak(y, 20);
      doc
        .fillColor('#64748b')
        .fontSize(9)
        .font('Helvetica')
        .text(label, margin, y, { width: 130 });
      doc
        .fillColor('#0f172a')
        .fontSize(10)
        .font('Helvetica')
        .text(value, margin + 138, y, { width: contentW - 138 });
      return y + 18;
    }

    function formatarDuracao(horas: number): string {
      if (horas < 24) {
        return `${horas.toFixed(1)} h`;
      }

      const dias = Math.floor(horas / 24);
      const horasRestantes = Math.round(horas % 24);

      if (horasRestantes === 0) {
        return `${dias} dia${dias > 1 ? 's' : ''}`;
      }

      return `${dias} dia${dias > 1 ? 's' : ''} e ${horasRestantes}h`;
    }

    const agora = new Date();
    const totalReservas = equipment.reservations.length;
    const reservasFuturas = equipment.reservations.filter(
      (r) => new Date(r.reservation.startDate) >= agora,
    ).length;

    let totalDiasReservados = 0;
    let totalHorasReservados = 0;
    equipment.reservations.forEach((r) => {
      const inicio = new Date(r.reservation.startDate);
      const fim = new Date(r.reservation.endDate);
      totalDiasReservados +=
        Math.abs(fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
    });

    totalHorasReservados = totalDiasReservados * 24;

    const tempoMedioReservaHoras =
      totalReservas > 0
        ? (totalHorasReservados / totalReservas).toFixed(1)
        : '0';

    const tempoMedioReservaFormatado = formatarDuracao(
      Number(tempoMedioReservaHoras),
    );

    const diasTotaisExistencia =
      Math.abs(agora.getTime() - new Date(equipment.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    const taxaUtilizacao =
      diasTotaisExistencia > 0
        ? Math.min(
            (totalDiasReservados / diasTotaisExistencia) * 100,
            100,
          ).toFixed(1)
        : '0';

    doc.rect(0, 0, pageW, 110).fill('#1e293b');
    doc
      .fillColor('#94a3b8')
      .fontSize(9)
      .font('Helvetica')
      .text('RELATÓRIO DE EQUIPAMENTO', margin, 30, { characterSpacing: 2 });
    doc
      .fillColor('#ffffff')
      .fontSize(22)
      .font('Helvetica-Bold')
      .text(equipment.name, margin, 48);
    doc
      .fillColor('#94a3b8')
      .fontSize(9)
      .font('Helvetica')
      .text(
        `Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
        margin,
        80,
      );

    const sc = statusColors[equipment.status] ?? {
      bg: '#f1f5f9',
      text: '#475569',
    };
    const statusText = statusLabels[equipment.status] ?? equipment.status;
    const badgeW = 110;
    const badgeX = pageW - margin - badgeW;
    doc.roundedRect(badgeX, 44, badgeW, 22, 11).fill(sc.bg);
    doc
      .fillColor(sc.text)
      .fontSize(9)
      .font('Helvetica-Bold')
      .text(statusText, badgeX, 50, { width: badgeW, align: 'center' });

    const cardY = 128;
    const cardH = 56;
    const cardGap = 10;
    const cardW = (contentW - cardGap * 3) / 4;

    const metricCards = [
      { label: 'Total de Reservas', value: String(totalReservas) },
      { label: 'Reservas Futuras', value: String(reservasFuturas) },
      { label: 'Uso Médio', value: String(tempoMedioReservaFormatado) },
      { label: 'Taxa de Utilização', value: `${taxaUtilizacao}%` },
    ];

    metricCards.forEach((card, i) => {
      const x = margin + i * (cardW + cardGap);
      doc.roundedRect(x, cardY, cardW, cardH, 6).fill('#f8fafc');
      doc
        .fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica')
        .text(card.label.toUpperCase(), x + 10, cardY + 10, {
          width: cardW - 20,
          characterSpacing: 0.5,
        });
      doc
        .fillColor('#0f172a')
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(card.value, x + 10, cardY + 26, { width: cardW - 20 });
    });

    let y = cardY + cardH + 28;

    // exibicao das infos do equipamento
    y = sectionTitle('INFORMAÇÕES GERAIS', y);
    y = infoRow('Patrimônio/Série', equipment.serialNumber ?? '-', y);
    y = infoRow('Responsável', equipment.responsibleEmployee ?? '-', y);
    y = infoRow('Sala', equipment.room?.name ?? 'Sem sala vinculada', y);
    if (equipment.room) {
      y = infoRow(
        'Prédio / Andar',
        `${equipment.room.building ?? '-'} · Andar ${equipment.room.floor ?? '-'}`,
        y,
      );
      y = infoRow('Campus', equipment.room.campus ?? '-', y);
    }
    y = infoRow('Manutenções', String(equipment.maintenances.length), y);
    y += 8;
    y = infoRow('Observações', equipment.observations ?? '-', y);
    y += 8;
    y = infoRow('Instruções', equipment.instructions ?? '-', y);
    y += 16;

    // exibição de reserva atual, caso tenha alguma
    const reservaAtual = equipment.reservations.find(
      (item) => !item.reservation.returnedAt,
    );

    function formatarDataHora(data: Date): string {
      const dataFormatada = data.toLocaleDateString('pt-BR');
      const horaFormatada = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${dataFormatada} ${horaFormatada}`;
    }

    y = sectionTitle('RESERVA ATUAL', y);

    if (!reservaAtual) {
      y = checkPageBreak(y, 20);
      doc
        .fillColor('#94a3b8')
        .fontSize(10)
        .font('Helvetica')
        .text('Nenhuma reserva em andamento no momento.', margin, y);
      y += 24;
    } else {
      const r = reservaAtual.reservation;
      const atrasada = new Date(r.endDate) < agora;

      const corFundo = atrasada ? '#fef2f2' : '#f0fdf4';
      const corBorda = atrasada ? '#991b1b' : '#166534';

      const cardH = r.observations ? 86 : 64;

      y = checkPageBreak(y, cardH + 10);

      doc.roundedRect(margin, y, contentW, cardH, 6).fill(corFundo);
      doc.rect(margin, y, 4, cardH).fill(corBorda);

      const col1X = margin + 14;
      const col2X = margin + contentW * 0.36;
      const col3X = margin + contentW * 0.68;

      doc
        .fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica')
        .text('USUÁRIO', col1X, y + 12);
      doc
        .fillColor('#0f172a')
        .fontSize(10)
        .font('Helvetica')
        .text(r.user.name, col1X, y + 22, { width: contentW * 0.32 });

      doc
        .fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica')
        .text('INÍCIO', col2X, y + 12);
      doc
        .fillColor('#0f172a')
        .fontSize(10)
        .font('Helvetica')
        .text(formatarDataHora(new Date(r.startDate)), col2X, y + 22, {
          width: contentW * 0.3,
        });

      doc
        .fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica')
        .text('FIM', col3X, y + 12);
      doc
        .fillColor('#0f172a')
        .fontSize(10)
        .font('Helvetica')
        .text(formatarDataHora(new Date(r.endDate)), col3X, y + 22, {
          width: contentW * 0.28,
        });

      if (atrasada) {
        const badgeW = 70;
        doc
          .roundedRect(margin + contentW - badgeW - 14, y + 38, badgeW, 16, 8)
          .fill('#fee2e2');
        doc
          .fillColor('#991b1b')
          .fontSize(8)
          .font('Helvetica-Bold')
          .text('ATRASADA', margin + contentW - badgeW - 14, y + 42, {
            width: badgeW,
            align: 'center',
          });
      }

      if (r.observations) {
        doc
          .fillColor('#64748b')
          .fontSize(8)
          .font('Helvetica')
          .text('OBSERVAÇÕES', col1X, y + 40);
        doc
          .fillColor('#0f172a')
          .fontSize(10)
          .font('Helvetica')
          .text(r.observations, col1X, y + 50, { width: contentW - 28 });
      }

      y += cardH + 10;
    }

    y += 8;

    // exibindo ultimas reservas
    y = sectionTitle('ÚLTIMAS RESERVAS', y);

    const referenciaInicio = reservaAtual
      ? new Date(reservaAtual.reservation.startDate)
      : agora;

    const ultimasReservas = equipment.reservations
      .filter((item) => new Date(item.reservation.endDate) < referenciaInicio)
      .sort(
        (a, b) =>
          new Date(b.reservation.startDate).getTime() -
          new Date(a.reservation.startDate).getTime(),
      )
      .slice(0, 3);

    if (!ultimasReservas.length) {
      y = checkPageBreak(y, 20);
      doc
        .fillColor('#94a3b8')
        .fontSize(10)
        .font('Helvetica')
        .text('Nenhuma reserva anterior registrada.', margin, y);
      y += 24;
    } else {
      function drawReservaHeader(headerY: number): number {
        doc.rect(margin, headerY, contentW, 22).fill('#f1f5f9');
        doc.fillColor('#475569').fontSize(8).font('Helvetica-Bold');
        doc.text('USUÁRIO', margin + 8, headerY + 7, { characterSpacing: 0.8 });
        doc.text('INÍCIO', margin + 148, headerY + 7, {
          characterSpacing: 0.8,
        });
        doc.text('FIM', margin + 248, headerY + 7, { characterSpacing: 0.8 });
        doc.text('DEVOLUÇÃO', margin + 348, headerY + 7, {
          characterSpacing: 0.8,
        });
        doc.text('STATUS', margin + 428, headerY + 7, {
          characterSpacing: 0.8,
        });
        return headerY + 22;
      }

      y = drawReservaHeader(y);

      ultimasReservas.forEach((item, index) => {
        const rowH = 28;
        if (y + rowH > bottomLimit) {
          y = addPage();
          y = drawReservaHeader(y);
        }

        const r = item.reservation;
        const devolvida = !!r.returnedAt;

        const rsc = devolvida
          ? { bg: '#dbeafe', text: '#1d4ed8', label: 'Devolvida' }
          : { bg: '#fee2e2', text: '#991b1b', label: 'Atrasada' };

        doc
          .rect(margin, y, contentW, rowH)
          .fill(index % 2 === 0 ? '#ffffff' : '#f8fafc');

        doc.fillColor('#0f172a').fontSize(9).font('Helvetica');
        doc.text(r.user.name, margin + 8, y + 9, {
          width: 132,
          ellipsis: true,
        });
        doc.text(formatarDataHora(new Date(r.startDate)), margin + 148, y + 9, {
          width: 92,
        });
        doc.text(formatarDataHora(new Date(r.endDate)), margin + 248, y + 9, {
          width: 92,
        });
        doc.text(
          r.returnedAt
            ? new Date(r.returnedAt).toLocaleDateString('pt-BR')
            : '-',
          margin + 348,
          y + 9,
          { width: 72 },
        );

        const rbadgeW = 64;
        doc.roundedRect(margin + 428, y + 6, rbadgeW, 16, 8).fill(rsc.bg);
        doc
          .fillColor(rsc.text)
          .fontSize(8)
          .font('Helvetica-Bold')
          .text(rsc.label, margin + 428, y + 10, {
            width: rbadgeW,
            align: 'center',
          });

        doc.rect(margin, y + rowH - 1, contentW, 1).fill('#f1f5f9');
        y += rowH;
      });
    }

    // exibindo próximas reservas
    y = sectionTitle('PRÓXIMAS RESERVAS', y);

    const referenciaFim = reservaAtual
      ? new Date(reservaAtual.reservation.endDate)
      : agora;

    const proximasReservas = equipment.reservations
      .filter((item) => new Date(item.reservation.startDate) > referenciaFim)
      .sort(
        (a, b) =>
          new Date(a.reservation.startDate).getTime() -
          new Date(b.reservation.startDate).getTime(),
      )
      .slice(0, 3);

    if (!proximasReservas.length) {
      y = checkPageBreak(y, 20);
      doc
        .fillColor('#94a3b8')
        .fontSize(10)
        .font('Helvetica')
        .text('Nenhuma reserva futura agendada.', margin, y);
      y += 24;
    } else {
      // cabeçalho da tabela
      function drawProximaReservaHeader(headerY: number): number {
        doc.rect(margin, headerY, contentW, 22).fill('#f1f5f9');
        doc.fillColor('#475569').fontSize(8).font('Helvetica-Bold');
        doc.text('USUÁRIO', margin + 8, headerY + 7, { characterSpacing: 0.8 });
        doc.text('INÍCIO', margin + 140, headerY + 7, {
          characterSpacing: 0.8,
        });
        doc.text('FIM', margin + 280, headerY + 7, { characterSpacing: 0.8 });
        doc.text('STATUS', margin + 420, headerY + 7, {
          characterSpacing: 0.8,
        });
        return headerY + 22;
      }

      y = drawProximaReservaHeader(y);

      proximasReservas.forEach((item, index) => {
        const rowH = 28;
        if (y + rowH > bottomLimit) {
          y = addPage();
          y = drawProximaReservaHeader(y);
        }

        const r = item.reservation;

        doc
          .rect(margin, y, contentW, rowH)
          .fill(index % 2 === 0 ? '#ffffff' : '#f8fafc');

        doc.fillColor('#0f172a').fontSize(9).font('Helvetica');
        doc.text(r.user.name, margin + 8, y + 9, {
          width: 152,
          ellipsis: true,
        });
        doc.text(formatarDataHora(new Date(r.startDate)), margin + 140, y + 9, {
          width: 142,
        });
        doc.text(formatarDataHora(new Date(r.endDate)), margin + 280, y + 9, {
          width: 142,
        });

        const rbadgeW = 64;
        doc.roundedRect(margin + 420, y + 6, rbadgeW, 16, 8).fill('#e0e7ff');
        doc
          .fillColor('#4338ca')
          .fontSize(8)
          .font('Helvetica-Bold')
          .text('Agendada', margin + 420, y + 10, {
            width: rbadgeW,
            align: 'center',
          });

        doc.rect(margin, y + rowH - 1, contentW, 1).fill('#f1f5f9');
        y += rowH;
      });
    }

    doc.end();
  }
}
