function App() {
  const equipamentos = [{ id: 1, name: "Projetor", description: "Sala 101" }];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Sistema de Equipamentos
        </h1>

        <h2 className="text-lg font-semibold mb-4">Equipamentos cadastrados</h2>

        {equipamentos.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nenhum equipamento cadastrado
          </p>
        ) : (
          <ul className="space-y-3">
            {equipamentos.map((item) => (
              <li
                key={item.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition"
              >
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.description ?? "Sem descrição"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
