import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { buscarEquipamento, editarEquipamento } from "../service";

export default function EditarEquipamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;

    buscarEquipamento(id).then((equipment) => {
      setName(equipment.name);
      setLocation(equipment.location);
      setQuantity(equipment.quantity);
      setDescription(equipment.description ?? "");
      setNotes(equipment.notes ?? "");
    });
  }, [id]);

  async function salvar() {
    if (!id) return;

    if (!name.trim() || !location.trim()) {
      alert("Preencha nome e localização");
      return;
    }

    await editarEquipamento(id, {
      name,
      location,
      quantity: quantity === "" ? undefined : quantity,
      description,
      notes,
    });

    navigate("/equipamentos");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <Link
            to="/equipamentos"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </Link>

          <h1 className="text-2xl font-semibold text-gray-800 mt-2">
            Editar equipamento
          </h1>

          <p className="text-gray-500 text-sm">
            Atualize as informações abaixo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do equipamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Localização"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            min={1}
            placeholder="Quantidade"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
          />

          <div className="md:col-span-2">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Observações"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/equipamentos")}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 py-2.5 rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            onClick={salvar}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            Salvar
          </button>
        </div>
      </div>
    </main>
  );
}
