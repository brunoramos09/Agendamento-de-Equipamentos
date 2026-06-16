import type Equipment from "../../src/interfaces/equipamento";
import {
  buttonStyle,
  inputStyle,
  modalBoxStyle,
  modalOverlayStyle,
} from "../../src/styles/equipamentosStyles";

type Props = {
  equipamento: Equipment | null;
  responsavel: string;
  observacoes: string;
  enviando: boolean;
  onChangeResponsavel: (valor: string) => void;
  onChangeObservacoes: (valor: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ManutencaoModal({
  equipamento,
  responsavel,
  observacoes,
  enviando,
  onChangeResponsavel,
  onChangeObservacoes,
  onCancel,
  onConfirm,
}: Props) {
  if (!equipamento) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalBoxStyle, maxWidth: "500px" }}>
        <h2 style={{ margin: "0 0 20px" }}>Iniciar Manutenção</h2>
        <p style={{ marginBottom: "15px", color: "#4b5563" }}>
          Equipamento: <strong>{equipamento.name}</strong>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "5px",
              }}
            >
              Responsável
            </label>
            <input
              type="text"
              value={responsavel}
              onChange={(e) => onChangeResponsavel(e.target.value)}
              placeholder="Nome do técnico ou empresa"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "5px",
              }}
            >
              Observações
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => onChangeObservacoes(e.target.value)}
              placeholder="Descreva o problema ou serviço..."
              style={{ ...inputStyle, height: "100px", resize: "none" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={enviando}
            style={{ ...buttonStyle, background: "#6b7280" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={enviando}
            style={{
              ...buttonStyle,
              background: "#92400e",
              opacity: enviando ? 0.7 : 1,
            }}
          >
            {enviando ? "Processando..." : "Confirmar Manutenção"}
          </button>
        </div>
      </div>
    </div>
  );
}
