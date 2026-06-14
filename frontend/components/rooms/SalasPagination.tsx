import { paginaBtnStyle } from "../../src/styles/salasStyles";

type SalasPaginationProps = {
  pagina: number;
  totalPaginas: number;
  totalItens: number;
  inicio: number;
  itensPorPagina: number;
  onPaginaChange: (pagina: number) => void;
};

export default function SalasPagination({
  pagina,
  totalPaginas,
  totalItens,
  inicio,
  itensPorPagina,
  onPaginaChange,
}: SalasPaginationProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "16px",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#6b7280" }}>
        Exibindo {inicio + 1}–{Math.min(inicio + itensPorPagina, totalItens)} de{" "}
        {totalItens} sala{totalItens !== 1 ? "s" : ""}
      </span>

      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => onPaginaChange(pagina - 1)}
          disabled={pagina === 1}
          style={{
            ...paginaBtnStyle,
            opacity: pagina === 1 ? 0.4 : 1,
            cursor: pagina === 1 ? "not-allowed" : "pointer",
          }}
        >
          ← Anterior
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onPaginaChange(num)}
            style={{
              ...paginaBtnStyle,
              background: num === pagina ? "#111827" : "#fff",
              color: num === pagina ? "#fff" : "#374151",
              border: num === pagina ? "none" : "1px solid #d1d5db",
              fontWeight: num === pagina ? 700 : 500,
              minWidth: "36px",
            }}
          >
            {num}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPaginaChange(pagina + 1)}
          disabled={pagina === totalPaginas}
          style={{
            ...paginaBtnStyle,
            opacity: pagina === totalPaginas ? 0.4 : 1,
            cursor: pagina === totalPaginas ? "not-allowed" : "pointer",
          }}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
