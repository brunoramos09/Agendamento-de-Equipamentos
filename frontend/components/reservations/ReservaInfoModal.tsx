import type Reservation from "../../src/interfaces/reserva";
import { formatarData } from "../../src/utils/reservaUtils";
import {
  buttonStyle,
  infoGridStyle,
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
  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ margin: "0 0 16px" }}>Reserva #{reserva.id}</h2>

        <div style={infoGridStyle}>
          <strong>Usuário</strong>
          <span>{reserva.user}</span>

          <strong>Início</strong>
          <span>{formatarData(reserva.startDate)}</span>

          <strong>Fim</strong>
          <span>{formatarData(reserva.endDate)}</span>

          <strong>Devolução</strong>
          <span>{formatarData(reserva.returnedAt)}</span>

          <strong>Observações</strong>
          <span>{reserva.observations || "-"}</span>

          {reserva.returnedAt && (
            <>
              <strong>Problema relatado</strong>
              <span>{reserva.hadIssue ? "Sim" : "Não"}</span>

              {reserva.hadIssue && (
                <>
                  <strong>Obs. devolução</strong>
                  <span>{reserva.returnObservations || "-"}</span>
                </>
              )}
            </>
          )}
        </div>

        <h3 style={{ margin: "20px 0 10px" }}>Equipamentos</h3>

        {reserva.equipments?.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {reserva.equipments.map((item) => (
              <li key={item.id}>{item.equipment?.name || "-"}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhum equipamento vinculado.</p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={buttonStyle}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
