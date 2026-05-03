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
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
            <p className="text-sm text-gray-500">
              Consulte todas as reservas de equipamentos cadastradas.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/equipamentos"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
            >
              Equipamentos
            </Link>

            <Link
              to="/reservas/cadastrar"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Nova reserva
            </Link>
          </div>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading && (
            <div className="p-6 text-gray-500">Carregando reservas...</div>
          )}

          {!loading && reservas.length === 0 && (
            <div className="p-6 text-gray-500">Nenhuma reserva cadastrada.</div>
          )}

          {!loading && reservas.length > 0 && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">
                    Equipamento
                  </th>
                  <th className="text-left px-4 py-3 font-medium">
                    Responsável
                  </th>
                  <th className="text-left px-4 py-3 font-medium">
                    Período - Começo
                  </th>
                  <th className="text-left px-4 py-3 font-medium">
                    Período - Fim
                  </th>
                  <th className="text-left px-4 py-3 font-medium">
                    Observações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {reservas.map((reserva) => (
                  <tr key={reserva.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {reserva.equipment?.name || "Equipamento removido"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {reserva.requester}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-gray-700">
                        {formatarData(reserva.startDate)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-gray-700">
                        {formatarData(reserva.endDate)}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="truncate" title={reserva.notes || ""}>
                        {reserva.notes || "-"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
