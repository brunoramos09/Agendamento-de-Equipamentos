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
      <div style={{ ...modalBoxStyle, maxWidth: "650px" }}>
        <h2 style={{ margin: "0 0 20px" }}>
          Informações Extras do Equipamento
        </h2>

        {equipamento.photo && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={`${filesUrl}/uploads/equipments/${equipamento.photo}`}
              alt={equipamento.name}
              style={{
                width: "auto",
                maxWidth: "250px",
                maxHeight: "200px",
                objectFit: "contain",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
              }}
            />
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            gap: "12px",
          }}
        >
          <strong>Nome</strong>
          <span>{equipamento.name}</span>

          <strong>Observações</strong>
          <span>{equipamento.observations || "-"}</span>

          <strong>Instruções</strong>
          <span>{equipamento.instructions || "-"}</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <button type="button" onClick={onClose} style={buttonStyle}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
