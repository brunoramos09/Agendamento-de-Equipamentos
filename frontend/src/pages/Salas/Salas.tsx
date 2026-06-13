/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";
import { listarSalas, excluirSala } from "../../services/salasService";
import type Room from "../../interfaces/sala";
import { notify } from "../../utils/notifications";

const ITENS_POR_PAGINA = 8;

export default function Salas() {
  const [salas, setSalas] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [salaExcluir, setSalaExcluir] = useState<Room | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [pagina, setPagina] = useState(1);

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

  const salasFiltradas = salas.filter((sala) =>
    [sala.name, sala.building, sala.floor, sala.campus]
      .filter(Boolean)
      .some((valor) =>
        valor.toString().toLowerCase().includes(pesquisa.toLowerCase()),
      ),
  );

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
            Salas
          </span>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "24px",
              color: "#111827",
            }}
          >
            Lista de Salas
          </h2>
        </div>
      </header>

      <div style={{ marginBottom: "18px" }}>
        <input
          type="text"
          placeholder="Pesquisar por nome, prédio, andar ou campus..."
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

      {loading && <p>Carregando salas...</p>}

      {erro && <p style={{ color: "#991b1b", fontWeight: 600 }}>{erro}</p>}

      {!loading && !erro && salasFiltradas.length === 0 && (
        <p style={{ color: "#6b7280" }}>Nenhuma sala encontrada.</p>
      )}

      {!loading && !erro && salasFiltradas.length > 0 && (
        <>
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
                minWidth: "650px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {["ID", "Nome", "Prédio", "Andar", "Campus", "Ações"].map(
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
                {salasPagina.map((sala) => (
                  <tr
                    key={sala.id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td style={{ padding: "14px 12px", fontWeight: 700 }}>
                      {sala.id}
                    </td>

                    <td style={{ padding: "14px 12px" }}>{sala.name}</td>

                    <td style={{ padding: "14px 12px" }}>
                      {sala.building ?? "-"}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {sala.floor ?? "-"}
                    </td>

                    <td style={{ padding: "14px 12px" }}>
                      {sala.campus ?? "-"}
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
                            (window.location.href = `/reserva-equipamentos/salas/editar/${sala.id}`)
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
                          onClick={() => setSalaExcluir(sala)}
                          style={{ ...buttonStyle, background: "#7f1d1d" }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                Exibindo {inicio + 1}–
                {Math.min(inicio + ITENS_POR_PAGINA, salasFiltradas.length)} de{" "}
                {salasFiltradas.length} sala
                {salasFiltradas.length !== 1 ? "s" : ""}
              </span>

              <div
                style={{ display: "flex", gap: "6px", alignItems: "center" }}
              >
                <button
                  type="button"
                  onClick={() => setPagina((p) => p - 1)}
                  disabled={pagina === 1}
                  style={{
                    ...paginaBtnStyle,
                    opacity: pagina === 1 ? 0.4 : 1,
                    cursor: pagina === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  ← Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPagina(num)}
                      style={{
                        ...paginaBtnStyle,
                        background: num === pagina ? "#111827" : "#fff",
                        color: num === pagina ? "#fff" : "#374151",
                        border: num === pagina ? "none" : "1px solid #d1d5db",
                        fontWeight: num === pagina ? 700 : 500,
                        minWidth: "36px",
                      }}
                    >
                      {num}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={pagina === totalPaginas}
                  style={{
                    ...paginaBtnStyle,
                    opacity: pagina === totalPaginas ? 0.4 : 1,
                    cursor: pagina === totalPaginas ? "not-allowed" : "pointer",
                  }}
                >
                  Próxima →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {salaExcluir && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalStyle, maxWidth: "460px" }}>
            <h2 style={{ margin: "0 0 10px" }}>Excluir sala</h2>

            <p style={{ color: "#4b5563", lineHeight: 1.5 }}>
              Tem certeza que deseja excluir a sala{" "}
              <strong>{salaExcluir.name}</strong>? Essa ação não poderá ser
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
                onClick={() => setSalaExcluir(null)}
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

const paginaBtnStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#374151",
  padding: "7px 12px",
  borderRadius: "9px",
  fontSize: "13px",
  cursor: "pointer",
};
