import type Equipment from "../../src/interfaces/equipamento";
import { filesUrl } from "../../src/utils/equipamentosUtils";
import {
  modalOverlayStyle,
  modalBoxStyle,
  buttonStyle,
} from "../../src/styles/equipamentosStyles";

type Props = {
  equipamento: Equipment | null;
  onClose: () => void;
};

export default function InfoEquipamentoModal({ equipamento, onClose }: Props) {
  if (!equipamento) return null;

  return (
    <div style={modalOverlayStyle}>
      <div
        style={{
          ...modalBoxStyle,
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "16px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              color: "#111827",
            }}
          >
            {equipamento.name}
          </h2>

          <span
            style={{
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Informações completas do equipamento
          </span>
        </div>

        {equipamento.photo && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <img
              src={`${filesUrl}/uploads/equipments/${equipamento.photo}`}
              alt={equipamento.name}
              style={{
                width: "100%",
                maxWidth: "300px",
                maxHeight: "220px",
                objectFit: "contain",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
                background: "#fafafa",
                padding: "12px",
              }}
            />
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <strong>Nome</strong>
          <span>{equipamento.name}</span>

          <strong>Patrimônio</strong>
          <span>{equipamento.serialNumber || "-"}</span>

          <strong>Responsável</strong>
          <span>{equipamento.responsibleEmployee || "-"}</span>

          <strong>Status</strong>
          <span>{equipamento.status || "-"}</span>
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
            }}
          >
            Observações
          </h3>

          <p
            style={{
              margin: 0,
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            {equipamento.observations || "Nenhuma observação cadastrada."}
          </p>
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
            }}
          >
            Instruções de Uso
          </h3>

          <p
            style={{
              margin: 0,
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            {equipamento.instructions || "Nenhuma instrução cadastrada."}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              ...buttonStyle,
              minWidth: "120px",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
