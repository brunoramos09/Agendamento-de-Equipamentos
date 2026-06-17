import type Reservation from "../../src/interfaces/reserva";
import { formatarData, getStatusReserva } from "../../src/utils/reservaUtils";
import { FiInfo, FiRotateCcw, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import IconActionButton from "../../components/global/IconActionButton";
import { isAdmin } from "../../src/utils/authRole";

type ReservasTableProps = {
  reservas: Reservation[];
  devolvendoId: number | null;
  isAdmin: boolean;

  onInfo: (reserva: Reservation) => void;
  onDevolver: (reserva: Reservation) => void;
  onExcluir: (reserva: Reservation) => void;

  onApprove: (reserva: Reservation) => void;
  onReject: (reserva: Reservation) => void;
};

export default function ReservasTable({
  reservas,
  devolvendoId,
  onInfo,
  onDevolver,
  onExcluir,
  onApprove,
  onReject,
}: ReservasTableProps) {
  function getReservationStatus(reserva: Reservation) {
    if (reserva.returnedAt) {
      return {
        label: "DEVOLVIDA",
        bg: "#c7e2fe",
        color: "#164065",
      };
    }

    if (reserva.status === "PENDENTE_APROVACAO") {
      return {
        label: "PENDENTE",
        bg: "#fef3c7",
        color: "#92400e",
      };
    }

    if (reserva.status === "REJEITADA") {
      return {
        label: "REJEITADA",
        bg: "#fee2e2",
        color: "#991b1b",
      };
    }

    return getStatusReserva(reserva);
  }
  return (
    <>
      <style>
        {`
          .reservas-table-wrapper {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            overflow: hidden;
          }

          .reservas-table {
            width: 100%;
            border-collapse: collapse;
          }

          .reservas-mobile {
            display: none;
          }

          @media (max-width: 768px) {
            .reservas-table-wrapper {
              display: none;
            }

            .reservas-mobile {
              display: grid;
              gap: 12px;
              width: 100%;
            }
          }
        `}
      </style>

      <div className="reservas-table-wrapper">
        <table className="reservas-table">
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
              const status = getReservationStatus(reserva);

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

                  <td style={{ padding: "14px 12px" }}>{reserva.user.name}</td>

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

                      {isAdmin() && reserva.status === "PENDENTE_APROVACAO" && (
                        <>
                          <IconActionButton
                            title="Aprovar reserva"
                            icon={<FiCheck size={18} />}
                            variant="success"
                            onClick={() => onApprove(reserva)}
                          />

                          <IconActionButton
                            title="Rejeitar reserva"
                            icon={<FiX size={18} />}
                            variant="danger"
                            onClick={() => onReject(reserva)}
                          />
                        </>
                      )}

                      {getStatusReserva(reserva).key === "ATIVA" || getStatusReserva(reserva).key === "ATRASADA" && (
                        <IconActionButton
                          title={
                            devolvendoId === reserva.id
                              ? "Devolvendo..."
                              : "Registrar devolução"
                          }
                          icon={<FiRotateCcw size={18} />}
                          variant="success"
                          disabled={devolvendoId === reserva.id}
                          onClick={() => onDevolver(reserva)}
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

      <div className="reservas-mobile">
        {reservas.map((reserva) => {
          const status = getReservationStatus(reserva);

          return (
            <div
              key={reserva.id}
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
                    {reserva.user.name}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    Reserva #{reserva.id}
                  </span>
                </div>

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
                  <strong>Início:</strong> {formatarData(reserva.startDate)}
                </div>

                <div>
                  <strong>Fim:</strong> {formatarData(reserva.endDate)}
                </div>

                <div>
                  <strong>Equipamentos:</strong>{" "}
                  {reserva.equipments?.length ?? 0}
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
                  title="Informações da reserva"
                  icon={<FiInfo size={18} />}
                  onClick={() => onInfo(reserva)}
                  variant="info"
                />

                {isAdmin() && reserva.status === "PENDENTE_APROVACAO" && (
                  <>
                    <IconActionButton
                      title="Aprovar reserva"
                      icon={<FiCheck size={18} />}
                      variant="success"
                      onClick={() => onApprove(reserva)}
                    />

                    <IconActionButton
                      title="Rejeitar reserva"
                      icon={<FiX size={18} />}
                      variant="danger"
                      onClick={() => onReject(reserva)}
                    />
                  </>
                )}

                {getStatusReserva(reserva).key === "ATIVA" && (
                  <IconActionButton
                    title={
                      devolvendoId === reserva.id
                        ? "Devolvendo..."
                        : "Registrar devolução"
                    }
                    icon={<FiRotateCcw size={18} />}
                    variant="success"
                    disabled={devolvendoId === reserva.id}
                    onClick={() => onDevolver(reserva)}
                  />
                )}

                <IconActionButton
                  title="Excluir reserva"
                  icon={<FiTrash2 size={18} />}
                  variant="danger"
                  onClick={() => onExcluir(reserva)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
