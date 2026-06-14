import {
  buttonStyle,
  modalOverlayStyle,
} from "../../src/styles/equipamentosStyles";

type Props = {
  relatorioUrl: string | null;
  onDownload: () => void;
  onClose: () => void;
};

export default function RelatorioModal({
  relatorioUrl,
  onDownload,
  onClose,
}: Props) {
  if (!relatorioUrl) return null;

  return (
    <div style={modalOverlayStyle}>
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
          maxWidth: "90%",
          width: "1000px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h2 style={{ margin: 0 }}>Visualização do Relatório</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onDownload}
              style={{ ...buttonStyle, background: "#166534" }}
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ ...buttonStyle, background: "#6b7280" }}
            >
              Voltar
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            width: "100%",
            background: "#f3f4f6",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <iframe
            src={`${relatorioUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            title="Relatório de Equipamento"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
