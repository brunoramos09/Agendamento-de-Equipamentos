/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";

import type Equipment from "../../interfaces/equipamento";

import { listarEquipamentos } from "../../services/equipamentoService";
import { criarReserva } from "../../services/reservaService";

import { notify } from "../../utils/notifications";

export default function CriarReserva() {
  const [salvando, setSalvando] = useState(false);

  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);

  const [reserva, setReserva] = useState({
    user: "",
    startDate: "",
    endDate: "",
    observations: "",
    equipments: [] as { equipmentId: number }[],
  });

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  async function carregarEquipamentos() {
    try {
      const dados = await listarEquipamentos();

      setEquipamentos(
        dados.filter(
          (equipamento: { status: string }) =>
            equipamento.status === "DISPONIVEL",
        ),
      );
    } catch (error) {
      console.error(error);

      notify.error("Não foi possível carregar os equipamentos.");
    }
  }

  function toggleEquipamento(id: number) {
    const existe = reserva.equipments.some((item) => item.equipmentId === id);

    if (existe) {
      setReserva({
        ...reserva,
        equipments: reserva.equipments.filter(
          (item) => item.equipmentId !== id,
        ),
      });

      return;
    }

    setReserva({
      ...reserva,
      equipments: [
        ...reserva.equipments,
        {
          equipmentId: id,
        },
      ],
    });
  }

  async function salvarReserva() {
    try {
      if (!reserva.user.trim()) {
        notify.error("Informe o nome do usuário.");

        return;
      }

      if (!reserva.startDate) {
        notify.error("Informe a data inicial.");

        return;
      }

      if (!reserva.endDate) {
        notify.error("Informe a data final.");

        return;
      }

      if (reserva.equipments.length === 0) {
        notify.error("Selecione ao menos um equipamento.");

        return;
      }

      setSalvando(true);

      await criarReserva({
        user: reserva.user,
        startDate: reserva.startDate,
        endDate: reserva.endDate,
        observations: reserva.observations || undefined,
        equipments: reserva.equipments,
      });

      notify.created("Reserva criada com sucesso.");

      window.location.href = "/reserva-equipamentos/reservas";
    } catch (error: any) {
      console.error(error);

      notify.error(error?.message ?? "Não foi possível criar a reserva.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AppTemplate
      hideDefaultContent={true}
      theme={equipamentosTheme}
      appName="Sistema de Agendamento de Equipamentos"
      appSubtitle="Nova Reserva"
      appDescription="Cadastre uma nova reserva de equipamentos."
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "24px",
          }}
        >
          Nova Reserva
        </h2>

        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 600,
              }}
            >
              Usuário
            </label>

            <input
              type="text"
              value={reserva.user}
              onChange={(e) =>
                setReserva({
                  ...reserva,
                  user: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d4d4d4",
                borderRadius: "8px",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 600,
                }}
              >
                Data/Hora Inicial
              </label>

              <input
                type="datetime-local"
                value={reserva.startDate}
                onChange={(e) =>
                  setReserva({
                    ...reserva,
                    startDate: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d4d4d4",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 600,
                }}
              >
                Data/Hora Final
              </label>

              <input
                type="datetime-local"
                value={reserva.endDate}
                onChange={(e) =>
                  setReserva({
                    ...reserva,
                    endDate: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d4d4d4",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 600,
              }}
            >
              Observações
            </label>

            <textarea
              rows={4}
              value={reserva.observations}
              onChange={(e) =>
                setReserva({
                  ...reserva,
                  observations: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d4d4d4",
                borderRadius: "8px",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <h3
              style={{
                marginBottom: "12px",
              }}
            >
              Equipamentos
            </h3>

            <div
              style={{
                display: "grid",
                gap: "8px",
                maxHeight: "350px",
                overflowY: "auto",
                border: "1px solid #e5e5e5",
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              {equipamentos.map((equipamento) => (
                <label
                  key={equipamento.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={reserva.equipments.some(
                      (item) => item.equipmentId === equipamento.id,
                    )}
                    onChange={() => toggleEquipamento(equipamento.id)}
                  />

                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {equipamento.name}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#737373",
                      }}
                    >
                      Patrimônio: {equipamento.serialNumber || "-"}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            <button
              onClick={() =>
                (window.location.href = "/reserva-equipamentos/reservas")
              }
              style={{
                padding: "10px 16px",
                border: "1px solid #d4d4d4",
                borderRadius: "8px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={salvarReserva}
              disabled={salvando}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                background: "#171717",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {salvando ? "Salvando..." : "Criar Reserva"}
            </button>
          </div>
        </div>
      </div>
    </AppTemplate>
  );
}
