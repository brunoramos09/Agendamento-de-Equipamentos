/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppTemplate from "../AppTemplate";
import equipamentosTheme from "../../styles/theme/equipamentosTheme";
import { buscarSalaPorId, atualizarSala } from "../../services/salasService";
import { notify } from "../../utils/notifications";
import SalaForm from "../../../components/rooms/SalaForm";

type SalaFormData = {
  name: string;
  building: string;
  floor: number;
  campus: string;
};

export default function EditarSala() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [sala, setSala] = useState<SalaFormData>({
    name: "",
    building: "",
    floor: 0,
    campus: "",
  });

  useEffect(() => {
    carregarSala();
  }, [id]);

  async function carregarSala() {
    if (!id) {
      setErro("ID da sala não informado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErro("");

      const dados = await buscarSalaPorId(Number(id));

      setSala({
        name: dados.name ?? "",
        building: dados.building ?? "",
        floor: dados.floor ?? 0,
        campus: dados.campus ?? "",
      });
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os dados da sala.");
    } finally {
      setLoading(false);
    }
  }

  async function salvarSala(e: React.FormEvent) {
    e.preventDefault();

    if (!id) return;

    if (!sala.name.trim()) {
      notify.error("Informe o nome da sala.");
      return;
    }

    try {
      setSalvando(true);

      await atualizarSala(Number(id), sala);

      notify.updated(sala.name);

      navigate("/reserva-equipamentos/salas");
    } catch (error) {
      console.error(error);

      notify.error("Não foi possível atualizar a sala.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <AppTemplate hideDefaultContent theme={equipamentosTheme}>
        <div
          style={{
            padding: "24px",
            fontSize: "15px",
          }}
        >
          Carregando sala...
        </div>
      </AppTemplate>
    );
  }

  if (erro) {
    return (
      <AppTemplate hideDefaultContent theme={equipamentosTheme}>
        <div
          style={{
            padding: "24px",
            color: "#dc2626",
            fontWeight: 600,
          }}
        >
          {erro}
        </div>
      </AppTemplate>
    );
  }

  return (
    <AppTemplate hideDefaultContent theme={equipamentosTheme}>
      <SalaForm
        sala={sala}
        setSala={setSala}
        salvando={salvando}
        titulo="Editar Sala"
        onSubmit={salvarSala}
        onCancel={() => navigate("/reserva-equipamentos/salas")}
      />
    </AppTemplate>
  );
}
