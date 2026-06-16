import {
  actionsStyle,
  cancelButtonStyle,
  submitButtonStyle,
} from "../../src/styles/criarReservaStyles";

type ReservaFormActionsProps = {
  salvando: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function ReservaFormActions({
  salvando,
  onCancel,
  onSubmit,
}: ReservaFormActionsProps) {
  return (
    <div style={actionsStyle}>
      <button type="button" onClick={onCancel} style={cancelButtonStyle}>
        Cancelar
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={salvando}
        style={{
          ...submitButtonStyle,
          opacity: salvando ? 0.7 : 1,
          cursor: salvando ? "not-allowed" : "pointer",
        }}
      >
        {salvando ? "Salvando..." : "Criar Reserva"}
      </button>
    </div>
  );
}
