/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";
import {
  listarEquipamentos,
  excluirEquipamento,
} from "../../services/equipamentoService";
import type Equipment from "../../interfaces/equipamento";
import { notify } from "../../utils/notifications";

const statusLabels: Record<string, string> = {
  DISPONIVEL: "DISPONÍVEL",
  MANUTENCAO: "MANUTENÇÃO",
  INATIVO: "INATIVO",
};

function getStatusStyle(status: string) {
  if (status === "DISPONIVEL") return { bg: "#dcfce7", color: "#166534" };
  if (status === "MANUTENCAO") return { bg: "#fef3c7", color: "#92400e" };
  return { bg: "#fee2e2", color: "#991b1b" };
}

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [equipamentoInfo, setEquipamentoInfo] = useState<Equipment | null>(null);
  const [equipamentoExcluir, setEquipamentoExcluir] = useState<Equipment | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  async function carregarEquipamentos() {
    try {
      setLoading(true);
      setErro("");

      const dados: Equipment[] = await listarEquipamentos();
      setEquipamentos(dados);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os equipamentos.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmarExclusao() {
    if (!equipamentoExcluir) return;

    try {
      setExcluindo(true);

      await excluirEquipamento(equipamentoExcluir.id);

      setEquipamentos((atuais) =>
        atuais.filter((e) => e.id !== equipamentoExcluir.id),
      );

      notify.deleted(equipamentoExcluir.name);
      setEquipamentoExcluir(null);
    } catch (error) {
      console.error(error);
      notify.error("Não foi possível excluir o equipamento.");
    } finally {
      setExcluindo(false);
    }
  }

  const equipamentosFiltrados = equipamentos.filter((equipamento) =>
    [
      equipamento.name,
      equipamento.serialNumber,
      equipamento.room?.name,
      equipamento.status,
    ]
      .filter(Boolean)
      .some((valor) =>
        valor!.toString().toLowerCase().includes(pesquisa.toLowerCase()),
      ),
  );

  return (
    <AppTemplate
      hideDefaultContent={true}
      theme={equipamentosTheme}
      appSubtitle="Gerenciamento de Equipamentos"
      appDescription="Consulte, cadastre e acompanhe os equipamentos disponíveis para reserva."
      primaryAction={{
        label: "Novo Equipamento",
        href: "/reserva-equipamentos/equipamentos/criar",
      }}
      secondaryAction={{
        label: "Atualizar",
        href: "/reserva-equipamentos/equipamentos",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--app-accent)",
            }}
          >
            Equipamentos
          </span>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "24px",
              color: "#111827",
            }}
          >
            Lista de Equipamentos
          </h2>
        </div>
      </header>

      <div style={{ marginBottom: "18px" }}>
        <input
          type="text"
          placeholder="Pesquisar por nome, patrimônio, sala ou status..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "520px",
            padding: "12px 14px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            outline: "none",
            fontSize: "14px",
          }}
        />
      </div>

      {loading && <p>Carregando equipamentos...</p>}

      {erro && (
        <p style={{ color: "#991b1b", fontWeight: 600 }}>{erro}</p>
      )}

      {!loading && !erro && equipamentosFiltrados.length === 0 && (
        <p style={{ color: "#6b7280" }}>Nenhum equipamento encontrado.</p>
      )}

      {!loading && !erro && equipamentosFiltrados.length > 0 && (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "750px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {["ID", "Nome", "Patrimônio", "Sala", "Status", "Ações"].map(
                  (titulo) => (
                    <th
                      key={titulo}
                      style={{
                        textAlign: titulo === "Ações" ? "center" : "left",
                        padding: "14px 12px",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#374151",
                      }}
                    >
                      {titulo}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {equipamentosFiltrados.map((equipamento) => {
                const { bg, color } = getStatusStyle(equipamento.status);

                return (
                  <tr
                    key={equipamento.id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td style={{ padding: "14px 12px", fontWeight: 700 }}>
                      {equipamento.id}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>{equipamento.name}</span>

                        <button
                          type="button"
                          onClick={() => setEquipamentoInfo(equipamento)}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            color: "#374151",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                            flexShrink: 0,
                          }}
                        >
                          i
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {equipamento.serialNumber ?? "-"}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {equipamento.room?.name ?? "-"}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "5px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 800,
                          background: bg,
                          color,
                        }}
                      >
                        {statusLabels[equipamento.status] ?? equipamento.status}
                      </span>
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href = `/reserva-equipamentos/equipamentos/editar/${equipamento.id}`)
                          }
                          style={buttonStyle}
                        >
                          Editar
                        </button>

                        <button type="button" style={buttonStyle}>
                          Relatório
                        </button>

                        <button
                          type="button"
                          onClick={() => setEquipamentoExcluir(equipamento)}
                          style={{ ...buttonStyle, background: "#7f1d1d" }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {equipamentoInfo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "650px",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,.2)",
            }}
          >
            <h2
              style={{
                margin: "0 0 20px",
              }}
            >
              Informações Extras do Equipamento
            </h2>

            {equipamentoInfo.photo && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={`http://localhost:3000/uploads/equipments/${equipamentoInfo.photo}`}
                  alt={equipamentoInfo.name}
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
              <span>{equipamentoInfo.name}</span>

              <strong>Observações</strong>
              <span>{equipamentoInfo.observations || "-"}</span>

              <strong>Instruções</strong>
              <span>{equipamentoInfo.instructions || "-"}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => setEquipamentoInfo(null)}
                style={buttonStyle}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {equipamentoExcluir && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalStyle, maxWidth: "460px" }}>
            <h2 style={{ margin: "0 0 10px" }}>Excluir equipamento</h2>

            <p style={{ color: "#4b5563", lineHeight: 1.5 }}>
              Tem certeza que deseja excluir o equipamento{" "}
              <strong>{equipamentoExcluir.name}</strong>? Essa ação não poderá
              ser desfeita.
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
                onClick={() => setEquipamentoExcluir(null)}
                disabled={excluindo}
                style={{ ...buttonStyle, background: "#6b7280" }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarExclusao}
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
      )}
    </AppTemplate>
  );
}

const buttonStyle: React.CSSProperties = {
  border: "none",
  background: "#111827",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: "9px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "20px",
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "650px",
  maxHeight: "85vh",
  overflowY: "auto",
  boxShadow: "0 20px 40px rgba(0,0,0,.25)",
};
