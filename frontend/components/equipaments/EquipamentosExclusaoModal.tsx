import type Equipment from "../../src/interfaces/equipamento";
import {
  modalOverlayStyle,
  modalBoxStyle,
  buttonStyle,
} from "../../src/styles/equipamentosStyles";

type Props = {
  equipamento: Equipment | null;
  excluindo: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmarExclusaoModal({
  equipamento,
  excluindo,
  onCancel,
  onConfirm,
}: Props) {
  if (!equipamento) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalBoxStyle, maxWidth: "460px" }}>
        <h2 style={{ margin: "0 0 10px" }}>Excluir equipamento</h2>

        <p style={{ color: "#4b5563", lineHeight: 1.5 }}>
          Tem certeza que deseja excluir o equipamento{" "}
          <strong>{equipamento.name}</strong>? Essa ação não poderá ser
          desfeita.
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
            disabled={excluindo}
            style={{ ...buttonStyle, background: "#6b7280" }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={excluindo}
            style={{
              ...buttonStyle,
              background: "#7f1d1d",
              opacity: excluindo ? 0.7 : 1,
              cursor: excluindo ? "not-allowed" : "pointer",
            }}
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
