type Props = {
  pesquisa: string;
  onChangePesquisa: (valor: string) => void;
};

export default function BuscaEquipamentos({ pesquisa, onChangePesquisa }: Props) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <input
        type="text"
        placeholder="Pesquisar por nome, patrimônio, sala ou status..."
        value={pesquisa}
        onChange={(e) => onChangePesquisa(e.target.value)}
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
