import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarReservas } from "../service";
import type { Reservation } from "../types";

function formatarData(data: string) {
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function ListaReservas() {
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarReservas()
      .then(setReservas)
      .catch((err) => console.error("Erro ao carregar reservas:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Reservas</h1>
            <p className="text-sm text-gray-500 mt-1">
              Consulte todas as reservas de equipamentos cadastradas.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/equipamentos"
              className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Ver equipamentos
            </Link>

            <Link
              to="/reservas/cadastrar"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Nova reserva
            </Link>
          </div>
        </header>

        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-gray-500">
            Carregando reservas...
          </div>
        )}

        {!loading && reservas.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-gray-500">
            Nenhuma reserva cadastrada.
          </div>
        )}

        {!loading && reservas.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Equipamento
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Responsável
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Início
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Fim
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">
                    Observações
                  </th>
                </tr>
              </thead>

              <tbody>
                {reservas.map((reserva) => (
                  <tr
                    key={reserva.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-gray-800 font-medium">
                      {reserva.equipment?.name}
                      <div className="text-xs text-gray-500">
                        {reserva.equipment?.location}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {reserva.requester}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {formatarData(reserva.startDate)}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {formatarData(reserva.endDate)}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {reserva.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
