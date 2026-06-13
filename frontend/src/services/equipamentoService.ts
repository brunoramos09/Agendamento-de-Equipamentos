import { API_URL } from "./api";

export async function listarEquipamentos() {
  const response = await fetch(`${API_URL}/equipments`);

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamentos");
  }

  return await response.json();
}

export async function excluirEquipamento(id: number) {
  const response = await fetch(`${API_URL}/equipments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir equipamento");
  }
}

export async function criarEquipamento(formData: FormData) {
  const response = await fetch(`${API_URL}/equipments`, {
    method: "POST",
    body: formData,
  });

  return response.json();
}

export async function buscarEquipamentoPorId(id: number) {
  const response = await fetch(`${API_URL}/equipments/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamento");
  }

  return response.json();
}

export async function atualizarEquipamento(id: number, formData: FormData) {
  const response = await fetch(`${API_URL}/equipments/${id}`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar equipamento");
  }

  return response.json();
}

export async function gerarRelatorioEquipamento(id: number) {
  const response = await fetch(`${API_URL}/equipments/${id}/report`);

  if (!response.ok) {
    throw new Error("Erro ao gerar relatório");
  }

  return response.blob();
}
