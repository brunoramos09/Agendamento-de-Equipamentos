import type Equipment from "../../src/interfaces/equipamento";
import { isAdmin } from "../../src/utils/authRole";
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
  onEditar: (id: number) => void;
  onManutencao: (equipamento: Equipment) => void;
  onFinalizarManutencao: (equipamento: Equipment) => void;
  onRevisao: (equipamento: Equipment) => void;
  onExcluir: (equipamento: Equipment) => void;
};

export default function EquipamentosTable({
  equipamentos,
  onInfo,
  onEditar,
  onRelatorio,
  onManutencao,
  onRevisao,
  onFinalizarManutencao,
  onExcluir,
}: Props) {
  const admin = isAdmin();

  function renderActions(equipamento: Equipment) {
    return (
      <>
        <IconActionButton
          title="Informações"
          icon={<FiInfo size={18} />}
          onClick={() => onInfo(equipamento)}
          variant="info"
        />

        {admin && (
          <IconActionButton
            title="Editar"
            icon={<FiEdit size={18} />}
            onClick={() => onEditar(equipamento.id)}
          />
        )}

        {admin && (
          <IconActionButton
            title="Relatório"
            icon={<FiFileText size={18} />}
            onClick={() => onRelatorio(equipamento.id)}
            variant="report"
          />
        )}

        {admin && equipamento.status === "DISPONIVEL" && (
          <IconActionButton
            title="Enviar para manutenção"
            icon={<FiTool size={18} />}
            variant="warning"
            onClick={() => onManutencao(equipamento)}
          />
        )}

        {admin && equipamento.status === "MANUTENCAO" && (
          <IconActionButton
            title="Finalizar manutenção"
            icon={<FiCheckCircle size={18} />}
            variant="success"
            onClick={() => onFinalizarManutencao(equipamento)}
          />
        )}

        {admin && equipamento.status === "AGUARDANDO_REVISAO" && (
          <IconActionButton
            title="Revisar devolução"
            icon={<FiTool size={18} />}
            variant="warning"
            onClick={() => onRevisao(equipamento)}
          />
        )}

        {admin && (
          <IconActionButton
            title="Excluir"
            icon={<FiTrash2 size={18} />}
            variant="danger"
            onClick={() => onExcluir(equipamento)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <style>
        {`
          .equipamentos-table-wrapper {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            overflow: hidden;
          }

          .equipamentos-table {
            width: 100%;
            border-collapse: collapse;
          }

          .equipamentos-mobile-list {
            display: none;
          }

          @media (max-width: 768px) {
            .equipamentos-table-wrapper {
              display: none;
            }

            .equipamentos-mobile-list {
              display: grid;
              gap: 12px;
              width: 100%;
            }
          }
        `}
      </style>

      <div className="equipamentos-table-wrapper">
        <table className="equipamentos-table">
          <thead>
            <tr
              style={{
                background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {["ID", "Nome", "Responsável", "Sala", "Status", "Ações"].map(
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

                <td style={{ padding: "14px 12px" }}>{equipamento.name}</td>

                <td style={{ padding: "14px 12px" }}>
                  {equipamento.responsibleEmployee ?? "-"}
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
                    {renderActions(equipamento)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="equipamentos-mobile-list">
        {equipamentos.map((equipamento) => (
          <div
            key={equipamento.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "14px",
              background: "#fff",
              boxShadow: "0 8px 18px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "15px",
                    color: "#111827",
                  }}
                >
                  {equipamento.name}
                </strong>

                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "4px",
                  }}
                >
                  ID #{equipamento.id}
                </span>
              </div>

              <StatusBadge status={equipamento.status} />
            </div>

            <div
              style={{
                display: "grid",
                gap: "8px",
                fontSize: "13px",
                color: "#374151",
                marginBottom: "14px",
              }}
            >
              <div>
                <strong>Patrimônio: </strong>
                {equipamento.responsibleEmployee ?? "-"}
              </div>

              <div>
                <strong>Sala: </strong>
                {equipamento.room?.name ?? "-"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              {renderActions(equipamento)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
