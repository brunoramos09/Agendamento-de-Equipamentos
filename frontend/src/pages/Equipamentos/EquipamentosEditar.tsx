/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";

import {
  buscarEquipamentoPorId,
  atualizarEquipamento,
} from "../../services/equipamentoService";

import { listarSalas } from "../../services/salasService";

import type Room from "../../interfaces/sala";

import EquipamentoForm from "../../../components/equipaments/EquipamentoForm";
import type { EquipamentoFormData } from "../../../components/equipaments/types";

import { notify } from "../../utils/notifications";

export default function EditarEquipamento() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [salas, setSalas] = useState<Room[]>([]);
  const [carregandoSalas, setCarregandoSalas] = useState(true);

  const [equipamento, setEquipamento] = useState<EquipamentoFormData>({
    name: "",
    serialNumber: "",
    responsibleEmployee: "",
    observations: "",
    instructions: "",
    roomId: 0,
    status: "DISPONIVEL",
    photo: null,
  });

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    if (!id) return;

    try {
      setLoading(true);

      const [equipamentoData, salasData] = await Promise.all([
        buscarEquipamentoPorId(Number(id)),
        listarSalas(),
      ]);

      setSalas(salasData);

      setEquipamento({
        name: equipamentoData.name ?? "",
        serialNumber: equipamentoData.serialNumber ?? "",
        responsibleEmployee: equipamentoData.responsibleEmployee ?? "",
        observations: equipamentoData.observations ?? "",
        instructions: equipamentoData.instructions ?? "",
        roomId: equipamentoData.roomId,
        status: equipamentoData.status,
        photo: null,
      });
    } catch (error) {
      console.error(error);

      notify.error("Erro ao carregar equipamento.");
    } finally {
      setLoading(false);
      setCarregandoSalas(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) return;

    try {
      setSalvando(true);

      const formData = new FormData();

      formData.append("name", equipamento.name);
      formData.append("roomId", String(equipamento.roomId));
      formData.append("status", equipamento.status);

      if (equipamento.serialNumber) {
        formData.append("serialNumber", equipamento.serialNumber);
      }

      if (equipamento.responsibleEmployee) {
        formData.append("responsibleEmployee", equipamento.responsibleEmployee);
      }

      if (equipamento.observations) {
        formData.append("observations", equipamento.observations);
      }

      if (equipamento.instructions) {
        formData.append("instructions", equipamento.instructions);
      }

      if (equipamento.photo) {
        formData.append("photo", equipamento.photo);
      }

      await atualizarEquipamento(Number(id), formData);

      notify.updated(equipamento.name);

      navigate("/reserva-equipamentos/equipamentos");
    } catch (error) {
      console.error(error);

      notify.error("Erro ao atualizar equipamento.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <AppTemplate hideDefaultContent theme={equipamentosTheme}>
        <p>Carregando equipamento...</p>
      </AppTemplate>
    );
  }

  return (
    <AppTemplate hideDefaultContent theme={equipamentosTheme}>
      <EquipamentoForm
        titulo="Editar Equipamento"
        equipamento={equipamento}
        setEquipamento={setEquipamento}
        salas={salas}
        carregandoSalas={carregandoSalas}
        salvando={salvando}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/reserva-equipamentos/equipamentos")}
      />
    </AppTemplate>
  );
}
