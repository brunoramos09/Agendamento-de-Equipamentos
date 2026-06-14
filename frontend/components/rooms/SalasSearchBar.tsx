type SalasSearchBarProps = {
  pesquisa: string;
  onPesquisaChange: (valor: string) => void;
};

export default function SalasSearchBar({
  pesquisa,
  onPesquisaChange,
}: SalasSearchBarProps) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <input
        type="text"
        placeholder="Pesquisar por nome, prédio, andar ou campus..."
        value={pesquisa}
        onChange={(e) => onPesquisaChange(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "12px 14px",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          outline: "none",
          fontSize: "14px",
        }}
      />
    </div>
  );
}
