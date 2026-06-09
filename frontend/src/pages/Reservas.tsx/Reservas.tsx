import { useEffect, useState } from "react";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";

import type Reservation from "../../interfaces/reserva";

import {
  listarReservas,
  excluirReserva,
  devolverReserva,
} from "../../services/reservaService";

import { notify } from "../../utils/notifications";

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

  useEffect(() => {
    carregarReservas();
  }, []);

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

  function formatarData(data?: string | null) {
    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-BR");
  }

  function getStatus(reserva: Reservation) {
    if (reserva.returnedAt) {
      return {
        label: "DEVOLVIDA",
        bg: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (new Date(reserva.endDate) < new Date()) {
      return {
        label: "ATRASADA",
        bg: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      label: "ATIVA",
      bg: "#dcfce7",
      color: "#166534",
    };
  }

  const reservasFiltradas = reservas.filter((reserva) =>
    [
      reserva.user,
      reserva.observations,
      reserva.id?.toString(),
      reserva.equipments
        ?.map((item) => item.equipment?.name)
        .filter(Boolean)
        .join(" "),
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
      appSubtitle="Gerenciamento de Reservas"
      appDescription="Consulte, cadastre e acompanhe as suas reservas."
      primaryAction={{
        label: "Nova Reserva",
        href: "/reserva-equipamentos/reservas/criar",
      }}
      secondaryAction={{
        label: "Atualizar",
        href: "/reserva-equipamentos/reservas",
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
            Reservas
          </span>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "24px",
              color: "#111827",
            }}
          >
            Lista de Reservas
          </h2>
        </div>
      </header>

      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <input
          type="text"
          placeholder="Pesquisar por usuário, observação, ID ou equipamento..."
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
        <p
          style={{
            color: "#6b7280",
          }}
        >
          Nenhuma reserva encontrada.
        </p>
      )}

      {!loading && !erro && reservasFiltradas.length > 0 && (
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
              minWidth: "850px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {[
                  "ID",
                  "Usuário",
                  "Início",
                  "Fim",
                  "Equipamentos",
                  "Status",
                  "Ações",
                ].map((titulo) => (
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
                ))}
              </tr>
            </thead>

            <tbody>
              {reservasFiltradas.map((reserva) => {
                const status = getStatus(reserva);

                return (
                  <tr
                    key={reserva.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <td style={{ padding: "14px 12px", fontWeight: 700 }}>
                      {reserva.id}
                    </td>

                    <td style={{ padding: "14px 12px" }}>{reserva.user}</td>

                    <td style={{ padding: "14px 12px" }}>
                      {formatarData(reserva.startDate)}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {formatarData(reserva.endDate)}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {reserva.equipments?.length ?? 0}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "5px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 800,
                          background: status.bg,
                          color: status.color,
                        }}
                      >
                        {status.label}
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
                          onClick={() => setReservaInfo(reserva)}
                          style={buttonStyle}
                        >
                          Info
                        </button>

                        {!reserva.returnedAt && (
                          <button
                            type="button"
                            onClick={() => devolver(reserva.id)}
                            disabled={devolvendoId === reserva.id}
                            style={{
                              ...buttonStyle,
                              opacity: devolvendoId === reserva.id ? 0.7 : 1,
                              cursor:
                                devolvendoId === reserva.id
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            {devolvendoId === reserva.id
                              ? "Devolvendo..."
                              : "Devolver"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setReservaExcluir(reserva)}
                          style={{
                            ...buttonStyle,
                            background: "#7f1d1d",
                          }}
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

      {reservaInfo && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: "0 0 16px" }}>Reserva #{reservaInfo.id}</h2>

            <div style={infoGridStyle}>
              <strong>Usuário</strong>
              <span>{reservaInfo.user}</span>

              <strong>Início</strong>
              <span>{formatarData(reservaInfo.startDate)}</span>

              <strong>Fim</strong>
              <span>{formatarData(reservaInfo.endDate)}</span>

              <strong>Devolução</strong>
              <span>{formatarData(reservaInfo.returnedAt)}</span>

              <strong>Observações</strong>
              <span>{reservaInfo.observations || "-"}</span>
            </div>

            <h3 style={{ margin: "20px 0 10px" }}>Equipamentos</h3>

            {reservaInfo.equipments?.length > 0 ? (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                }}
              >
                {reservaInfo.equipments.map((item) => (
                  <li key={item.id}>{item.equipment?.name || "-"}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhum equipamento vinculado.</p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setReservaInfo(null)}
                style={buttonStyle}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {reservaExcluir && (
        <div style={modalOverlayStyle}>
          <div
            style={{
              ...modalStyle,
              maxWidth: "460px",
            }}
          >
            <h2 style={{ margin: "0 0 10px" }}>Excluir reserva</h2>

            <p
              style={{
                color: "#4b5563",
                lineHeight: 1.5,
              }}
            >
              Tem certeza que deseja excluir a reserva{" "}
              <strong>#{reservaExcluir.id}</strong>? Essa ação não poderá ser
              desfeita.
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
                onClick={() => setReservaExcluir(null)}
                disabled={excluindo}
                style={{
                  ...buttonStyle,
                  background: "#6b7280",
                }}
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

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "150px 1fr",
  gap: "10px 14px",
  fontSize: "14px",
};
