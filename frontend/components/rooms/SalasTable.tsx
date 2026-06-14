import { FiEdit, FiFileText, FiTrash2 } from "react-icons/fi";
import type Room from "../../src/interfaces/sala";
import IconActionButton from "../../components/global/IconActionButton";

type SalasTableProps = {
  salas: Room[];
  onEditarSala: (id: number) => void;
  onExcluirSala: (sala: Room) => void;
};

export default function SalasTable({
  salas,
  onEditarSala,
  onExcluirSala,
}: SalasTableProps) {
  return (
    <>
      <style>
        {`
          .salas-table-wrapper {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            overflow: hidden;
          }

          .salas-table {
            width: 100%;
            border-collapse: collapse;
          }

          .salas-mobile {
            display: none;
          }

          @media (max-width: 768px) {
            .salas-table-wrapper {
              display: none;
            }

            .salas-mobile {
              display: grid;
              gap: 12px;
              width: 100%;
            }
          }
        `}
      </style>

      <div className="salas-table-wrapper">
        <table className="salas-table">
          <thead>
            <tr
              style={{
                background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {[
                "ID",
                "Nome",
                "Prédio",
                "Andar",
                "Campus",
                "Equipamentos",
                "Ações",
              ].map((titulo) => (
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
              ))}
            </tr>
          </thead>

          <tbody>
            {salas.map((sala) => (
              <tr
                key={sala.id}
                style={{
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <td style={{ padding: "14px 12px", fontWeight: 700 }}>
                  {sala.id}
                </td>

                <td style={{ padding: "14px 12px" }}>{sala.name}</td>

                <td style={{ padding: "14px 12px" }}>{sala.building ?? "-"}</td>

                <td style={{ padding: "14px 12px" }}>{sala.floor ?? "-"}</td>

                <td style={{ padding: "14px 12px" }}>{sala.campus ?? "-"}</td>

                <td
                  style={{
                    padding: "14px 12px",
                    textAlign: "center",
                  }}
                >
                  {sala._count?.equipments ?? 0}
                </td>

                <td style={{ padding: "14px 12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <IconActionButton
                      title="Editar sala"
                      icon={<FiEdit size={18} />}
                      onClick={() => onEditarSala(sala.id)}
                    />

                    <IconActionButton
                      title="Gerar relatório"
                      icon={<FiFileText size={18} />}
                      variant="report"
                    />

                    <IconActionButton
                      title="Excluir sala"
                      icon={<FiTrash2 size={18} />}
                      variant="danger"
                      onClick={() => onExcluirSala(sala)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="salas-mobile">
        {salas.map((sala) => (
          <div
            key={sala.id}
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
                alignItems: "flex-start",
                gap: "12px",
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
                  {sala.name}
                </strong>

                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "4px",
                  }}
                >
                  Sala #{sala.id}
                </span>
              </div>

              <span
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "6px 10px",
                  borderRadius: "999px",
                }}
              >
                {sala._count?.equipments ?? 0} equip.
              </span>
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
                <strong>Prédio:</strong> {sala.building ?? "-"}
              </div>

              <div>
                <strong>Andar:</strong> {sala.floor ?? "-"}
              </div>

              <div>
                <strong>Campus:</strong> {sala.campus ?? "-"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <IconActionButton
                title="Editar sala"
                icon={<FiEdit size={18} />}
                onClick={() => onEditarSala(sala.id)}
              />

              <IconActionButton
                title="Gerar relatório"
                icon={<FiFileText size={18} />}
                variant="report"
              />

              <IconActionButton
                title="Excluir sala"
                icon={<FiTrash2 size={18} />}
                variant="danger"
                onClick={() => onExcluirSala(sala)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
