/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarSalas } from "../service";
import type { Room } from "../types";

export default function ListarSalas() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      const data = await listarSalas();
      setRooms(data);
    } catch (err) {
      console.error("Erro ao carregar salas:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Salas</h1>
            <p className="text-sm text-gray-500">
              Consulte, edite ou remova as salas cadastradas.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/equipamentos"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
            >
              Ver equipamentos
            </Link>

            <Link
              to="/salas/cadastrar"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Nova sala
            </Link>
          </div>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading && (
            <div className="p-6 text-gray-500">Carregando salas...</div>
          )}

          {!loading && rooms.length === 0 && (
            <div className="p-6 text-gray-500">Nenhuma sala cadastrada.</div>
          )}

          {!loading && rooms.length > 0 && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Sala</th>
                  <th className="text-left px-4 py-3 font-medium">Prédio</th>
                  <th className="text-left px-4 py-3 font-medium">Andar</th>
                  <th className="text-left px-4 py-3 font-medium">Campus</th>
                  <th className="text-right px-16 py-3 font-medium">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {room.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">{room.building}</td>

                    <td className="px-4 py-3">
                      <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                        Andar {room.floor}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                        {room.campus}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/salas/editar/${room.id}`}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                        >
                          Editar
                        </Link>

                        <Link
                          to={`/salas/excluir/${room.id}`}
                          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Excluir
                        </Link>
                      </div>
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
