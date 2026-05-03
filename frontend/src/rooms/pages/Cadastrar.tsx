import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { criarSala } from "../service";

export default function CadastrarSala() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState<number | "">("");
  const [campus, setCampus] = useState("");

  async function salvar() {
    if (!name.trim() || !building.trim() || !campus.trim() || floor === "") {
      alert("Preencha todos os campos");
      return;
    }

    await criarSala({
      name,
      building,
      floor,
      campus,
    });

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

          <h1 className="text-2xl font-bold text-gray-900 mt-2">Nova sala</h1>

          <p className="text-sm text-gray-500">
            Preencha as informações da sala
          </p>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nome da sala
              </label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Prédio
              </label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Andar</label>
              <input
                type="number"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={floor}
                onChange={(e) =>
                  setFloor(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Campus
              </label>
              <input
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4">
            <button
              onClick={() => navigate("/salas")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              onClick={salvar}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Salvar sala
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
