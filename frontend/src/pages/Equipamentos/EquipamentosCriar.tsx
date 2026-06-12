/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";
import { criarEquipamento } from "../../services/equipamentoService";
import { listarSalas } from "../../services/salasService";
import type Room from "../../interfaces/sala";
import EquipamentoForm from "../../../components/equipaments/EquipamentoForm";
import type { EquipamentoFormData } from "../../../components/equipaments/types";

import { notify } from "../../utils/notifications";

export default function CriarEquipamento() {
  const navigate = useNavigate();

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
    carregarSalas();
  }, []);

  async function carregarSalas() {
    try {
      const dados = await listarSalas();

      setSalas(dados);

      if (dados.length > 0) {
        setEquipamento((prev) => ({
          ...prev,
          roomId: dados[0].id,
        }));
      }
    } catch (error) {
      console.error(error);
      notify.error("Erro ao carregar salas.");
    } finally {
      setCarregandoSalas(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

      await criarEquipamento(formData);

      notify.created("Equipamento: " + equipamento.name);

      navigate("/reserva-equipamentos/equipamentos");
    } catch (error) {
      console.error(error);
      notify.error("Erro ao criar equipamento.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AppTemplate 
      hideDefaultContent 
      theme={equipamentosTheme}
      primaryAction={null}
      secondaryAction={null}
    >
      <EquipamentoForm
        titulo="Novo Equipamento"
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
