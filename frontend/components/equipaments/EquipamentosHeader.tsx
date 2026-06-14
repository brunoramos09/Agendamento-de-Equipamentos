import {
  type FiltroStatus,
  filtroOptions,
  getStatusStyle,
} from "../../src/utils/equipamentosUtils";

type Props = {
  filtroStatus: FiltroStatus;
  onChangeFiltro: (status: FiltroStatus) => void;
};

export default function EquipamentosHeader({
  filtroStatus,
  onChangeFiltro,
}: Props) {
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
          Equipamentos
        </span>

        <h2 style={{ margin: "6px 0 0", fontSize: "24px", color: "#111827" }}>
          Lista de Equipamentos
        </h2>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {filtroOptions.map((opcao) => {
          const ativo = filtroStatus === opcao.value;
          const { bg, color } =
            opcao.value === "TODOS"
              ? { bg: "#111827", color: "#fff" }
              : getStatusStyle(opcao.value);

          return (
            <button
              key={opcao.value}
              type="button"
              onClick={() => onChangeFiltro(opcao.value)}
              style={{
                padding: "7px 14px",
                borderRadius: "999px",
                border: ativo ? "none" : "1px solid #d1d5db",
                background: ativo ? bg : "#fff",
                color: ativo ? color : "#374151",
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
