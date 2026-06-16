/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";
import { 
  listarSalas, 
  excluirSala,
  gerarRelatorioSala,
} from "../../services/salasService";
import type Room from "../../interfaces/sala";
import { notify } from "../../utils/notifications";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useNavigate } from "react-router-dom";

import SalasPageHeader from "../../../components/rooms/SalasPageHeader";
import SalasSearchBar from "../../../components/rooms/SalasSearchBar";
import SalasTable from "../../../components/rooms/SalasTable";
import SalasPagination from "../../../components/rooms/SalasPagination";
import ConfirmDeleteRoomModal from "../../../components/rooms/ConfirmDeleteRoomModal";
import RelatorioModal from "../../../components/equipaments/RelatorioModal";

const ITENS_POR_PAGINA = 8;

export default function Salas() {
  const [salas, setSalas] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [salaExcluir, setSalaExcluir] = useState<Room | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [relatorioUrl, setRelatorioUrl] = useState<string | null>(null);
  const [relatorioId, setRelatorioId] = useState<number | null>(null);

  const navigate = useNavigate();
  usePageTitle("Salas");

  useEffect(() => {
    carregarSalas();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [pesquisa]);

  async function carregarSalas() {
    try {
      setLoading(true);
      setErro("");

      const dados = await listarSalas();
      setSalas(dados);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as salas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGerarRelatorio(id: number) {
    try {
      const blob = await gerarRelatorioSala(id);
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
      a.download = `relatorio-sala-${relatorioId}.pdf`;
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

  async function confirmarExclusao() {
    if (!salaExcluir) return;

    try {
      setExcluindo(true);

      await excluirSala(salaExcluir.id);

      setSalas((atuais) => atuais.filter((sala) => sala.id !== salaExcluir.id));

      notify.deleted(salaExcluir.name);
      setSalaExcluir(null);
    } catch (error) {
      console.error(error);
      notify.error("Não foi possível excluir a sala.");
    } finally {
      setExcluindo(false);
    }
  }

  const salasFiltradas = useMemo(() => {
    const termo = pesquisa.toLowerCase().trim();

    if (!termo) return salas;

    return salas.filter((sala) =>
      [sala.name, sala.building, sala.floor, sala.campus]
        .filter(Boolean)
        .some((valor) => valor.toString().toLowerCase().includes(termo)),
    );
  }, [salas, pesquisa]);

  const totalPaginas = Math.ceil(salasFiltradas.length / ITENS_POR_PAGINA);
  const inicio = (pagina - 1) * ITENS_POR_PAGINA;
  const salasPagina = salasFiltradas.slice(inicio, inicio + ITENS_POR_PAGINA);

  return (
    <AppTemplate
      hideDefaultContent={true}
      theme={equipamentosTheme}
      appSubtitle="Gerenciamento de Salas"
      appDescription="Consulte, cadastre e acompanhe as salas disponíveis."
      primaryAction={{
        label: "Nova Sala",
        href: "/reserva-equipamentos/salas/criar",
      }}
      secondaryAction={null}
    >
      <SalasPageHeader />

      <SalasSearchBar pesquisa={pesquisa} onPesquisaChange={setPesquisa} />

      {loading && <p>Carregando salas...</p>}

      {erro && <p style={{ color: "#991b1b", fontWeight: 600 }}>{erro}</p>}

      {!loading && !erro && salasFiltradas.length === 0 && (
        <p style={{ color: "#6b7280" }}>Nenhuma sala encontrada.</p>
      )}

      {!loading && !erro && salasFiltradas.length > 0 && (
        <>
          <SalasTable
            salas={salasPagina}
            onEditarSala={(id) =>
              navigate(`/reserva-equipamentos/salas/editar/${id}`)
            }
            onExcluirSala={setSalaExcluir}
            onRelatorio={handleGerarRelatorio}
          />

          <SalasPagination
            pagina={pagina}
            totalPaginas={totalPaginas}
            totalItens={salasFiltradas.length}
            inicio={inicio}
            itensPorPagina={ITENS_POR_PAGINA}
            onPaginaChange={setPagina}
          />
        </>
      )}

      <RelatorioModal
        relatorioUrl={relatorioUrl}
        onDownload={handleDownloadRelatorio}
        onClose={handleFecharRelatorio}
      />

      {salaExcluir && (
        <ConfirmDeleteRoomModal
          sala={salaExcluir}
          excluindo={excluindo}
          onCancel={() => setSalaExcluir(null)}
          onConfirm={confirmarExclusao}
        />
      )}
    </AppTemplate>
  );
}
