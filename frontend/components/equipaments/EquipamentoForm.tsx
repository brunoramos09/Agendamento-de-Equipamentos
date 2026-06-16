/* eslint-disable react-refresh/only-export-components */
import type { CSSProperties } from "react";
import type Room from "../../src/interfaces/sala";
import type { EquipamentoFormData } from "./types";
import { FiTrash2 } from "react-icons/fi";
import { equipmentFileUrl } from "../../src/services/api";

type StatusOption = {
  value: "DISPONIVEL" | "MANUTENCAO" | "INATIVO";
  label: string;
};

const allStatusOptions: StatusOption[] = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "MANUTENCAO", label: "Manutenção" },
  { value: "INATIVO", label: "Inativo" },
];

const editStatusOptions: StatusOption[] = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "INATIVO", label: "Inativo" },
];

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

export { allStatusOptions, editStatusOptions };

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
        margin: "0 auto",
        width: "100%",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
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
              value={equipamento.status}
              disabled={statusDisabled}
              onChange={(e) =>
                setEquipamento({
                  ...equipamento,
                  status: e.target.value as "DISPONIVEL" | "INATIVO",
                })
              }
              style={{
                ...inputStyle,
                ...(statusDisabled && {
                  background: "#f3f4f6",
                  color: "#6b7280",
                  cursor: "not-allowed",
                }),
              }}
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
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              {/* IMAGEM */}
              <div>
                <label style={labelStyle}>Imagem do Equipamento</label>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    padding: "18px",
                    border: "1px solid #e5e7eb",
                    minWidth: "200px",
                    borderRadius: "16px",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {equipamento.photo ? (
                    <img
                      src={URL.createObjectURL(equipamento.photo)}
                      alt="Preview"
                      style={imageStyle}
                    />
                  ) : equipamento.photoUrl ? (
                    <img
                      src={equipmentFileUrl(equipamento.photoUrl)}
                      alt="Preview"
                      style={imageStyle}
                    />
                  ) : (
                    <div
                      style={{
                        width: "140px",
                        height: "140px",
                        borderRadius: "14px",
                        border: "2px dashed #d1d5db",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "42px",
                        background: "#f9fafb",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {equipamento.photo
                        ? equipamento.photo.name
                        : equipamento.photoUrl
                          ? equipamento.photoUrl.replace(/^\d+-/, "")
                          : "Nenhuma imagem selecionada"}
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {equipamento.photo
                        ? `${(equipamento.photo.size / 1024).toFixed(1)} KB`
                        : ""}
                    </div>

                    <label
                      style={{
                        marginTop: "8px",
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
                      {equipamento.photo
                        ? "Trocar imagem"
                        : "Selecionar imagem"}

                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          setEquipamento({
                            ...equipamento,
                            photo: e.target.files?.[0] ?? null,
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
              {/* DOCUMENTOS */}
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
                    minWidth: "400px",
                    flexDirection: "column",
                    minHeight: "176px",
                  }}
                >
                  {equipamento.attachedDocuments &&
                    equipamento.attachedDocuments?.length > 0 && (
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
                          {equipamento.attachedDocuments?.map((doc, index) => (
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

                  {equipamento.documents &&
                    equipamento.documents.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          marginBottom: "16px",
                        }}
                      >
                        {equipamento.documents?.map((file, index) => (
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
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
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
                      disabled={(equipamento.documents?.length ?? 0) >= 3}
                      multiple
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

          <div style={actionsStyle}>
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

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "10px",
  fontWeight: 700,
  fontSize: "14px",
  color: "#111827",
  letterSpacing: "0.01em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  border: "1px solid #dbe2ea",
  borderRadius: "14px",
  background: "#ffffff",
  fontSize: "14px",
  boxSizing: "border-box",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const textAreaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
};

const actionsStyle: CSSProperties = {
  gridColumn: "1 / -1",
  display: "flex",
  justifyContent: "flex-end",
  gap: "14px",
  marginTop: "24px",
  paddingTop: "24px",
  borderTop: "1px solid #e5e7eb",
  flexWrap: "wrap",
};

const cancelButton: CSSProperties = {
  padding: "13px 22px",
  border: "1px solid #d1d5db",
  borderRadius: "14px",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const saveButton: CSSProperties = {
  padding: "13px 28px",
  border: "none",
  borderRadius: "14px",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  minWidth: "180px",
  boxShadow: "0 8px 20px rgba(17,24,39,0.18)",
};

const imageStyle = {
  width: "160px",
  height: "160px",
  objectFit: "cover" as const,
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
  flexShrink: 0,
};
