import type Reservation from "../../src/interfaces/reserva";
import {
  buttonStyle,
  modalOverlayStyle,
  modalStyle,
} from "../../src/styles/reservaStyles";

type ConfirmarExclusaoReservaModalProps = {
  reserva: Reservation;
  excluindo: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmarExclusaoReservaModal({
  reserva,
  excluindo,
  onCancel,
  onConfirm,
}: ConfirmarExclusaoReservaModalProps) {
  return (
    <div style={modalOverlayStyle}>
      <div
        style={{
          ...modalStyle,
          maxWidth: "460px",
        }}
      >
        <h2 style={{ margin: "0 0 10px" }}>Excluir reserva</h2>

        <p
          style={{
            color: "#4b5563",
            lineHeight: 1.5,
          }}
        >
          Tem certeza que deseja excluir a reserva{" "}
          <strong>#{reserva.id}</strong>? Essa ação não poderá ser desfeita.
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
            style={{
              ...buttonStyle,
              background: "#6b7280",
            }}
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
