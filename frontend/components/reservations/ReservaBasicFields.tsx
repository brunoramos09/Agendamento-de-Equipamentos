import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";

import type Reservation from "../../src/interfaces/reserva";

import {
  datesGridStyle,
  fieldLabelStyle,
  inputStyle,
  textareaStyle,
} from "../../src/styles/criarReservaStyles";

export type ReservaFormState = {
  user: string;
  startDate: string;
  endDate: string;
  observations: string;
  equipments: { equipmentId: number }[];
};

type ReservaBasicFieldsProps = {
  reserva: ReservaFormState;
  reservas: Reservation[];
  equipamentosSelecionados: number[];
  startDate: Date | null;
  endDate: Date | null;
  onChangeReserva: (reserva: ReservaFormState) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
};

export default function ReservaBasicFields({
  reserva,
  reservas,
  equipamentosSelecionados,
  startDate,
  endDate,
  onChangeReserva,
  onChangeStartDate,
  onChangeEndDate,
}: ReservaBasicFieldsProps) {
  function horarioReservado(date: Date) {
    return reservas.some((reservaExistente) => {
      const possuiEquipamentoSelecionado = reservaExistente.equipments.some(
        (equipamentoReserva) =>
          equipamentosSelecionados.includes(equipamentoReserva.equipmentId),
      );

      if (!possuiEquipamentoSelecionado) {
        return false;
      }

      const inicio = new Date(reservaExistente.startDate);
      const fim = new Date(reservaExistente.endDate);

      return (
        date.getTime() >= inicio.getTime() && date.getTime() <= fim.getTime()
      );
    });
  }

  function diaSemHorariosDisponiveis(date: Date) {
    if (equipamentosSelecionados.length === 0) {
      return false;
    }

    const horariosDoDia: Date[] = [];

    for (let hora = 0; hora < 24; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 15) {
        const horario = new Date(date);

        horario.setHours(hora);
        horario.setMinutes(minuto);
        horario.setSeconds(0);
        horario.setMilliseconds(0);

        horariosDoDia.push(horario);
      }
    }

    return horariosDoDia.every((horario) => horarioReservado(horario));
  }

  return (
    <>
      <div>
        <label style={fieldLabelStyle}>Usuário</label>

        <input
          type="text"
          value={reserva.user}
          onChange={(event) =>
            onChangeReserva({
              ...reserva,
              user: event.target.value,
            })
          }
          placeholder="Nome do responsável"
          style={inputStyle}
        />
      </div>

      <div style={datesGridStyle}>
        <div>
          <label style={fieldLabelStyle}>Data/Hora Inicial</label>

          <DatePicker
            selected={startDate}
            onChange={onChangeStartDate}
            showTimeSelect
            timeCaption="Hora"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            locale={ptBR}
            placeholderText="Selecione a data inicial"
            className="custom-datepicker"
            showPopperArrow={false}
            filterTime={(time) => !horarioReservado(time)}
            filterDate={(date) => !diaSemHorariosDisponiveis(date)}
            dayClassName={(date) =>
              diaSemHorariosDisponiveis(date) ? "dia-sem-vagas" : ""
            }
          />
        </div>

        <div>
          <label style={fieldLabelStyle}>Data/Hora Final</label>

          <DatePicker
            selected={endDate}
            onChange={onChangeEndDate}
            showTimeSelect
            timeCaption="Hora"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            locale={ptBR}
            minDate={startDate || undefined}
            minTime={
              startDate &&
              endDate &&
              startDate.toDateString() === endDate.toDateString()
                ? startDate
                : new Date(0, 0, 0, 0, 0)
            }
            maxTime={new Date(0, 0, 0, 23, 45)}
            placeholderText="Selecione a data final"
            className="custom-datepicker"
            showPopperArrow={false}
            filterTime={(time) => !horarioReservado(time)}
            filterDate={(date) => !diaSemHorariosDisponiveis(date)}
            dayClassName={(date) =>
              diaSemHorariosDisponiveis(date) ? "dia-sem-vagas" : ""
            }
          />
        </div>
      </div>

      <div>
        <label style={fieldLabelStyle}>Observações</label>

        <textarea
          rows={4}
          value={reserva.observations}
          onChange={(event) =>
            onChangeReserva({
              ...reserva,
              observations: event.target.value,
            })
          }
          placeholder="Informações adicionais da reserva..."
          style={textareaStyle}
        />
      </div>
    </>
  );
}
