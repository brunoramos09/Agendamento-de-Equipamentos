import { filtroOptions, type FiltroStatus } from "../../src/utils/reservaUtils";

type ReservasHeaderProps = {
  filtroStatus: FiltroStatus;
  onChangeFiltroStatus: (status: FiltroStatus) => void;
};

export default function ReservasHeader({
  filtroStatus,
  onChangeFiltroStatus,
}: ReservasHeaderProps) {
  return (
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

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {filtroOptions.map((opcao) => {
          const ativo = filtroStatus === opcao.value;

          return (
            <button
              key={opcao.value}
              type="button"
              onClick={() => onChangeFiltroStatus(opcao.value)}
              style={{
                padding: "7px 14px",
                borderRadius: "999px",
                border: ativo ? "none" : "1px solid #d1d5db",
                background: ativo ? opcao.bg : "#fff",
                color: ativo ? opcao.color : "#374151",
                fontSize: "13px",
                fontWeight: ativo ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {opcao.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
