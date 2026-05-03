import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { buscarEquipamento, editarEquipamento } from "../service";
import { listarSalas } from "../../rooms/service";
import type { Room } from "../../rooms/types";

export default function EditarEquipamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    listarSalas().then(setRooms);
  }, []);

  useEffect(() => {
    if (!id) return;

    buscarEquipamento(id).then((equipment) => {
      setName(equipment.name);
      setRoomId(equipment.roomId);
      setDescription(equipment.description ?? "");
      setNotes(equipment.notes ?? "");
    });
  }, [id]);

  async function salvar() {
    if (!id) return;

    if (!name.trim() || roomId === "") {
      alert("Preencha nome e sala");
      return;
    }

    await editarEquipamento(id, {
      name,
      roomId,
      description,
      notes,
    });

    navigate("/equipamentos");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to="/equipamentos"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Voltar
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Editar equipamento
            </h1>

            <p className="text-sm text-gray-500">
              Atualize as informações do equipamento
            </p>
          </div>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Projetor Epson"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Sala</label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={roomId}
                onChange={(e) =>
                  setRoomId(e.target.value === "" ? "" : Number(e.target.value))
                }
              >
                <option value="">Selecione uma sala</option>

                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - {room.building} (andar {room.floor})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Descrição
              </label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Opcional"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Opcional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4">
            <button
              onClick={() => navigate("/equipamentos")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              onClick={salvar}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Salvar alterações
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
