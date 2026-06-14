/* eslint-disable react-hooks/immutability */
import type Room from "../../src/interfaces/sala";
import { buttonStyle } from "../../src/styles/salasStyles";

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
            {["ID", "Nome", "Prédio", "Andar", "Campus", "Ações"].map(
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
          {salas.map((sala) => (
            <tr key={sala.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: "14px 12px", fontWeight: 700 }}>
                {sala.id}
              </td>

              <td style={{ padding: "14px 12px" }}>{sala.name}</td>

              <td style={{ padding: "14px 12px" }}>{sala.building ?? "-"}</td>

              <td style={{ padding: "14px 12px" }}>{sala.floor ?? "-"}</td>

              <td style={{ padding: "14px 12px" }}>{sala.campus ?? "-"}</td>

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
                    onClick={() => editarSala(sala.id)}
                    style={buttonStyle}
                  >
                    Editar
                  </button>

                  <button type="button" style={buttonStyle}>
                    Relatório
                  </button>

                  <button
                    type="button"
                    onClick={() => onExcluirSala(sala)}
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
