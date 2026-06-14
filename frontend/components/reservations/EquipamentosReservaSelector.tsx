import { useMemo, useState } from "react";

import type Equipment from "../../src/interfaces/equipamento";

import {
  emptyListStyle,
  equipmentCardStyle,
  equipmentHeaderStyle,
  equipmentListStyle,
  selectedCountStyle,
} from "../../src/styles/criarReservaStyles";

type EquipamentosReservaSelectorProps = {
  equipamentos: Equipment[];
  equipamentosSelecionados: { equipmentId: number }[];
  onToggleEquipamento: (id: number) => void;
};

export default function EquipamentosReservaSelector({
  equipamentos,
  equipamentosSelecionados,
  onToggleEquipamento,
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

          return (
            <label key={equipamento.id} style={equipmentCardStyle(selecionado)}>
              <input
                type="checkbox"
                checked={selecionado}
                onChange={() => onToggleEquipamento(equipamento.id)}
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
                  Patrimônio: {equipamento.serialNumber || "Não informado"}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
