import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";
import { criarSala } from "../../services/salasService";
import SalaForm from "../../../components/rooms/SalaForm";

import { notify } from "../../utils/notifications";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function CriarSala() {
  const navigate = useNavigate();

  const [salvando, setSalvando] = useState(false);

  const [sala, setSala] = useState({
    name: "",
    building: "",
    floor: 0,
    campus: "",
  });

  usePageTitle("Salas: Novo");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSalvando(true);

      await criarSala(sala);

      notify.created(sala.name);

      navigate("/reserva-equipamentos/salas");
    } catch (error) {
      console.error(error);

      notify.error("Erro ao criar sala.");
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
      <SalaForm
        sala={sala}
        setSala={setSala}
        salvando={salvando}
        titulo="Nova Sala"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/reserva-equipamentos/salas")}
      />
    </AppTemplate>
  );
}
