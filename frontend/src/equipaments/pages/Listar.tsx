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
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Equipamentos
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Consulte, edite ou remova os equipamentos cadastrados.
            </p>
          </div>

          <Link
            to="/equipamentos/cadastrar"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-center transition"
          >
            Novo equipamento
          </Link>
        </header>

        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-gray-500">
            Carregando equipamentos...
          </div>
        )}

        {!loading && equipamentos.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-gray-500">
            Nenhum equipamento cadastrado.
          </div>
        )}

        {!loading && equipamentos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {equipamentos.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.location}
                    </p>
                  </div>

                  <span className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-xs">
                    qtd. {item.quantity}
                  </span>
                </div>

                {item.description && (
                  <p className="text-gray-700 mt-4 text-sm">
                    {item.description}
                  </p>
                )}

                {item.notes && (
                  <p className="text-gray-500 mt-3 text-sm">
                    Obs: {item.notes}
                  </p>
                )}

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to={`/equipamentos/editar/${item.id}`}
                    className="flex-1 text-center border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition"
                  >
                    Editar
                  </Link>

                  <Link
                    to={`/equipamentos/excluir/${item.id}`}
                    className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    Excluir
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
