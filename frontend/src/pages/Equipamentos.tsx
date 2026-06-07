/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import AppTemplate from "./AppTemplate";
import equipamentosTheme from "../styles/theme/equipamentosTheme";
import { listarEquipamentos } from "../services/equipamentoService";

interface Equipment {
  id: number;
  name: string;
  description: string | null;
  notes: string | null;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

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

      {loading && <p>Carregando...</p>}

      {erro && <p>{erro}</p>}

      {!loading && !erro && equipamentos.length === 0 && (
        <p>Nenhum equipamento cadastrado.</p>
      )}

      {!loading && !erro && equipamentos.length > 0 && (
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
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Descrição
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>Sala</th>
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Observações
                </th>
                <th style={{ textAlign: "center", padding: "12px" }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {equipamentos.map((equipamento) => (
                <tr key={equipamento.id}>
                  <td style={{ padding: "12px" }}>{equipamento.id}</td>
                  <td style={{ padding: "12px" }}>{equipamento.name}</td>
                  <td style={{ padding: "12px" }}>
                    {equipamento.description ?? "-"}
                  </td>
                  <td style={{ padding: "12px" }}>{equipamento.roomId}</td>
                  <td style={{ padding: "12px" }}>
                    {equipamento.notes ?? "-"}
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
    </AppTemplate>
  );
}
