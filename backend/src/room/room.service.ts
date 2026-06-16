import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Response } from 'express';
import PDFDocument from 'pdfkit'

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

  async generateRoomReport(id: number, res: Response) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        equipments: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Sala não encontrada');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=relatorio-sala-${room.id}.pdf`,
    );

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    doc.pipe(res);

    const pageW = 595;
    const pageH = 842;
    const margin = 48;
    const contentW = pageW - margin * 2;
    const rowH = 28;
    const bottomLimit = pageH - 60; // espaço reservado para o rodapé

    // ── Helpers ───────────────────────────────────────────────────────────────
    function drawFooter() {
      doc.rect(0, pageH - 36, pageW, 36).fill('#1e293b');
      doc
        .fillColor('#94a3b8')
        .fontSize(8)
        .font('Helvetica')
        .text(
          `Sistema de Reserva de Equipamentos  ·  ${room!.name}  ·  ${new Date().toLocaleDateString('pt-BR')}`,
          0,
          pageH - 22,
          { width: pageW, align: 'center' },
        );
    }

    function drawTableHeader(y: number) {
      const cols = getColumns();
      doc.rect(margin, y, contentW, 22).fill('#f1f5f9');
      doc.fillColor('#475569').fontSize(8).font('Helvetica-Bold');
      doc.text('NOME',        cols.nome.x       + 8, y + 7, { characterSpacing: 0.8 });
      doc.text('RESPONSÁVEL', cols.responsavel.x + 8, y + 7, { characterSpacing: 0.8 });
      doc.text('STATUS',      cols.status.x      + 8, y + 7, { characterSpacing: 0.8 });
      return y + 22;
    }

    function getColumns() {
      return {
        nome:        { x: margin,       w: 180 },
        responsavel: { x: margin + 188, w: 150 },
        status:      { x: margin + 346, w: 100 },
      };
    }

    function addPage(currentY: number): number {
      drawFooter();
      doc.addPage({ margin: 0, size: 'A4' });

      // cabeçalho compacto nas páginas seguintes
      doc.rect(0, 0, pageW, 48).fill('#1e293b');
      doc
        .fillColor('#94a3b8')
        .fontSize(8)
        .font('Helvetica')
        .text('RELATÓRIO DE SALA', margin, 14, { characterSpacing: 2 });
      doc
        .fillColor('#ffffff')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(room!.name, margin, 26);

      return 68; // y inicial após o cabeçalho compacto
    }

    // ── Cabeçalho da primeira página ─────────────────────────────────────────
    doc.rect(0, 0, pageW, 110).fill('#1e293b');

    doc
      .fillColor('#94a3b8')
      .fontSize(9)
      .font('Helvetica')
      .text('RELATÓRIO DE SALA', margin, 30, { characterSpacing: 2 });

    doc
      .fillColor('#ffffff')
      .fontSize(22)
      .font('Helvetica-Bold')
      .text(room.name, margin, 48);

    doc
      .fillColor('#94a3b8')
      .fontSize(9)
      .font('Helvetica')
      .text(
        `Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
        margin,
        80,
      );

    // ── Cards de resumo ───────────────────────────────────────────────────────
    const cardY = 128;
    const cardH = 56;
    const cardGap = 12;
    const cardW = (contentW - cardGap * 2) / 3;

    const cards = [
      { label: 'Prédio',  value: room.building ?? '-' },
      { label: 'Andar',   value: room.floor    ?? '-' },
      { label: 'Campus',  value: room.campus   ?? '-' },
    ];

    cards.forEach((card, i) => {
      const x = margin + i * (cardW + cardGap);
      doc.roundedRect(x, cardY, cardW, cardH, 6).fill('#f8fafc');
      doc
        .fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica')
        .text(card.label.toUpperCase(), x + 14, cardY + 12, { characterSpacing: 1 });
      doc
        .fillColor('#0f172a')
        .fontSize(13)
        .font('Helvetica-Bold')
        .text(String(card.value), x + 14, cardY + 26, { width: cardW - 28 });
    });

    // ── Seção: Equipamentos ───────────────────────────────────────────────────
    let y = cardY + cardH + 32;

    doc
      .fillColor('#1e293b')
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('EQUIPAMENTOS', margin, y, { characterSpacing: 1.5 });

    y += 16;
    doc.rect(margin, y, contentW, 1).fill('#e2e8f0');
    y += 12;

    if (!room.equipments.length) {
      doc
        .fillColor('#94a3b8')
        .fontSize(11)
        .font('Helvetica')
        .text('Nenhum equipamento cadastrado nesta sala.', margin, y);
      drawFooter();
      doc.end();
      return;
    }

    // cabeçalho da tabela
    y = drawTableHeader(y);

    // ── Linhas da tabela ──────────────────────────────────────────────────────
    const statusColors: Record<string, { bg: string; text: string }> = {
      DISPONIVEL:         { bg: '#dcfce7', text: '#166534' },
      MANUTENCAO:         { bg: '#fef3c7', text: '#92400e' },
      INATIVO:            { bg: '#fee2e2', text: '#991b1b' },
      AGUARDANDO_REVISAO: { bg: '#ede9fe', text: '#6d28d9' },
    };
    const statusLabels: Record<string, string> = {
      DISPONIVEL:         'Disponível',
      MANUTENCAO:         'Manutenção',
      INATIVO:            'Inativo',
      AGUARDANDO_REVISAO: 'Ag. Revisão',
    };

    room.equipments.forEach((equip, index) => {
      // quebra de página
      if (y + rowH > bottomLimit) {
        y = addPage(y);
        y = drawTableHeader(y); // repete cabeçalho da tabela na nova página
      }

      const cols = getColumns();
      const rowY = y;

      if (index % 2 === 0) {
        doc.rect(margin, rowY, contentW, rowH).fill('#ffffff');
      } else {
        doc.rect(margin, rowY, contentW, rowH).fill('#f8fafc');
      }

      const sc = statusColors[equip.status] ?? { bg: '#f1f5f9', text: '#475569' };
      const statusText = statusLabels[equip.status] ?? equip.status;

      doc.fillColor('#0f172a').fontSize(10).font('Helvetica');
      doc.text(
        equip.name,
        cols.nome.x + 8,
        rowY + 9,
        { width: cols.nome.w - 12, ellipsis: true },
      );
      doc.text(
        equip.responsibleEmployee ?? '-',
        cols.responsavel.x + 8,
        rowY + 9,
        { width: cols.responsavel.w - 12, ellipsis: true },
      );

      const badgeW = 80;
      const badgeX = cols.status.x + 8;
      const badgeY = rowY + 6;
      doc.roundedRect(badgeX, badgeY, badgeW, 16, 8).fill(sc.bg);
      doc
        .fillColor(sc.text)
        .fontSize(8)
        .font('Helvetica-Bold')
        .text(statusText, badgeX, badgeY + 4, { width: badgeW, align: 'center' });

      doc.rect(margin, rowY + rowH - 1, contentW, 1).fill('#f1f5f9');

      y += rowH;
    });

    // ── Total ─────────────────────────────────────────────────────────────────
    // quebra de página se o bloco de total não couber
    if (y + 50 > bottomLimit) {
      y = addPage(y);
    }

    y += 16;
    doc.roundedRect(margin, y, contentW, 30, 6).fill('#f1f5f9');
    doc
      .fillColor('#475569')
      .fontSize(10)
      .font('Helvetica')
      .text('Total de equipamentos: ', margin + 14, y + 10);
    doc
      .fillColor('#0f172a')
      .font('Helvetica-Bold')
      .text(`${room.equipments.length}`, margin + 148, y + 10);

    // ── Rodapé da última página ───────────────────────────────────────────────
    drawFooter();

    doc.end();
  }
}
