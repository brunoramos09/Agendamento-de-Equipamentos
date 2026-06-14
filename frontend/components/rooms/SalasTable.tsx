/* eslint-disable react-hooks/immutability */
import { FiEdit, FiFileText, FiTrash2 } from "react-icons/fi";
import type Room from "../../src/interfaces/sala";
import IconActionButton from "../../components/global/IconActionButton";

type SalasTableProps = {
  salas: Room[];
  onExcluirSala: (sala: Room) => void;
};

export default function SalasTable({ salas, onExcluirSala }: SalasTableProps) {
  function editarSala(id: number) {
    window.location.href = `/reserva-equipamentos/salas/editar/${id}`;
  }

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
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "650px",
        }}
      >
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
            <tr key={sala.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "14px 12px", fontWeight: 700 }}>
                {sala.id}
              </td>

              <td style={{ padding: "14px 12px" }}>{sala.name}</td>

              <td style={{ padding: "14px 12px" }}>{sala.building ?? "-"}</td>

              <td style={{ padding: "14px 12px" }}>{sala.floor ?? "-"}</td>

              <td style={{ padding: "14px 12px" }}>{sala.campus ?? "-"}</td>

              <td style={{ padding: "14px 12px", textAlign: "center" }}>
                {sala._count?.equipments ?? 0}
              </td>

              <td style={{ padding: "14px 12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <IconActionButton
                    title="Editar sala"
                    icon={<FiEdit size={18} />}
                    onClick={() => editarSala(sala.id)}
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
  );
}
