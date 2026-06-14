import type Reservation from "../../src/interfaces/reserva";
import { formatarData, getStatusReserva } from "../../src/utils/reservaUtils";
import { FiInfo, FiRotateCcw, FiTrash2 } from "react-icons/fi";
import IconActionButton from "../../components/global/IconActionButton";

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
                      gap: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <IconActionButton
                      title="Informações da reserva"
                      icon={<FiInfo size={18} />}
                      onClick={() => onInfo(reserva)}
                      variant="info"
                    />

                    {!reserva.returnedAt && (
                      <IconActionButton
                        title={
                          devolvendoId === reserva.id
                            ? "Devolvendo..."
                            : "Registrar devolução"
                        }
                        icon={<FiRotateCcw size={18} />}
                        variant="success"
                        disabled={devolvendoId === reserva.id}
                        onClick={() => onDevolver(reserva.id)}
                      />
                    )}

                    <IconActionButton
                      title="Excluir reserva"
                      icon={<FiTrash2 size={18} />}
                      variant="danger"
                      onClick={() => onExcluir(reserva)}
                    />
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
