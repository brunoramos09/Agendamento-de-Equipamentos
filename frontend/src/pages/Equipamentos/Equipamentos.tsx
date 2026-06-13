import { useEffect, useState } from "react";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";
import {
  listarEquipamentos,
  excluirEquipamento,
  gerarRelatorioEquipamento,
  atualizarEquipamento,
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

type FiltroStatus = "TODOS" | "DISPONIVEL" | "MANUTENCAO" | "INATIVO";

const filtroOptions: { value: FiltroStatus; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "DISPONIVEL", label: "Disponíveis" },
  { value: "MANUTENCAO", label: "Em manutenção" },
  { value: "INATIVO", label: "Inativos" },
];

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [equipamentoInfo, setEquipamentoInfo] = useState<Equipment | null>(
    null,
  );
  const [equipamentoExcluir, setEquipamentoExcluir] =
    useState<Equipment | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [relatorioUrl, setRelatorioUrl] = useState<string | null>(null);
  const [relatorioId, setRelatorioId] = useState<number | null>(null);
  const [equipamentoManutencao, setEquipamentoManutencao] =
    useState<Equipment | null>(null);
  const [responsavelManutencao, setResponsavelManutencao] = useState("");
  const [obsManutencao, setObsManutencao] = useState("");
  const [enviandoManutencao, setEnviandoManutencao] = useState(false);
  const [equipamentoFinalizarManutencao, setEquipamentoFinalizarManutencao] =
    useState<Equipment | null>(null);
  const [finalizando, setFinalizando] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("TODOS");

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

  async function handleGerarRelatorio(id: number) {
    try {
      const blob = await gerarRelatorioEquipamento(id);
      const url = window.URL.createObjectURL(blob);
      setRelatorioUrl(url);
      setRelatorioId(id);
    } catch (error) {
      console.error(error);
      notify.error("Erro ao gerar relatório.");
    }
  }

  function handleDownloadRelatorio() {
    if (!relatorioUrl || !relatorioId) return;
    try {
      notify.info("Iniciando download...");
      const a = document.createElement("a");
      a.href = relatorioUrl;
      a.download = `relatorio-equipamento-${relatorioId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      notify.info("Download concluído com sucesso!");
    } catch (error) {
      console.error(error);
      notify.error("Erro ao realizar download.");
    }
  }

  function handleFecharRelatorio() {
    if (relatorioUrl) {
      window.URL.revokeObjectURL(relatorioUrl);
    }
    setRelatorioUrl(null);
    setRelatorioId(null);
  }

  async function handleIniciarManutencao() {
    if (!equipamentoManutencao) return;

    try {
      setEnviandoManutencao(true);

      const payload = {
        status: "MANUTENCAO",
        maintenanceResponsiblePerson: responsavelManutencao,
        maintenanceObservations: obsManutencao,
      };

      const formData = new FormData();
      formData.append("status", payload.status);
      formData.append(
        "maintenanceResponsiblePerson",
        payload.maintenanceResponsiblePerson,
      );
      formData.append(
        "maintenanceObservations",
        payload.maintenanceObservations,
      );
      await atualizarEquipamento(equipamentoManutencao.id, formData);

      notify.info(`${equipamentoManutencao.name} enviado para manutenção!`);
      setEquipamentoManutencao(null);
      setResponsavelManutencao("");
      setObsManutencao("");
      carregarEquipamentos();
    } catch (error) {
      console.error(error);
      notify.error("Erro ao iniciar manutenção.");
    } finally {
      setEnviandoManutencao(false);
    }
  }

  async function handleFinalizarManutencao() {
    if (!equipamentoFinalizarManutencao) return;

    try {
      setFinalizando(true);
      const formData = new FormData();
      formData.append("status", "DISPONIVEL");
      await atualizarEquipamento(equipamentoFinalizarManutencao.id, formData);
      notify.success(
        `Manutenção de ${equipamentoFinalizarManutencao.name} finalizada!`,
      );
      setEquipamentoFinalizarManutencao(null);
      carregarEquipamentos();
    } catch (error) {
      console.error(error);
      notify.error("Erro ao finalizar manutenção.");
    } finally {
      setFinalizando(false);
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

  const equipamentosFiltrados = equipamentos.filter((equipamento) => {
    const passaFiltroStatus =
      filtroStatus === "TODOS" || equipamento.status === filtroStatus;

    const passaPesquisa = [
      equipamento.name,
      equipamento.serialNumber,
      equipamento.room?.name,
      equipamento.status,
    ]
      .filter(Boolean)
      .some((valor) =>
        valor!.toString().toLowerCase().includes(pesquisa.toLowerCase()),
      );

    return passaFiltroStatus && passaPesquisa;
  });

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

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {filtroOptions.map((opcao) => {
            const ativo = filtroStatus === opcao.value;
            const { bg, color } =
              opcao.value === "TODOS"
                ? { bg: "#111827", color: "#fff" }
                : getStatusStyle(opcao.value);

            return (
              <button
                key={opcao.value}
                type="button"
                onClick={() => setFiltroStatus(opcao.value)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "999px",
                  border: ativo ? "none" : "1px solid #d1d5db",
                  background: ativo
                    ? opcao.value === "TODOS"
                      ? bg
                      : bg
                    : "#fff",
                  color: ativo
                    ? opcao.value === "TODOS"
                      ? color
                      : color
                    : "#374151",
                  fontSize: "13px",
                  fontWeight: ativo ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {opcao.label}
              </button>
            );
          })}
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

      {erro && <p style={{ color: "#991b1b", fontWeight: 600 }}>{erro}</p>}

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
                  ),
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

                        <button
                          type="button"
                          onClick={() => handleGerarRelatorio(equipamento.id)}
                          style={buttonStyle}
                        >
                          Relatório
                        </button>

                        {equipamento.status === "DISPONIVEL" && (
                          <button
                            type="button"
                            onClick={() =>
                              setEquipamentoManutencao(equipamento)
                            }
                            style={{ ...buttonStyle, background: "#92400e" }}
                          >
                            Manutenção
                          </button>
                        )}

                        {equipamento.status === "MANUTENCAO" && (
                          <button
                            type="button"
                            onClick={() =>
                              setEquipamentoFinalizarManutencao(equipamento)
                            }
                            style={{ ...buttonStyle, background: "#166534" }}
                          >
                            Finalizar
                          </button>
                        )}

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
          <div style={{ ...ExcluirModalStyle, maxWidth: "460px" }}>
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

      {equipamentoManutencao && (
        <div style={modalOverlayStyle}>
          <div style={{ ...ManutencaoModalStyle, maxWidth: "500px" }}>
            <h2 style={{ margin: "0 0 20px" }}>Iniciar Manutenção</h2>
            <p style={{ marginBottom: "15px", color: "#4b5563" }}>
              Equipamento: <strong>{equipamentoManutencao.name}</strong>
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
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
                  value={responsavelManutencao}
                  onChange={(e) => setResponsavelManutencao(e.target.value)}
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
                  value={obsManutencao}
                  onChange={(e) => setObsManutencao(e.target.value)}
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
                onClick={() => setEquipamentoManutencao(null)}
                disabled={enviandoManutencao}
                style={{ ...buttonStyle, background: "#6b7280" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleIniciarManutencao}
                disabled={enviandoManutencao}
                style={{
                  ...buttonStyle,
                  background: "#92400e",
                  opacity: enviandoManutencao ? 0.7 : 1,
                }}
              >
                {enviandoManutencao ? "Processando..." : "Confirmar Manutenção"}
              </button>
            </div>
          </div>
        </div>
      )}

      {equipamentoFinalizarManutencao && (
        <div style={modalOverlayStyle}>
          <div style={{ ...finalizarManutencaoModalStyle, maxWidth: "460px" }}>
            <h2 style={{ margin: "0 0 10px" }}>Finalizar manutenção</h2>

            <p style={{ color: "#4b5563", lineHeight: 1.5 }}>
              Deseja finalizar a manutenção do equipamento{" "}
              <strong>{equipamentoFinalizarManutencao.name}</strong>? O status
              será alterado para <strong>DISPONÍVEL</strong>.
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
                onClick={() => setEquipamentoFinalizarManutencao(null)}
                disabled={finalizando}
                style={{ ...buttonStyle, background: "#6b7280" }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleFinalizarManutencao}
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
      )}

      {relatorioUrl && (
        <div style={modalOverlayStyle}>
          <div
            style={{
              ...RelatorioModalStyle,
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
                  onClick={handleDownloadRelatorio}
                  style={{ ...buttonStyle, background: "#166534" }}
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={handleFecharRelatorio}
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
      )}
    </AppTemplate>
  );
}

const ExcluirModalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  width: "100%",
  padding: "24px",
  boxShadow: "0 20px 40px rgba(0,0,0,.2)",
};

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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
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

const RelatorioModalStyle: React.CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "650px",
  maxHeight: "85vh",
  overflowY: "auto",
  boxShadow: "0 20px 40px rgba(0,0,0,.25)",
};

const ManutencaoModalStyle: React.CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 20px 40px rgba(0,0,0,.25)",
};

const finalizarManutencaoModalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  width: "100%",
  padding: "24px",
  boxShadow: "0 20px 40px rgba(0,0,0,.2)",
};
