export async function listarEquipamentos() {
  const response = await fetch("http://localhost:3000/equipments");

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamentos");
  }

  return await response.json();
}

export async function excluirEquipamento(id: number) {
  const response = await fetch(`http://localhost:3000/equipments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir equipamento");
  }
}

export async function criarEquipamento(data: unknown) {
  const response = await fetch("http://localhost:3000/equipments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar equipamento");
  }

  return response.json();
}
