import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppTemplate from "./AppTemplate";
import equipamentosTheme from "../styles/theme/equipamentosTheme";
import { criarSala } from "../services/salasService";

import { notify } from "../utils/notifications";

export default function CriarSala() {
  const navigate = useNavigate();

  const [salvando, setSalvando] = useState(false);

  const [sala, setSala] = useState({
    name: "",
    building: "",
    floor: 0,
    campus: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    
    try {
      setSalvando(true);

      await criarSala(sala);

      notify.created(sala.name);

      navigate("/reserva-equipamentos/salas");
    } catch (error) {
      console.error(error);

      notify.error("Erro ao criar sala.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AppTemplate hideDefaultContent theme={equipamentosTheme}>
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
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
          Salas
        </span>

        <h2
          style={{
            margin: "8px 0 32px",
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          Nova Sala
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>Nome</label>

              <input
                required
                value={sala.name}
                onChange={(e) =>
                  setSala({
                    ...sala,
                    name: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Prédio</label>

              <input
                required
                value={sala.building}
                onChange={(e) =>
                  setSala({
                    ...sala,
                    building: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Andar</label>

              <input
                required
                type="number"
                min={0}
                value={sala.floor}
                onChange={(e) =>
                  setSala({
                    ...sala,
                    floor: Number(e.target.value),
                  })
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Campus</label>

              <input
                required
                value={sala.campus}
                onChange={(e) =>
                  setSala({
                    ...sala,
                    campus: e.target.value,
                  })
                }
                style={inputStyle}
              />
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
                type="button"
                onClick={() => navigate("/reserva-equipamentos/salas")}
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

const saveButton: React.CSSProperties = {
  padding: "10px 18px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "100px",
};

const cancelButton: React.CSSProperties = {
  padding: "10px 18px",
  background: "#fff",
  color: "#111",
  border: "1px solid #cfcfcf",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "100px",
};
