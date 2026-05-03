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
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <Link
            to="/reservas"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Nova reserva
          </h1>

          <p className="text-sm text-gray-500">Preencha os dados da reserva</p>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Equipamento
              </label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
              >
                <option value="">Selecione um equipamento</option>

                {equipamentos.map((equipment) => (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.name} - {equipment.room?.name} -{" "}
                    {equipment.room?.building}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Responsável
              </label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Início
              </label>
              <input
                type="datetime-local"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Fim</label>
              <input
                type="datetime-local"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
              onClick={() => navigate("/reservas")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              onClick={salvar}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Salvar reserva
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
