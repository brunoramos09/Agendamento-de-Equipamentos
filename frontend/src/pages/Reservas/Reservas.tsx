/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

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

type ModalDevolucao = {
  reserva: Reservation;
  hadIssue: boolean;
  returnObservations: string;
};

export default function Reservas() {
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  const [reservaInfo, setReservaInfo] = useState<Reservation | null>(null);
  const [reservaExcluir, setReservaExcluir] = useState<Reservation | null>(
    null,
  );
  const [mostrarSomenteMinhas, setMostrarSomenteMinhas] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario") ?? "null");

  const [excluindo, setExcluindo] = useState(false);
  const [devolvendo, setDevolvendo] = useState(false);

  const [modalDevolucao, setModalDevolucao] = useState<ModalDevolucao | null>(
    null,
  );

  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("TODAS");
  const [pagina, setPagina] = useState(1);

  usePageTitle("Reservas");

  useEffect(() => {
    carregarReservas();
  }, [mostrarSomenteMinhas]);

  useEffect(() => {
    setPagina(1);
  }, [filtroStatus, pesquisa]);

  async function carregarReservas() {
    try {
      setLoading(true);
      setErro("");

      const dados =
        usuario?.role === "ADMIN"
          ? await listarReservas(mostrarSomenteMinhas ? usuario.id : undefined)
          : await listarReservas(usuario.id);

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

  function abrirModalDevolucao(reserva: Reservation) {
    setModalDevolucao({
      reserva,
      hadIssue: false,
      returnObservations: "",
    });
  }

  async function confirmarDevolucao() {
    if (!modalDevolucao) return;

    if (modalDevolucao.hadIssue && !modalDevolucao.returnObservations.trim()) {
      notify.error("Descreva o problema ocorrido antes de confirmar.");
      return;
    }

    try {
      setDevolvendo(true);

      await devolverReserva(modalDevolucao.reserva.id, {
        hadIssue: modalDevolucao.hadIssue,
        returnObservations: modalDevolucao.hadIssue
          ? modalDevolucao.returnObservations.trim()
          : undefined,
      });

      notify.returned(modalDevolucao.reserva.id);
      setModalDevolucao(null);
      await carregarReservas();
    } catch (error) {
      console.error(error);
      notify.error("Não foi possível registrar a devolução.");
    } finally {
      setDevolvendo(false);
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

      {usuario?.role === "ADMIN" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <button
            onClick={() => setMostrarSomenteMinhas((valor) => !valor)}
            style={{
              padding: "12px 20px",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: mostrarSomenteMinhas ? "#0f172a" : "#ffffff",
              color: mostrarSomenteMinhas ? "#ffffff" : "#334155",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              transition: "all .2s ease",
            }}
          >
            {mostrarSomenteMinhas ? "Minhas Reservas" : "Todas as Reservas"}
          </button>
        </div>
      )}

      {loading && <p>Carregando reservas...</p>}

      {erro && <p style={erroStyle}>{erro}</p>}

      {!loading && !erro && reservasFiltradas.length > 0 && (
        <>
          <ReservasTable
            reservas={reservasPagina}
            onInfo={setReservaInfo}
            devolvendoId={null}
            onDevolver={abrirModalDevolucao}
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

      {modalDevolucao && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: "0 0 6px" }}>Devolver reserva</h2>

            <p style={modalDescriptionStyle}>
              Reserva <strong>#{modalDevolucao.reserva.id}</strong> ·{" "}
              {modalDevolucao.reserva.user.name}
            </p>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={modalDevolucao.hadIssue}
                onChange={(e) =>
                  setModalDevolucao({
                    ...modalDevolucao,
                    hadIssue: e.target.checked,
                    returnObservations: e.target.checked
                      ? modalDevolucao.returnObservations
                      : "",
                  })
                }
                style={checkboxStyle}
              />
              Houve algum problema com o equipamento?
            </label>

            {modalDevolucao.hadIssue && (
              <div style={{ marginBottom: "20px" }}>
                <label style={textareaLabelStyle}>
                  Descreva o problema{" "}
                  <span style={{ color: "#991b1b" }}>*</span>
                </label>

                <textarea
                  rows={4}
                  placeholder="Descreva o defeito ou problema ocorrido durante o uso..."
                  value={modalDevolucao.returnObservations}
                  onChange={(e) =>
                    setModalDevolucao({
                      ...modalDevolucao,
                      returnObservations: e.target.value,
                    })
                  }
                  style={textareaStyle}
                />
              </div>
            )}

            <div style={modalActionsStyle}>
              <button
                type="button"
                onClick={() => setModalDevolucao(null)}
                disabled={devolvendo}
                style={{ ...buttonStyle, background: "#6b7280" }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarDevolucao}
                disabled={devolvendo}
                style={{
                  ...buttonStyle,
                  opacity: devolvendo ? 0.7 : 1,
                  cursor: devolvendo ? "not-allowed" : "pointer",
                }}
              >
                {devolvendo ? "Registrando..." : "Confirmar devolução"}
              </button>
            </div>
          </div>
        </div>
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

const erroStyle: CSSProperties = {
  color: "#991b1b",
  fontWeight: 600,
};

const modalOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "16px",
};

const modalStyle: CSSProperties = {
  width: "100%",
  maxWidth: "500px",
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 20px 40px rgba(0,0,0,.2)",
};

const modalDescriptionStyle: CSSProperties = {
  color: "#4b5563",
  fontSize: "14px",
  marginBottom: "22px",
};

const checkboxLabelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  marginBottom: "18px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#111827",
};

const checkboxStyle: CSSProperties = {
  width: "16px",
  height: "16px",
  cursor: "pointer",
};

const textareaLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  resize: "vertical",
  boxSizing: "border-box",
  outline: "none",
};

const modalActionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "4px",
};

const buttonStyle: CSSProperties = {
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  background: "#111827",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};
