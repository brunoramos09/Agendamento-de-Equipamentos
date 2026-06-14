import type Reservation from "../../src/interfaces/reserva";
import { formatarData, getStatusReserva } from "../../src/utils/reservaUtils";
import { buttonStyle } from "../../src/styles/reservaStyles";

type ReservasTableProps = {
  reservas: Reservation[];
  devolvendoId: number | null;
  onInfo: (reserva: Reservation) => void;
  onDevolver: (id: number) => void;
  onExcluir: (reserva: Reservation) => void;
};

export default function ReservasTable({
  reservas,
  devolvendoId,
  onInfo,
  onDevolver,
  onExcluir,
}: ReservasTableProps) {
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
          minWidth: "850px",
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
              "Usuário",
              "Início",
              "Fim",
              "Equipamentos",
              "Status",
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
          {reservas.map((reserva) => {
            const status = getStatusReserva(reserva);

            return (
              <tr
                key={reserva.id}
                style={{
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <td style={{ padding: "14px 12px", fontWeight: 700 }}>
                  {reserva.id}
                </td>

                <td style={{ padding: "14px 12px" }}>{reserva.user}</td>

                <td style={{ padding: "14px 12px" }}>
                  {formatarData(reserva.startDate)}
                </td>

                <td style={{ padding: "14px 12px" }}>
                  {formatarData(reserva.endDate)}
                </td>

                <td style={{ padding: "14px 12px" }}>
                  {reserva.equipments?.length ?? 0}
                </td>

                <td style={{ padding: "14px 12px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "5px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 800,
                      background: status.bg,
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </span>
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
                      onClick={() => onInfo(reserva)}
                      style={buttonStyle}
                    >
                      Info
                    </button>

                    {!reserva.returnedAt && (
                      <button
                        type="button"
                        onClick={() => onDevolver(reserva.id)}
                        disabled={devolvendoId === reserva.id}
                        style={{
                          ...buttonStyle,
                          opacity: devolvendoId === reserva.id ? 0.7 : 1,
                          cursor:
                            devolvendoId === reserva.id
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {devolvendoId === reserva.id
                          ? "Devolvendo..."
                          : "Devolver"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onExcluir(reserva)}
                      style={{
                        ...buttonStyle,
                        background: "#7f1d1d",
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
