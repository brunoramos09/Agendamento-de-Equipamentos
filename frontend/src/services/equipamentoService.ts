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

export async function criarEquipamento(formData: FormData) {
  const response = await fetch("http://localhost:3000/equipments", {
    method: "POST",
    body: formData,
  });

  return response.json();
}

export async function buscarEquipamentoPorId(id: number) {
  const response = await fetch(`http://localhost:3000/equipments/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamento");
  }

  return response.json();
}

export async function atualizarEquipamento(id: number, formData: FormData) {
  const response = await fetch(`http://localhost:3000/equipments/${id}`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar equipamento");
  }

  return response.json();
}
