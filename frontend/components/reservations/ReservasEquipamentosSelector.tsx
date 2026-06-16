import { useMemo, useState } from "react";

import type Equipment from "../../src/interfaces/equipamento";
import type Reservation from "../../src/interfaces/reserva";

import {
  emptyListStyle,
  equipmentCardStyle,
  equipmentHeaderStyle,
  equipmentListStyle,
  selectedCountStyle,
} from "../../src/styles/criarReservaStyles";

type EquipamentoSelecionado = {
  equipmentId: number;
  subdivisionsQuantity: number;
};

type EquipamentosReservaSelectorProps = {
  equipamentos: Equipment[];
  equipamentosSelecionados: EquipamentoSelecionado[];
  reservas: Reservation[];
  startDate: Date | null;
  endDate: Date | null;
  onToggleEquipamento: (id: number) => void;
  onChangeQuantidade: (equipmentId: number, quantidade: number) => void;
};

export default function EquipamentosReservaSelector({
  equipamentos,
  equipamentosSelecionados,
  reservas,
  startDate,
  endDate,
  onToggleEquipamento,
  onChangeQuantidade,
}: EquipamentosReservaSelectorProps) {
  const [pesquisa, setPesquisa] = useState("");

  const equipamentosFiltrados = useMemo(() => {
    const termo = pesquisa.toLowerCase().trim();

    if (!termo) {
      return equipamentos;
    }

    return equipamentos.filter(
      (equipamento) =>
        equipamento.name.toLowerCase().includes(termo) ||
        equipamento.serialNumber?.toLowerCase().includes(termo),
    );
  }, [equipamentos, pesquisa]);

  const selecionados = useMemo(() => {
    return equipamentos.filter((equipamento) =>
      equipamentosSelecionados.some(
        (item) => item.equipmentId === equipamento.id,
      ),
    );
  }, [equipamentos, equipamentosSelecionados]);

  function temConflitoHorario(reserva: Reservation) {
    if (!startDate || !endDate) {
      return false;
    }

    const reservaInicio = new Date(reserva.startDate);
    const reservaFim = new Date(reserva.endDate);

    return startDate < reservaFim && endDate > reservaInicio;
  }

  function calcularSubdivisoesReservadas(equipmentId: number) {
    return reservas
      .filter((reserva) => !reserva.returnedAt)
      .filter(temConflitoHorario)
      .reduce((total, reserva) => {
        const quantidadeNaReserva = reserva.equipments
          .filter((item) => item.equipmentId === equipmentId)
          .reduce((soma, item) => soma + (item.subdivisionsQuantity ?? 1), 0);

        return total + quantidadeNaReserva;
      }, 0);
  }

  return (
    <div>
      <div style={equipmentHeaderStyle}>
        <h3 style={{ margin: 0 }}>Equipamentos</h3>

        <span style={selectedCountStyle}>
          {equipamentosSelecionados.length} selecionado(s)
        </span>
      </div>

      <input
        type="text"
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
        placeholder="Pesquisar equipamento..."
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          marginBottom: "12px",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />

      {selecionados.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          {selecionados.map((equipamento) => (
            <button
              key={equipamento.id}
              type="button"
              onClick={() => onToggleEquipamento(equipamento.id)}
              style={{
                border: "none",
                background: "#dcfce7",
                color: "#166534",
                padding: "8px 12px",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {equipamento.name} ✕
            </button>
          ))}
        </div>
      )}

      <div style={equipmentListStyle}>
        {equipamentosFiltrados.length === 0 && (
          <div style={emptyListStyle}>Nenhum equipamento encontrado.</div>
        )}

        {equipamentosFiltrados.map((equipamento) => {
          const selecionado = equipamentosSelecionados.some(
            (item) => item.equipmentId === equipamento.id,
          );

          const equipamentoSelecionado = equipamentosSelecionados.find(
            (item) => item.equipmentId === equipamento.id,
          );

          const totalSubdivisoes = Math.max(equipamento.subdivisions ?? 1, 1);

          const subdivisoesReservadas = calcularSubdivisoesReservadas(
            equipamento.id,
          );

          const subdivisoesDisponiveis = Math.max(
            totalSubdivisoes - subdivisoesReservadas,
            0,
          );

          const indisponivel = subdivisoesDisponiveis <= 0 && !selecionado;

          return (
            <label
              key={equipamento.id}
              style={{
                ...equipmentCardStyle(selecionado),
                opacity: indisponivel ? 0.55 : 1,
                cursor: indisponivel ? "not-allowed" : "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={selecionado}
                disabled={indisponivel}
                onChange={() => {
                  if (!indisponivel) {
                    onToggleEquipamento(equipamento.id);
                  }
                }}
              />

              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {equipamento.name}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "2px",
                  }}
                >
                  <strong>Local:</strong>{" "}
                  {equipamento.room
                    ? `${equipamento.room.name} - ${equipamento.room.building} - ${equipamento.room.campus}`
                    : "Não informado"}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "2px",
                  }}
                >
                  <strong>Responsável:</strong>{" "}
                  {equipamento.responsibleEmployee || "Não informado"}
                </div>

                {totalSubdivisoes > 1 && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: subdivisoesDisponiveis > 0 ? "#166534" : "#dc2626",
                      marginTop: "2px",
                      fontWeight: 600,
                    }}
                  >
                    Disponível: {subdivisoesDisponiveis} / {totalSubdivisoes}
                  </div>
                )}

                {selecionado && totalSubdivisoes > 1 && (
                  <div style={{ marginTop: "10px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      Quantidade
                    </label>

                    <input
                      type="number"
                      min={1}
                      max={subdivisoesDisponiveis}
                      value={equipamentoSelecionado?.subdivisionsQuantity ?? 1}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const valor = Number(e.target.value);

                        const quantidadeLimitada = Math.min(
                          Math.max(valor, 1),
                          subdivisoesDisponiveis,
                        );

                        onChangeQuantidade(equipamento.id, quantidadeLimitada);
                      }}
                      style={{
                        width: "90px",
                        padding: "6px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
