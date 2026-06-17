import type Reservation from "../../src/interfaces/reserva";
import { formatarData } from "../../src/utils/reservaUtils";
import {
  buttonStyle,
  modalOverlayStyle,
  modalStyle,
} from "../../src/styles/reservaStyles";

type ReservaInfoModalProps = {
  reserva: Reservation;
  onClose: () => void;
};

export default function ReservaInfoModal({
  reserva,
  onClose,
}: ReservaInfoModalProps) {
  console.log(reserva.equipments);
  return (
    <div style={modalOverlayStyle}>
      <div
        style={{
          ...modalStyle,
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "16px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              color: "#111827",
            }}
          >
            Reserva #{reserva.id}
          </h2>

          <span
            style={{
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Detalhes completos da reserva
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <strong>Usuário</strong>
          <span>{reserva.user.name}</span>

          <strong>Data de início</strong>
          <span>{formatarData(reserva.startDate)}</span>

          <strong>Data de fim</strong>
          <span>{formatarData(reserva.endDate)}</span>

          <strong>Data devolução</strong>
          <span>
            {reserva.returnedAt
              ? formatarData(reserva.returnedAt)
              : "Ainda não devolvido"}
          </span>

          <strong>Observações</strong>
          <span>{reserva.observations || "-"}</span>
        </div>

        {reserva.returnedAt && (
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "16px",
              }}
            >
              Informações da Devolução
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: "10px",
              }}
            >
              <strong>Problema relatado</strong>

              <span
                style={{
                  color: reserva.hadIssue ? "#dc2626" : "#16a34a",
                  fontWeight: 700,
                }}
              >
                {reserva.hadIssue ? "Sim" : "Não"}
              </span>

              {reserva.hadIssue && (
                <>
                  <strong>Obs. devolução</strong>
                  <span>{reserva.returnObservations || "-"}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              marginBottom: "12px",
              fontSize: "18px",
            }}
          >
            Equipamentos Reservados
          </h3>

          {reserva.equipments?.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              {reserva.equipments.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    background: "#fafafa",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        display: "block",
                        color: "#111827",
                      }}
                    >
                      {item.equipment?.name || "-"}
                    </strong>

                    {item.equipment?.room?.name && (
                      <span
                        style={{
                          color: "#6b7280",
                          fontSize: "13px",
                          display: "block",
                        }}
                      >
                        Sala: {item.equipment.room.name}
                      </span>
                    )}

                    {item.equipment?.responsibleEmployee && (
                      <span
                        style={{
                          color: "#6b7280",
                          fontSize: "13px",
                          display: "block",
                        }}
                      >
                        Responsável: {item.equipment.responsibleEmployee}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      background: "#eef2ff",
                      color: "#4338ca",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {item.subdivisionsQuantity ?? 1} un.
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "14px",
                background: "#f9fafb",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                color: "#6b7280",
              }}
            >
              Nenhum equipamento vinculado.
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "16px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              ...buttonStyle,
              minWidth: "120px",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
