/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";

import type Reservation from "../../interfaces/reserva";

import {
  devolverReserva,
  excluirReserva,
  listarReservas,
} from "../../services/reservaService";

import { usePageTitle } from "../../hooks/usePageTitle";
import { notify } from "../../utils/notifications";

import ConfirmarExclusaoReservaModal from "../../../components/reservations/ConfirmarExclusaoReservaModal";
import ReservaInfoModal from "../../../components/reservations/ReservaInfoModal";
import ReservaSearch from "../../../components/reservations/ReservaSearch";
import ReservasHeader from "../../../components/reservations/ReservasHeader";
import ReservasPagination from "../../../components/reservations/ReservasPagination";
import ReservasTable from "../../../components/reservations/ReservasTable";
import {
  filtrarReservas,
  ITENS_POR_PAGINA,
  paginarReservas,
  type FiltroStatus,
} from "../../utils/reservaUtils";

export default function Reservas() {
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  const [reservaInfo, setReservaInfo] = useState<Reservation | null>(null);
  const [reservaExcluir, setReservaExcluir] = useState<Reservation | null>(
    null,
  );

  const [excluindo, setExcluindo] = useState(false);
  const [devolvendoId, setDevolvendoId] = useState<number | null>(null);

  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("TODAS");
  const [pagina, setPagina] = useState(1);

  usePageTitle("Reservas");

  useEffect(() => {
    carregarReservas();
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [filtroStatus, pesquisa]);

  async function carregarReservas() {
    try {
      setLoading(true);
      setErro("");

      const dados = await listarReservas();
      setReservas(dados);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as reservas.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmarExclusao() {
    if (!reservaExcluir) return;

    try {
      setExcluindo(true);

      await excluirReserva(reservaExcluir.id);

      setReservas((atuais) =>
        atuais.filter((reserva) => reserva.id !== reservaExcluir.id),
      );

      notify.deleted(`Reserva #${reservaExcluir.id}`);
      setReservaExcluir(null);
    } catch (error) {
      console.error(error);
      notify.error("Não foi possível excluir a reserva.");
    } finally {
      setExcluindo(false);
    }
  }

  async function devolver(id: number) {
    try {
      setDevolvendoId(id);

      await devolverReserva(id);

      notify.returned(id);
      await carregarReservas();
    } catch (error) {
      console.error(error);
      notify.error("Não foi possível registrar a devolução.");
    } finally {
      setDevolvendoId(null);
    }
  }

  const reservasFiltradas = useMemo(
    () => filtrarReservas(reservas, filtroStatus, pesquisa),
    [reservas, filtroStatus, pesquisa],
  );

  const { inicio, totalPaginas, reservasPagina } = useMemo(
    () => paginarReservas(reservasFiltradas, pagina),
    [reservasFiltradas, pagina],
  );

  return (
    <AppTemplate
      hideDefaultContent={true}
      theme={equipamentosTheme}
      appSubtitle="Gerenciamento de Reservas"
      appDescription="Consulte, cadastre e acompanhe as suas reservas."
      primaryAction={{
        label: "Nova Reserva",
        href: "/reserva-equipamentos/reservas/criar",
      }}
      secondaryAction={null}
    >
      <ReservasHeader
        filtroStatus={filtroStatus}
        onChangeFiltroStatus={setFiltroStatus}
      />

      <ReservaSearch pesquisa={pesquisa} onChangePesquisa={setPesquisa} />

      {loading && <p>Carregando reservas...</p>}

      {erro && (
        <p
          style={{
            color: "#991b1b",
            fontWeight: 600,
          }}
        >
          {erro}
        </p>
      )}

      {!loading && !erro && reservasFiltradas.length === 0 && (
        <p style={{ color: "#6b7280" }}>Nenhuma reserva encontrada.</p>
      )}

      {!loading && !erro && reservasFiltradas.length > 0 && (
        <>
          <ReservasTable
            reservas={reservasPagina}
            devolvendoId={devolvendoId}
            onInfo={setReservaInfo}
            onDevolver={devolver}
            onExcluir={setReservaExcluir}
          />

          <ReservasPagination
            pagina={pagina}
            totalPaginas={totalPaginas}
            inicio={inicio}
            totalItens={reservasFiltradas.length}
            itensPorPagina={ITENS_POR_PAGINA}
            onChangePagina={setPagina}
          />
        </>
      )}

      {reservaInfo && (
        <ReservaInfoModal
          reserva={reservaInfo}
          onClose={() => setReservaInfo(null)}
        />
      )}

      {reservaExcluir && (
        <ConfirmarExclusaoReservaModal
          reserva={reservaExcluir}
          excluindo={excluindo}
          onCancel={() => setReservaExcluir(null)}
          onConfirm={confirmarExclusao}
        />
      )}
    </AppTemplate>
  );
}
