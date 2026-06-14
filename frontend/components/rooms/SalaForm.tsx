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
        maxWidth: "1000px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div
        style={{
          marginBottom: "32px",
          paddingBottom: "20px",
          borderBottom: "1px solid #e5e7eb",
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
            margin: "8px 0 0",
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {titulo}
        </h2>
      </div>

      <form onSubmit={onSubmit}>
        <div
          style={{
            display: "grid",
            gap: "24px",
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

          <div style={actionsStyle}>
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
  color: "#374151",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "#f9fafb",
  fontSize: "14px",
  boxSizing: "border-box",
};

const actionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "12px",
  flexWrap: "wrap",
};

const cancelButton: CSSProperties = {
  padding: "12px 20px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 500,
};

const saveButton: CSSProperties = {
  padding: "12px 24px",
  border: "none",
  borderRadius: "12px",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "160px",
};
