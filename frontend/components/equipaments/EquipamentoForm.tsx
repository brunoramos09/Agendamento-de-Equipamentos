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
        width: "100%",
        maxWidth: "1000px",
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
          margin: "8px 0 32px",
          fontSize: "22px",
          fontWeight: 600,
        }}
      >
        {titulo}
      </h2>

      <form onSubmit={onSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
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
                  status: e.target.value as
                    | "DISPONIVEL"
                    | "MANUTENCAO"
                    | "INATIVO",
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

          <div />

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Imagem do Equipamento</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  photo: e.target.files?.[0] ?? null,
                })
              }
            />

            {equipamento.photo && (
              <div style={{ marginTop: "16px" }}>
                <img
                  src={URL.createObjectURL(equipamento.photo)}
                  alt="Preview"
                  style={{
                    width: "240px",
                    maxHeight: "240px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    border: "1px solid #ddd",
                    display: "block",
                  }}
                />

                <p
                  style={{
                    marginTop: "10px",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  {equipamento.photo.name}
                </p>
              </div>
            )}
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

          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "10px",
            }}
          >
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
  fontSize: "14px",
  color: "#171717",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #cfcfcf",
  background: "#fff",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
};

const textAreaStyle: CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #cfcfcf",
  background: "#fff",
  fontSize: "15px",
  resize: "vertical",
  boxSizing: "border-box",
  outline: "none",
};

const saveButton: CSSProperties = {
  padding: "12px 20px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "110px",
};

const cancelButton: CSSProperties = {
  padding: "12px 20px",
  background: "#fff",
  color: "#111",
  border: "1px solid #cfcfcf",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "110px",
};
