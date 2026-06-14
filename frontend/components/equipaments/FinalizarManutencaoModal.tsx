import type Equipment from "../../src/interfaces/equipamento";
import {
  modalOverlayStyle,
  modalBoxStyle,
  buttonStyle,
} from "../../src/styles/equipamentosStyles";

type Props = {
  equipamento: Equipment | null;
  finalizando: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function FinalizarManutencaoModal({
  equipamento,
  finalizando,
  onCancel,
  onConfirm,
}: Props) {
  if (!equipamento) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalBoxStyle, maxWidth: "460px" }}>
        <h2 style={{ margin: "0 0 10px" }}>Finalizar manutenção</h2>

        <p style={{ color: "#4b5563", lineHeight: 1.5 }}>
          Deseja finalizar a manutenção do equipamento{" "}
          <strong>{equipamento.name}</strong>? O status será alterado para{" "}
          <strong>DISPONÍVEL</strong>.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "22px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={finalizando}
            style={{ ...buttonStyle, background: "#6b7280" }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={finalizando}
            style={{
              ...buttonStyle,
              background: "#166534",
              opacity: finalizando ? 0.7 : 1,
              cursor: finalizando ? "not-allowed" : "pointer",
            }}
          >
            {finalizando ? "Finalizando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
