import { API_URL } from "./api";

const API_URL_COMPLETE = `${API_URL}/equipments`;

export async function listarEquipamentos() {
  const response = await fetch(API_URL_COMPLETE);

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamentos");
  }

  return await response.json();
}

export async function excluirEquipamento(id: number) {
  const response = await fetch(`${API_URL_COMPLETE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir equipamento");
  }
}

export async function criarEquipamento(formData: FormData) {
  const response = await fetch(API_URL_COMPLETE, {
    method: "POST",
    body: formData,
  });

  return response.json();
}

export async function buscarEquipamentoPorId(id: number) {
  const response = await fetch(`${API_URL_COMPLETE}/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamento");
  }

  return response.json();
}

export async function atualizarEquipamento(id: number, formData: FormData) {
  const response = await fetch(`${API_URL_COMPLETE}/${id}`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar equipamento");
  }

  return response.json();
}

export async function gerarRelatorioEquipamento(id: number) {
  const response = await fetch(`${API_URL_COMPLETE}/${id}/report`);

  if (!response.ok) {
    throw new Error("Erro ao gerar relatório");
  }

  return response.blob();
}
