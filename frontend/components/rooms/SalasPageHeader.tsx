export default function SalasPageHeader() {
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
          Salas
        </span>

        <h2
          style={{
            margin: "6px 0 0",
            fontSize: "24px",
            color: "#111827",
          }}
        >
          Lista de Salas
        </h2>
      </div>
    </header>
  );
}
