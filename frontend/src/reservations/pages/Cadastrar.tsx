import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listarEquipamentos } from "../../equipaments/service";
import type { Equipment } from "../../equipaments/types";
import { criarReserva } from "../service";

export default function CadastrarReserva() {
  const navigate = useNavigate();

  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);
  const [equipmentId, setEquipmentId] = useState("");
  const [requester, setRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    listarEquipamentos().then(setEquipamentos);
  }, []);

  async function salvar() {
    if (!equipmentId || !requester.trim() || !startDate || !endDate) {
      alert("Preencha equipamento, responsável, início e fim da reserva");
      return;
    }

    await criarReserva({
      equipmentId: Number(equipmentId),
      requester,
      startDate,
      endDate,
      notes,
    });

    navigate("/reservas");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <Link
            to="/reservas"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </Link>

          <h1 className="text-2xl font-semibold text-gray-800 mt-2">
            Nova reserva
          </h1>

          <p className="text-gray-500 text-sm">Preencha os dados da reserva</p>
        </div>

        <div className="space-y-4">
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
          >
            <option value="">Selecione um equipamento</option>

            {equipamentos.map((equipment) => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.name} - {equipment.location}
              </option>
            ))}
          </select>

          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Responsável"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Observações"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
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
