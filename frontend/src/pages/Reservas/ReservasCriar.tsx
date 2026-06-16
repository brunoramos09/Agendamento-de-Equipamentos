/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";

import type Equipment from "../../interfaces/equipamento";
import type Reservation from "../../interfaces/reserva";

import { listarEquipamentos } from "../../services/equipamentoService";
import { criarReserva, listarReservas } from "../../services/reservaService";

import { notify } from "../../utils/notifications";
import { usePageTitle } from "../../hooks/usePageTitle";

import CriarReservaHeader from "../../../components/reservations/CriarReservaHeader";
import EquipamentosReservaSelector from "../../../components/reservations/EquipamentosReservaSelector";
import ReservaBasicFields, {
  type ReservaFormState,
} from "../../../components/reservations/ReservaBasicFields";
import ReservaFormActions from "../../../components/reservations/ReservaFormActions";
import {
  formGridStyle,
  pageContainerStyle,
} from "../../styles/criarReservaStyles";

const RESERVAS_ROUTE = "/reserva-equipamentos/reservas";

const reservaInicial: ReservaFormState = {
  user: "",
  startDate: "",
  endDate: "",
  observations: "",
  equipments: [],
};

export default function CriarReserva() {
  const navigate = useNavigate();

  const [salvando, setSalvando] = useState(false);

  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);
  const [reservas, setReservas] = useState<Reservation[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [reserva, setReserva] = useState<ReservaFormState>(reservaInicial);

  usePageTitle("Reservas: Novo");

  useEffect(() => {
    carregarEquipamentos();
    carregarReservas();
  }, []);

  async function carregarEquipamentos() {
    try {
      const dados = await listarEquipamentos();

      setEquipamentos(
        dados.filter(
          (equipamento: Equipment) => equipamento.status === "DISPONIVEL",
        ),
      );
    } catch (error) {
      console.error(error);
      notify.error("Não foi possível carregar os equipamentos.");
    }
  }

  async function carregarReservas() {
    try {
      const dados = await listarReservas();

      setReservas(
        dados.filter((reserva: { returnedAt: any }) => !reserva.returnedAt),
      );
    } catch (error) {
      console.error(error);
    }
  }

  function atualizarStartDate(date: Date | null) {
    setStartDate(date);

    if (date && endDate && endDate.getTime() < date.getTime()) {
      setEndDate(null);
    }
  }

  function atualizarEndDate(date: Date | null) {
    setEndDate(date);
  }

  function toggleEquipamento(id: number) {
    setReserva((reservaAtual) => {
      const existe = reservaAtual.equipments.some(
        (item) => item.equipmentId === id,
      );

      return {
        ...reservaAtual,
        equipments: existe
          ? reservaAtual.equipments.filter((item) => item.equipmentId !== id)
          : [...reservaAtual.equipments, { equipmentId: id }],
      };
    });
  }

  function validarReserva() {
    if (!startDate) {
      notify.error("Informe a data inicial.");
      return false;
    }

    if (!endDate) {
      notify.error("Informe a data final.");
      return false;
    }

    if (startDate && endDate && endDate.getTime() <= startDate.getTime()) {
      notify.error("A data final deve ser maior que a data inicial.");
      return false;
    }

    if (reserva.equipments.length === 0) {
      notify.error("Selecione ao menos um equipamento.");
      return false;
    }

    return true;
  }

  async function salvarReserva() {
    try {
      if (!validarReserva()) {
        return;
      }

      setSalvando(true);

      const usuario = JSON.parse(localStorage.getItem("usuario") ?? "null");

      await criarReserva({
        userId: usuario.id,
        startDate: startDate!.toISOString(),
        endDate: endDate!.toISOString(),
        observations: reserva.observations,
        equipments: reserva.equipments,
      });

      notify.created("Reserva");
      navigate(RESERVAS_ROUTE);
    } catch (error: any) {
      console.error(error);
      notify.error(error?.message ?? "Não foi possível criar a reserva.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AppTemplate
      hideDefaultContent={true}
      theme={equipamentosTheme}
      primaryAction={null}
      secondaryAction={null}
      appName="Sistema de Agendamento de Equipamentos"
      appSubtitle="Nova Reserva"
      appDescription="Cadastre uma nova reserva de equipamentos."
    >
      <div style={pageContainerStyle}>
        <CriarReservaHeader />

        <div style={formGridStyle}>
          <ReservaBasicFields
            reserva={reserva}
            reservas={reservas}
            equipamentosSelecionados={reserva.equipments.map(
              (equipamento) => equipamento.equipmentId,
            )}
            startDate={startDate}
            endDate={endDate}
            onChangeReserva={setReserva}
            onChangeStartDate={atualizarStartDate}
            onChangeEndDate={atualizarEndDate}
          />

          <EquipamentosReservaSelector
            equipamentos={equipamentos}
            equipamentosSelecionados={reserva.equipments}
            onToggleEquipamento={toggleEquipamento}
          />

          <ReservaFormActions
            salvando={salvando}
            onCancel={() => navigate(RESERVAS_ROUTE)}
            onSubmit={salvarReserva}
          />
        </div>
      </div>
    </AppTemplate>
  );
}
