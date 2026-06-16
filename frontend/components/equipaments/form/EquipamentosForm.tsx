import type Room from "../../../src/interfaces/sala";
import type { EquipamentoFormData } from "../../../src/interfaces/equipamentoFormData";

import {
  actionsStyle,
  cancelButton,
  labelStyle,
  saveButton,
  inputStyle,
  textAreaStyle,
} from "../../../src/styles/equipamentoFormStyles";

import {
  allStatusOptions,
  type StatusOption,
} from "../../../src/utils/equipamentoFormConstants";

import EquipamentoImageUpload from "./EquipamentoFormImageUpload";
import EquipamentoDocumentsUpload from "./EquipamentoFormDocumentsUpload";

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
        width: "100%",
        margin: "0 auto",
        padding: "0 16px",
        boxSizing: "border-box",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
            width: "100%",
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
              required
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
            <label style={labelStyle}>Quantidade de Subdivisões</label>

            <input
              type="number"
              min={0}
              value={equipamento.subdivisions ?? ""}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  subdivisions:
                    e.target.value === "" ? null : Number(e.target.value),
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
              required
              value={equipamento.status}
              disabled={statusDisabled}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  status: e.target.value as never,
                })
              }
              style={inputStyle}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                width: "100%",
              }}
            >
              <EquipamentoImageUpload
                equipamento={equipamento}
                setEquipamento={setEquipamento}
              />

              <EquipamentoDocumentsUpload
                equipamento={equipamento}
                setEquipamento={setEquipamento}
              />
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

          <div
            style={{
              ...actionsStyle,
              gridColumn: "1 / -1",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              flexWrap: "wrap",
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
