import type Equipment from "../../src/interfaces/equipamento";
import StatusBadge from "./StatusBadge";
import {
  FiEdit,
  FiFileText,
  FiInfo,
  FiTool,
  FiCheckCircle,
  FiTrash2,
} from "react-icons/fi";
import IconActionButton from "../../components/global/IconActionButton";

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
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <IconActionButton
                    title="Informações"
                    icon={<FiInfo size={18} />}
                    onClick={() => onInfo(equipamento)}
                    variant="info"
                  />

                  <IconActionButton
                    title="Editar"
                    icon={<FiEdit size={18} />}
                    onClick={() =>
                      (window.location.href = `/reserva-equipamentos/equipamentos/editar/${equipamento.id}`)
                    }
                  />

                  <IconActionButton
                    title="Relatório"
                    icon={<FiFileText size={18} />}
                    onClick={() => onRelatorio(equipamento.id)}
                    variant="report"
                  />

                  {equipamento.status === "DISPONIVEL" && (
                    <IconActionButton
                      title="Enviar para manutenção"
                      icon={<FiTool size={18} />}
                      variant="warning"
                      onClick={() => onManutencao(equipamento)}
                    />
                  )}

                  {equipamento.status === "MANUTENCAO" && (
                    <IconActionButton
                      title="Finalizar manutenção"
                      icon={<FiCheckCircle size={18} />}
                      variant="success"
                      onClick={() => onFinalizarManutencao(equipamento)}
                    />
                  )}

                  <IconActionButton
                    title="Excluir"
                    icon={<FiTrash2 size={18} />}
                    variant="danger"
                    onClick={() => onExcluir(equipamento)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
