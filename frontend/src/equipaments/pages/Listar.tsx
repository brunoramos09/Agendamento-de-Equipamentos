/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarEquipamentos } from "../service";
import type { Equipment } from "../types";

export default function ListaEquipamentos() {
  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      const data = await listarEquipamentos();
      setEquipamentos(data);
    } catch (err) {
      console.error("Erro ao carregar equipamentos:", err);
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
            <h1 className="text-2xl font-bold text-gray-900">Equipamentos</h1>
            <p className="text-sm text-gray-500">
              Lista de equipamentos cadastrados no sistema.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/salas"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
            >
              Salas
            </Link>

            <Link
              to="/reservas"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
            >
              Reservas
            </Link>

            <Link
              to="/equipamentos/cadastrar"
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
            >
              Novo equipamento
            </Link>
          </div>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading && (
            <div className="p-6 text-gray-500">Carregando equipamentos...</div>
          )}

          {!loading && equipamentos.length === 0 && (
            <div className="p-6 text-gray-500">
              Nenhum equipamento cadastrado.
            </div>
          )}

          {!loading && equipamentos.length > 0 && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">
                    Equipamento
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Sala</th>
                  <th className="text-left px-4 py-3 font-medium">Descrição</th>
                  <th className="text-right px-25 py-3 font-medium">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {equipamentos.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item.room ? (
                        <div className="flex flex-col">
                          <span>{item.room.name}</span>
                          <span className="text-xs text-gray-400">
                            {item.room.building}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">
                          Sala #{item.roomId}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="truncate" title={item.description || ""}>
                        {item.description || "-"}
                      </p>

                      {item.notes && (
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          Obs: {item.notes}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`http://localhost:3000/equipments/${item.id}/report`}
                          target="_blank"
                          className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
                        >
                          Relatório
                        </a>
                        <Link
                          to={`/equipamentos/editar/${item.id}`}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                        >
                          Editar
                        </Link>

                        <Link
                          to={`/equipamentos/excluir/${item.id}`}
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
