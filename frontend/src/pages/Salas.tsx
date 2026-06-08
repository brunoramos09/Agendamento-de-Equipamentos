/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import AppTemplate from "./AppTemplate";
import equipamentosTheme from "../styles/theme/equipamentosTheme";
import { listarSalas, excluirSala } from "../services/salasService";
import type Room from "../interfaces/sala";

export default function Salas() {
  const [salas, setSalas] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [salaExcluir, setSalaExcluir] = useState<Room | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarSalas();
  }, []);

  async function carregarSalas() {
    setLoading(true);
    setErro("");

    try {
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

      setSalaExcluir(null);
    } catch (error) {
      console.error(error);
      alert("Não foi possível excluir a sala.");
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

  return (
    <AppTemplate
      hideDefaultContent={true}
      theme={equipamentosTheme}
      appName="Sistema de Agendamento de Equipamentos"
      appSubtitle="Gerenciamento de Salas"
      appDescription="Consulte, cadastre e acompanhe as salas disponíveis."
      primaryAction={{
        label: "Nova Sala",
        href: "/reserva-equipamentos/salas/criar",
      }}
      secondaryAction={{
        label: "Atualizar",
        href: "/reserva-equipamentos/salas",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
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
              fontSize: "22px",
              letterSpacing: "-0.03em",
            }}
          >
            Lista de Salas
          </h2>
        </div>
      </header>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Pesquisar por nome, prédio, andar ou campus..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "450px",
            padding: "10px 14px",
            border: "1px solid #d4d4d4",
            borderRadius: "10px",
            fontSize: "14px",
            background: "#ffffff",
            outline: "none",
          }}
        />
      </div>

      {loading && <p>Carregando...</p>}

      {erro && <p>{erro}</p>}

      {!loading && !erro && salas.length === 0 && (
        <p>Nenhuma sala cadastrada.</p>
      )}

      {!loading && !erro && salas.length > 0 && salasFiltradas.length === 0 && (
        <p>Nenhuma sala encontrada.</p>
      )}

      {!loading && !erro && salasFiltradas.length > 0 && (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px" }}>ID</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Nome</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Prédio</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Andar</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Campus</th>
                <th style={{ textAlign: "center", padding: "12px" }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {salasFiltradas.map((sala) => (
                <tr key={sala.id}>
                  <td style={{ padding: "12px" }}>{sala.id}</td>
                  <td style={{ padding: "12px" }}>{sala.name}</td>
                  <td style={{ padding: "12px" }}>{sala.building}</td>
                  <td style={{ padding: "12px" }}>{sala.floor}</td>
                  <td style={{ padding: "12px" }}>{sala.campus}</td>

                  <td style={{ padding: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <button
                        style={{
                          padding: "6px 10px",
                          background: "#171717",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        Editar
                      </button>

                      <button
                        style={{
                          padding: "6px 10px",
                          background: "#ffffff",
                          color: "#171717",
                          border: "1px solid #d4d4d4",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        Relatório
                      </button>

                      <button
                        onClick={() => setSalaExcluir(sala)}
                        style={{
                          padding: "6px 10px",
                          background: "#ffffff",
                          color: "#171717",
                          border: "1px solid #d4d4d4",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
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
      )}

      {salaExcluir && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
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
              padding: "24px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 20px 40px rgba(0,0,0,.2)",
            }}
          >
            <h3 style={{ margin: "0 0 12px" }}>Confirmar exclusão</h3>

            <p
              style={{
                marginBottom: "20px",
                color: "#525252",
              }}
            >
              Deseja realmente excluir a sala?
            </p>

            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                background: "#f5f5f5",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              {salaExcluir.name}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setSalaExcluir(null)}
                disabled={excluindo}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #d4d4d4",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>

              <button
                onClick={confirmarExclusao}
                disabled={excluindo}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
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
