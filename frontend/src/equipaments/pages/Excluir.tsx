import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { buscarEquipamento, excluirEquipamento } from "../service";
import type { Equipment } from "../types";

export default function ExcluirEquipamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    if (!id) return;
    buscarEquipamento(id).then(setEquipment);
  }, [id]);

  async function confirmarExclusao() {
    if (!id) return;

    await excluirEquipamento(id);
    navigate("/equipamentos");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* HEADER */}
        <div className="mb-6">
          <Link
            to="/equipamentos"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar
          </Link>

          <h1 className="text-2xl font-semibold text-gray-800 mt-2">
            Excluir equipamento
          </h1>

          <p className="text-gray-500 text-sm">
            Essa ação não pode ser desfeita
          </p>
        </div>

        {!equipment ? (
          <div className="text-gray-500">Carregando...</div>
        ) : (
          <>
            {/* CARD INFO */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {equipment.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">{equipment.location}</p>

              <p className="text-sm text-gray-600 mt-2">
                Quantidade: {equipment.quantity}
              </p>
            </div>

            {/* AVISO */}
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
              Tem certeza que deseja excluir este equipamento?
            </div>

            {/* BOTÕES */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/equipamentos")}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 py-2.5 rounded-lg transition"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarExclusao}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition"
              >
                Excluir
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
