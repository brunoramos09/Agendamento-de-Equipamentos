import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { buscarSala, excluirSala } from "../service";
import type { Room } from "../types";

export default function ExcluirSala() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!id) return;

    buscarSala(id).then(setRoom);
  }, [id]);

  async function confirmarExclusao() {
    if (!id) return;

    await excluirSala(id);
    navigate("/salas");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <Link
            to="/salas"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Excluir sala
          </h1>

          <p className="text-sm text-gray-500">
            Confirme a exclusão da sala selecionada
          </p>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          {!room ? (
            <div className="text-gray-500">Carregando sala...</div>
          ) : (
            <>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  {room.name}
                </h2>

                <p className="text-sm text-gray-600 mt-2">
                  Prédio: {room.building}
                </p>

                <p className="text-sm text-gray-600">Andar: {room.floor}</p>

                <p className="text-sm text-gray-600">Campus: {room.campus}</p>
              </div>

              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="text-sm font-semibold text-red-800">Atenção</h3>
                <p className="text-sm text-red-700 mt-1">
                  Essa ação não pode ser desfeita. A sala será removida do
                  sistema.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4">
                <button
                  onClick={() => navigate("/salas")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  Cancelar
                </button>

                <button
                  onClick={confirmarExclusao}
                  className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                >
                  Excluir sala
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
