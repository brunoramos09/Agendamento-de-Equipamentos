/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

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
import { usePageTitle } from "../../hooks/usePageTitle";

import BuscaEquipamentos from "../../../components/equipaments/EquipamentosBusca";
import ConfirmarExclusaoModal from "../../../components/equipaments/EquipamentosExclusaoModal";
import EquipamentosHeader from "../../../components/equipaments/EquipamentosHeader";
import EquipamentosTable from "../../../components/equipaments/EquipamentosTabela";
import FinalizarManutencaoModal from "../../../components/equipaments/EquipamentosFinalizarManutencaoModal";
import InfoEquipamentoModal from "../../../components/equipaments/EquipamentosInfoModal";
import ManutencaoModal from "../../../components/equipaments/EquipamentosManutencaoModal";
import Paginacao from "../../../components/equipaments/EquipamentosPaginacao";
import RelatorioModal from "../../../components/equipaments/EquipamentosRelatorioModal";

import {
  ITENS_POR_PAGINA,
  type FiltroStatus,
} from "../../utils/equipamentosUtils";

import {
  modalOverlayStyle,
  buttonStyle,
} from "../../styles/equipamentosStyles";
import { isAdmin } from "../../utils/authRole";

export default function Equipamentos() {
  const navigate = useNavigate();

  usePageTitle("Equipamentos");

  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  const [equipamentoInfo, setEquipamentoInfo] = useState<Equipment | null>(
    null,
  );

  const [equipamentoExcluir, setEquipamentoExcluir] =
    useState<Equipment | null>(null);

  const [equipamentoManutencao, setEquipamentoManutencao] =
    useState<Equipment | null>(null);

  const [equipamentoFinalizarManutencao, setEquipamentoFinalizarManutencao] =
    useState<Equipment | null>(null);

  const [equipamentoRevisao, setEquipamentoRevisao] =
    useState<Equipment | null>(null);

  const [relatorioUrl, setRelatorioUrl] = useState<string | null>(null);
  const [relatorioId, setRelatorioId] = useState<number | null>(null);

  const [responsavelManutencao, setResponsavelManutencao] = useState("");
  const [obsManutencao, setObsManutencao] = useState("");

  const [excluindo, setExcluindo] = useState(false);
  const [enviandoManutencao, setEnviandoManutencao] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [processandoRevisao, setProcessandoRevisao] = useState(false);

  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("TODOS");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [filtroStatus, pesquisa]);

  const equipamentosFiltrados = useMemo(() => {
    const termo = pesquisa.toLowerCase().trim();

    return equipamentos.filter((equipamento) => {
      const passaFiltroStatus =
        filtroStatus === "TODOS" || equipamento.status === filtroStatus;

      const passaPesquisa = [
        equipamento.name,
        equipamento.serialNumber,
        equipamento.room?.name,
        equipamento.status,
      ]
        .filter(Boolean)
        .some((valor) => valor!.toString().toLowerCase().includes(termo));

      return passaFiltroStatus && passaPesquisa;
    });
  }, [equipamentos, filtroStatus, pesquisa]);

  const totalPaginas = Math.ceil(
    equipamentosFiltrados.length / ITENS_POR_PAGINA,
  );

  const inicio = (pagina - 1) * ITENS_POR_PAGINA;

  const equipamentosPagina = equipamentosFiltrados.slice(
    inicio,
    inicio + ITENS_POR_PAGINA,
  );

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

  function fecharModalManutencao() {
    setEquipamentoManutencao(null);
    setResponsavelManutencao("");
    setObsManutencao("");
  }

  async function handleIniciarManutencao() {
    if (!equipamentoManutencao) return;

    try {
      setEnviandoManutencao(true);

      const formData = new FormData();
      formData.append("status", "MANUTENCAO");
      formData.append("maintenanceResponsiblePerson", responsavelManutencao);
      formData.append("maintenanceObservations", obsManutencao);

      await atualizarEquipamento(equipamentoManutencao.id, formData);

      notify.info(`${equipamentoManutencao.name} enviado para manutenção!`);

      fecharModalManutencao();
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

  async function handleDecisaoRevisao(destino: "MANUTENCAO" | "DISPONIVEL") {
    if (!equipamentoRevisao) return;

    try {
      setProcessandoRevisao(true);

      const formData = new FormData();
      formData.append("status", destino);

      await atualizarEquipamento(equipamentoRevisao.id, formData);

      if (destino === "MANUTENCAO") {
        notify.info(`${equipamentoRevisao.name} enviado para manutenção.`);
      } else {
        notify.success(`${equipamentoRevisao.name} marcado como disponível.`);
      }

      setEquipamentoRevisao(null);
      carregarEquipamentos();
    } catch (error) {
      console.error(error);
      notify.error("Erro ao atualizar status do equipamento.");
    } finally {
      setProcessandoRevisao(false);
    }
  }

  async function confirmarExclusao() {
    if (!equipamentoExcluir) return;

    try {
      setExcluindo(true);

      await excluirEquipamento(equipamentoExcluir.id);

      setEquipamentos((atuais) =>
        atuais.filter(
          (equipamento) => equipamento.id !== equipamentoExcluir.id,
        ),
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

  return (
    <AppTemplate
      hideDefaultContent={true}
      theme={equipamentosTheme}
      appSubtitle="Gerenciamento de Equipamentos"
      appDescription="Consulte, cadastre e acompanhe os equipamentos disponíveis para reserva."
      primaryAction={
        isAdmin()
          ? {
              label: "Novo Equipamento",
              href: "/reserva-equipamentos/equipamentos/criar",
            }
          : null
      }
      secondaryAction={null}
    >
      <EquipamentosHeader
        filtroStatus={filtroStatus}
        onChangeFiltro={setFiltroStatus}
      />

      <BuscaEquipamentos pesquisa={pesquisa} onChangePesquisa={setPesquisa} />

      {loading && <p>Carregando equipamentos...</p>}

      {erro && <p style={{ color: "#991b1b", fontWeight: 600 }}>{erro}</p>}

      {!loading && !erro && equipamentosFiltrados.length === 0 && (
        <p style={{ color: "#6b7280" }}>Nenhum equipamento encontrado.</p>
      )}

      {!loading && !erro && equipamentosFiltrados.length > 0 && (
        <>
          <EquipamentosTable
            equipamentos={equipamentosPagina}
            onInfo={setEquipamentoInfo}
            onEditar={(id) =>
              navigate(`/reserva-equipamentos/equipamentos/editar/${id}`)
            }
            onRelatorio={handleGerarRelatorio}
            onManutencao={setEquipamentoManutencao}
            onFinalizarManutencao={setEquipamentoFinalizarManutencao}
            onExcluir={setEquipamentoExcluir}
            onRevisao={setEquipamentoRevisao}
          />

          <Paginacao
            pagina={pagina}
            totalPaginas={totalPaginas}
            inicio={inicio}
            itensPorPagina={ITENS_POR_PAGINA}
            totalItens={equipamentosFiltrados.length}
            onChangePagina={setPagina}
          />
        </>
      )}

      <InfoEquipamentoModal
        equipamento={equipamentoInfo}
        onClose={() => setEquipamentoInfo(null)}
      />

      <ConfirmarExclusaoModal
        equipamento={equipamentoExcluir}
        excluindo={excluindo}
        onCancel={() => setEquipamentoExcluir(null)}
        onConfirm={confirmarExclusao}
      />

      <ManutencaoModal
        equipamento={equipamentoManutencao}
        responsavel={responsavelManutencao}
        observacoes={obsManutencao}
        enviando={enviandoManutencao}
        onChangeResponsavel={setResponsavelManutencao}
        onChangeObservacoes={setObsManutencao}
        onCancel={fecharModalManutencao}
        onConfirm={handleIniciarManutencao}
      />

      <FinalizarManutencaoModal
        equipamento={equipamentoFinalizarManutencao}
        finalizando={finalizando}
        onCancel={() => setEquipamentoFinalizarManutencao(null)}
        onConfirm={handleFinalizarManutencao}
      />

      <RelatorioModal
        relatorioUrl={relatorioUrl}
        onDownload={handleDownloadRelatorio}
        onClose={handleFecharRelatorio}
      />

      {equipamentoRevisao && (
        <div style={modalOverlayStyle}>
          <div style={revisaoModalStyle}>
            <h2 style={{ margin: "0 0 8px" }}>Revisão de equipamento</h2>

            <p
              style={{
                color: "#4b5563",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              Equipamento <strong>{equipamentoRevisao.name}</strong> foi
              devolvido com problema relatado. Como deseja prosseguir?
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setEquipamentoManutencao(equipamentoRevisao);
                  setEquipamentoRevisao(null);
                }}
                disabled={processandoRevisao}
                style={{
                  ...buttonStyle,
                  background: "#92400e",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  opacity: processandoRevisao ? 0.7 : 1,
                  cursor: processandoRevisao ? "not-allowed" : "pointer",
                }}
              >
                <span style={{ fontWeight: 700 }}>Enviar para manutenção</span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    opacity: 0.85,
                  }}
                >
                  O equipamento tinha um problema e precisa de reparo.
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDecisaoRevisao("DISPONIVEL")}
                disabled={processandoRevisao}
                style={{
                  ...buttonStyle,
                  background: "#166534",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  opacity: processandoRevisao ? 0.7 : 1,
                  cursor: processandoRevisao ? "not-allowed" : "pointer",
                }}
              >
                <span style={{ fontWeight: 700 }}>Marcar como disponível</span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    opacity: 0.85,
                  }}
                >
                  O equipamento está funcionando corretamente.
                </span>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => setEquipamentoRevisao(null)}
                disabled={processandoRevisao}
                style={{ ...buttonStyle, background: "#6b7280" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppTemplate>
  );
}

const revisaoModalStyle: CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "480px",
  boxShadow: "0 20px 40px rgba(0,0,0,.25)",
};
