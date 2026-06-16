import { FiTrash2 } from "react-icons/fi";
import { equipmentFileUrl } from "../../../src/services/api";
import type { EquipamentoFormData } from "../../../src/interfaces/equipamentoFormData";
import { labelStyle } from "../../../src/styles/equipamentoFormStyles";

type Props = {
  equipamento: EquipamentoFormData;
  setEquipamento: React.Dispatch<React.SetStateAction<EquipamentoFormData>>;
};

export default function EquipamentoDocumentsUpload({
  equipamento,
  setEquipamento,
}: Props) {
  return (
    <div>
      <label style={labelStyle}>Documentos do Equipamento</label>

      <div
        style={{
          padding: "18px",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          display: "flex",
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          flexDirection: "column",
          minHeight: "176px",
        }}
      >
        {equipamento.attachedDocuments &&
          equipamento.attachedDocuments.length > 0 && (
            <>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "10px",
                }}
              >
                Documentos atuais
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {equipamento.attachedDocuments.map((doc, index) => (
                  <a
                    key={index}
                    href={equipmentFileUrl(doc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    {doc.replace(/^\d+-/, "")}
                  </a>
                ))}
              </div>
            </>
          )}

        {equipamento.documents && equipamento.documents.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {equipamento.documents.map((file, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "8px 10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#f9fafb",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    wordBreak: "break-word",
                    fontSize: "14px",
                  }}
                >
                  {file.name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setEquipamento({
                      ...equipamento,
                      documents: equipamento.documents?.filter(
                        (_, i) => i !== index,
                      ),
                    })
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          style={{
            width: "fit-content",
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            cursor: "pointer",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Selecionar PDFs
          <input
            type="file"
            accept="application/pdf"
            multiple
            disabled={(equipamento.documents?.length ?? 0) >= 3}
            style={{ display: "none" }}
            onChange={(e) => {
              const novosArquivos = Array.from(e.target.files ?? []);

              setEquipamento({
                ...equipamento,
                documents: [
                  ...(equipamento.documents ?? []),
                  ...novosArquivos,
                ].slice(0, 3),
              });
            }}
          />
        </label>
      </div>
    </div>
  );
}
