import type { CSSProperties } from "react";

type Sala = {
  name: string;
  building: string;
  floor: number;
  campus: string;
};

interface SalaFormProps {
  sala: Sala;
  setSala: React.Dispatch<React.SetStateAction<Sala>>;
  salvando: boolean;
  titulo: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function SalaForm({
  sala,
  setSala,
  salvando,
  titulo,
  onSubmit,
  onCancel,
}: SalaFormProps) {
  return (
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
        {titulo}
      </h2>

      <form onSubmit={onSubmit}>
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
            <button type="button" onClick={onCancel} style={cancelButton}>
              Cancelar
            </button>

            <button type="submit" disabled={salvando} style={saveButton}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 600,
  fontSize: "14px",
  color: "#171717",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #cfcfcf",
  background: "#fff",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
};

const saveButton: CSSProperties = {
  padding: "10px 18px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "100px",
};

const cancelButton: CSSProperties = {
  padding: "10px 18px",
  background: "#fff",
  color: "#111",
  border: "1px solid #cfcfcf",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "100px",
};
