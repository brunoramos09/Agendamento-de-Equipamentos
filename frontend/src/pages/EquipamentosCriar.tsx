/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppTemplate from "./AppTemplate";
import equipamentosTheme from "../styles/theme/equipamentosTheme";
import { criarEquipamento } from "../services/equipamentoService";
import { listarSalas } from "../services/salasService";
import type Room from "../interfaces/sala";

import { notify } from "../utils/notifications";

export default function CriarEquipamento() {
  const navigate = useNavigate();

  const [salvando, setSalvando] = useState(false);
  const [salas, setSalas] = useState<Room[]>([]);
  const [carregandoSalas, setCarregandoSalas] = useState(true);

  const [equipamento, setEquipamento] = useState({
    name: "",
    serialNumber: "",
    responsibleEmployee: "",
    observations: "",
    instructions: "",
    roomId: 0,
    status: "DISPONIVEL",
    photo: null as File | null,
  });

  useEffect(() => {
    carregarSalas();
  }, []);

  async function carregarSalas() {
    try {
      const dados = await listarSalas();

      setSalas(dados);

      if (dados.length > 0) {
        setEquipamento((prev) => ({
          ...prev,
          roomId: dados[0].id,
        }));
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar salas.");
    } finally {
      setCarregandoSalas(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSalvando(true);

      const formData = new FormData();

      formData.append("name", equipamento.name);
      formData.append("roomId", String(equipamento.roomId));
      formData.append("status", equipamento.status);

      if (equipamento.serialNumber) {
        formData.append("serialNumber", equipamento.serialNumber);
      }

      if (equipamento.responsibleEmployee) {
        formData.append("responsibleEmployee", equipamento.responsibleEmployee);
      }

      if (equipamento.observations) {
        formData.append("observations", equipamento.observations);
      }

      if (equipamento.instructions) {
        formData.append("instructions", equipamento.instructions);
      }

      if (equipamento.photo) {
        formData.append("photo", equipamento.photo);
      }

      await criarEquipamento(formData);

      notify.created("Equipamento: " + equipamento.name + " | ");
      navigate("/reserva-equipamentos/equipamentos");
    } catch (error) {
      console.error(error);
      notify.error("Erro ao criar equipamento.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AppTemplate hideDefaultContent theme={equipamentosTheme}>
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
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
            margin: "8px 0 32px",
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          Novo Equipamento
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>Nome</label>

              <input
                required
                value={equipamento.name}
                onChange={(e) =>
                  setEquipamento({
                    ...equipamento,
                    name: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Patrimônio</label>

              <input
                value={equipamento.serialNumber}
                onChange={(e) =>
                  setEquipamento({
                    ...equipamento,
                    serialNumber: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Responsável</label>

              <input
                value={equipamento.responsibleEmployee}
                onChange={(e) =>
                  setEquipamento({
                    ...equipamento,
                    responsibleEmployee: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Sala</label>

              <select
                required
                disabled={carregandoSalas}
                value={equipamento.roomId}
                onChange={(e) =>
                  setEquipamento({
                    ...equipamento,
                    roomId: Number(e.target.value),
                  })
                }
                style={inputStyle}
              >
                {salas.map((sala) => (
                  <option key={sala.id} value={sala.id}>
                    {sala.name} - {sala.building}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Status</label>

              <select
                value={equipamento.status}
                onChange={(e) =>
                  setEquipamento({
                    ...equipamento,
                    status: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="DISPONIVEL">Disponível</option>
                <option value="MANUTENCAO">Manutenção</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>

            <div />

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label style={labelStyle}>Imagem do Equipamento</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEquipamento({
                    ...equipamento,
                    photo: e.target.files?.[0] ?? null,
                  })
                }
              />

              {equipamento.photo && (
                <div
                  style={{
                    marginTop: "16px",
                  }}
                >
                  <img
                    src={URL.createObjectURL(equipamento.photo)}
                    alt="Preview"
                    style={{
                      width: "240px",
                      maxHeight: "240px",
                      objectFit: "cover",
                      borderRadius: "16px",
                      border: "1px solid #ddd",
                      display: "block",
                    }}
                  />

                  <p
                    style={{
                      marginTop: "10px",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    {equipamento.photo.name}
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label style={labelStyle}>Observações</label>

              <textarea
                rows={4}
                value={equipamento.observations}
                onChange={(e) =>
                  setEquipamento({
                    ...equipamento,
                    observations: e.target.value,
                  })
                }
                style={textAreaStyle}
              />
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label style={labelStyle}>Instruções</label>

              <textarea
                rows={4}
                value={equipamento.instructions}
                onChange={(e) =>
                  setEquipamento({
                    ...equipamento,
                    instructions: e.target.value,
                  })
                }
                style={textAreaStyle}
              />
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/reserva-equipamentos/equipamentos")}
                style={cancelButton}
              >
                Cancelar
              </button>

              <button type="submit" disabled={salvando} style={saveButton}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppTemplate>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 600,
  fontSize: "14px",
  color: "#171717",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #cfcfcf",
  background: "#fff",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
};

const textAreaStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #cfcfcf",
  background: "#fff",
  fontSize: "15px",
  resize: "vertical",
  boxSizing: "border-box",
  outline: "none",
};

const saveButton: React.CSSProperties = {
  padding: "12px 20px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "110px",
};

const cancelButton: React.CSSProperties = {
  padding: "12px 20px",
  background: "#fff",
  color: "#111",
  border: "1px solid #cfcfcf",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "110px",
};
