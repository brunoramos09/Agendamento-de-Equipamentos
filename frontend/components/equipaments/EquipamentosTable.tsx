import type Equipment from "../../src/interfaces/equipamento";
import { buttonStyle } from "../../src/styles/equipamentosStyles";
import StatusBadge from "./StatusBadge";

type Props = {
  equipamentos: Equipment[];
  onInfo: (equipamento: Equipment) => void;
  onRelatorio: (id: number) => void;
  onManutencao: (equipamento: Equipment) => void;
  onFinalizarManutencao: (equipamento: Equipment) => void;
  onExcluir: (equipamento: Equipment) => void;
};

export default function EquipamentosTable({
  equipamentos,
  onInfo,
  onRelatorio,
  onManutencao,
  onFinalizarManutencao,
  onExcluir,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", minWidth: "750px" }}
      >
        <thead>
          <tr
            style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}
          >
            {["ID", "Nome", "Patrimônio", "Sala", "Status", "Ações"].map(
              (titulo) => (
                <th
                  key={titulo}
                  style={{
                    textAlign: titulo === "Ações" ? "center" : "left",
                    padding: "14px 12px",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#374151",
                  }}
                >
                  {titulo}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {equipamentos.map((equipamento) => (
            <tr
              key={equipamento.id}
              style={{ borderBottom: "1px solid #f3f4f6" }}
            >
              <td style={{ padding: "14px 12px", fontWeight: 700 }}>
                {equipamento.id}
              </td>

              <td style={{ padding: "14px 12px" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>{equipamento.name}</span>

                  <button
                    type="button"
                    onClick={() => onInfo(equipamento)}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "1px solid #d1d5db",
                      background: "#fff",
                      color: "#374151",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    i
                  </button>
                </div>
              </td>

              <td style={{ padding: "14px 12px" }}>
                {equipamento.serialNumber ?? "-"}
              </td>
              <td style={{ padding: "14px 12px" }}>
                {equipamento.room?.name ?? "-"}
              </td>

              <td style={{ padding: "14px 12px" }}>
                <StatusBadge status={equipamento.status} />
              </td>

              <td style={{ padding: "14px 12px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href = `/reserva-equipamentos/equipamentos/editar/${equipamento.id}`)
                    }
                    style={buttonStyle}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => onRelatorio(equipamento.id)}
                    style={buttonStyle}
                  >
                    Relatório
                  </button>

                  {equipamento.status === "DISPONIVEL" && (
                    <button
                      type="button"
                      onClick={() => onManutencao(equipamento)}
                      style={{ ...buttonStyle, background: "#92400e" }}
                    >
                      Manutenção
                    </button>
                  )}

                  {equipamento.status === "MANUTENCAO" && (
                    <button
                      type="button"
                      onClick={() => onFinalizarManutencao(equipamento)}
                      style={{ ...buttonStyle, background: "#166534" }}
                    >
                      Finalizar
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onExcluir(equipamento)}
                    style={{ ...buttonStyle, background: "#7f1d1d" }}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
