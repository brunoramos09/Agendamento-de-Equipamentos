/* eslint-disable react-refresh/only-export-components */
import type { CSSProperties } from "react";
import type Room from "../../src/interfaces/sala";
import type { EquipamentoFormData } from "./types";

type StatusOption = {
  value: "DISPONIVEL" | "MANUTENCAO" | "INATIVO";
  label: string;
};

const allStatusOptions: StatusOption[] = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "MANUTENCAO", label: "Manutenção" },
  { value: "INATIVO", label: "Inativo" },
];

const editStatusOptions: StatusOption[] = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "INATIVO", label: "Inativo" },
];

interface Props {
  titulo: string;
  equipamento: EquipamentoFormData;
  setEquipamento: React.Dispatch<React.SetStateAction<EquipamentoFormData>>;
  salas: Room[];
  carregandoSalas: boolean;
  salvando: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  statusOptions?: StatusOption[];
  statusDisabled?: boolean;
}

export { allStatusOptions, editStatusOptions };

export default function EquipamentoForm({
  titulo,
  equipamento,
  setEquipamento,
  salas,
  carregandoSalas,
  salvando,
  onSubmit,
  onCancel,
  statusOptions = allStatusOptions,
  statusDisabled = false,
}: Props) {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div
        style={{
          marginBottom: "32px",
          paddingBottom: "20px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--app-accent)",
          }}
        >
          Equipamentos
        </span>

        <h2
          style={{
            margin: "8px 0 0",
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {titulo}
        </h2>
      </div>

      <form onSubmit={onSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          <div>
            <label style={labelStyle}>Nome</label>

            <input
              required
              value={equipamento.name}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  name: e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Patrimônio</label>

            <input
              value={equipamento.serialNumber}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  serialNumber: e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Responsável</label>

            <input
              value={equipamento.responsibleEmployee}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  responsibleEmployee: e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Sala</label>

            <select
              required
              disabled={carregandoSalas}
              value={equipamento.roomId}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  roomId: Number(e.target.value),
                })
              }
              style={inputStyle}
            >
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.name} - {sala.building}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Status</label>

            <select
              value={equipamento.status}
              disabled={statusDisabled}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  status: e.target.value as "DISPONIVEL" | "INATIVO",
                })
              }
              style={{
                ...inputStyle,
                ...(statusDisabled && {
                  background: "#f3f4f6",
                  color: "#6b7280",
                  cursor: "not-allowed",
                }),
              }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Imagem do Equipamento</label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "18px",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                background: "#fff",
                width: "fit-content",
                minWidth: "420px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {equipamento.photo ? (
                <img
                  src={URL.createObjectURL(equipamento.photo)}
                  alt="Preview"
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "14px",
                    border: "2px dashed #d1d5db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "42px",
                    background: "#f9fafb",
                    flexShrink: 0,
                  }}
                ></div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {equipamento.photo
                    ? equipamento.photo.name
                    : "Nenhuma imagem selecionada"}
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  {equipamento.photo
                    ? `${(equipamento.photo.size / 1024).toFixed(1)} KB`
                    : ""}
                </div>

                <label
                  style={{
                    marginTop: "8px",
                    width: "fit-content",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    background: "#f9fafb",
                    cursor: "pointer",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {equipamento.photo ? "Trocar imagem" : "Selecionar imagem"}

                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setEquipamento({
                        ...equipamento,
                        photo: e.target.files?.[0] ?? null,
                      })
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Observações</label>

            <textarea
              rows={4}
              value={equipamento.observations}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  observations: e.target.value,
                })
              }
              style={textAreaStyle}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Instruções</label>

            <textarea
              rows={4}
              value={equipamento.instructions}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  instructions: e.target.value,
                })
              }
              style={textAreaStyle}
            />
          </div>

          <div style={actionsStyle}>
            <button type="button" onClick={onCancel} style={cancelButton}>
              Cancelar
            </button>

            <button type="submit" disabled={salvando} style={saveButton}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 600,
  color: "#374151",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "#f9fafb",
  fontSize: "14px",
  boxSizing: "border-box",
};

const textAreaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
};

const actionsStyle: CSSProperties = {
  gridColumn: "1 / -1",
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "12px",
  flexWrap: "wrap",
};

const cancelButton: CSSProperties = {
  padding: "12px 20px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 500,
};

const saveButton: CSSProperties = {
  padding: "12px 24px",
  border: "none",
  borderRadius: "12px",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "160px",
};
