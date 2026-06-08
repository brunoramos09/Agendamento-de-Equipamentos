/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import AppTemplate from "./AppTemplate";
import equipamentosTheme from "../styles/theme/equipamentosTheme";
import {
  listarEquipamentos,
  excluirEquipamento,
} from "../services/equipamentoService";
import type Equipment from "../interfaces/equipamento";

const statusLabels: Record<string, string> = {
  DISPONIVEL: "Disponível",
  MANUTENCAO: "Manutenção",
  INATIVO: "Inativo",
};

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [equipamentoExcluir, setEquipamentoExcluir] =
    useState<Equipment | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  async function carregarEquipamentos() {
    setLoading(true);
    setErro("");

    try {
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
    if (!equipamentoExcluir) {
      return;
    }

    try {
      setExcluindo(true);

      await excluirEquipamento(equipamentoExcluir.id);

      setEquipamentos((atuais) =>
        atuais.filter((e) => e.id !== equipamentoExcluir.id),
      );

      setEquipamentoExcluir(null);
    } catch (error) {
      console.error(error);
      alert("Não foi possível excluir o equipamento.");
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
      appName="Sistema de Agendamento de Equipamentos"
      appSubtitle="Gerenciamento de Equipamentos"
      appDescription="Consulte, cadastre e acompanhe os equipamentos disponíveis para reserva."
      primaryAction={{
        label: "Novo Equipamento",
        href: "/reserva-equipamentos/equipamentos/novo",
      }}
      secondaryAction={{
        label: "Atualizar",
        href: "/reserva-equipamentos/equipamentos",
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
            Equipamentos
          </span>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: "22px",
              letterSpacing: "-0.03em",
            }}
          >
            Lista de Equipamentos
          </h2>
        </div>
      </header>

      <div
        style={{
          marginBottom: "16px",
        }}
      >
        <input
          type="text"
          placeholder="Pesquisar por nome, patrimônio, sala ou status..."
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

      {!loading && !erro && equipamentos.length === 0 && (
        <p>Nenhum equipamento cadastrado.</p>
      )}

      {!loading &&
        !erro &&
        equipamentos.length > 0 &&
        equipamentosFiltrados.length === 0 && (
          <p>Nenhum equipamento encontrado.</p>
        )}

      {!loading && !erro && equipamentosFiltrados.length > 0 && (
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

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    minWidth: "160px",
                  }}
                >
                  Patrimônio
                </th>

                <th style={{ textAlign: "left", padding: "12px" }}>Sala</th>

                <th style={{ textAlign: "left", padding: "12px" }}>Status</th>

                <th style={{ textAlign: "center", padding: "12px" }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {equipamentosFiltrados.map((equipamento) => (
                <tr key={equipamento.id}>
                  <td style={{ padding: "12px" }}>{equipamento.id}</td>

                  <td style={{ padding: "12px" }}>{equipamento.name}</td>

                  <td style={{ padding: "12px" }}>
                    {equipamento.serialNumber ?? "-"}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {equipamento.room?.name ?? "-"}
                  </td>

                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background:
                          equipamento.status === "DISPONIVEL"
                            ? "#dcfce7"
                            : equipamento.status === "MANUTENCAO"
                              ? "#fef3c7"
                              : "#fee2e2",
                        color:
                          equipamento.status === "DISPONIVEL"
                            ? "#166534"
                            : equipamento.status === "MANUTENCAO"
                              ? "#92400e"
                              : "#991b1b",
                      }}
                    >
                      {statusLabels[equipamento.status] ?? equipamento.status}
                    </span>
                  </td>

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
                        onClick={() => setEquipamentoExcluir(equipamento)}
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
      {equipamentoExcluir && (
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
            <h3
              style={{
                margin: "0 0 12px",
              }}
            >
              Confirmar exclusão
            </h3>

            <p
              style={{
                marginBottom: "20px",
                color: "#525252",
              }}
            >
              Deseja realmente excluir o equipamento?
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
              {equipamentoExcluir.name}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setEquipamentoExcluir(null)}
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
