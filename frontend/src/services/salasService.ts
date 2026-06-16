import type Room from "../interfaces/sala";
import { API_URL } from "./api";

const API_URL_COMPLETE = `${API_URL}/rooms`;

export async function listarSalas(): Promise<Room[]> {
  const response = await fetch(API_URL_COMPLETE);

  if (!response.ok) {
    throw new Error("Erro ao listar salas.");
  }

  return response.json();
}

export async function buscarSalaPorId(id: number): Promise<Room> {
  const response = await fetch(`${API_URL_COMPLETE}/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar sala.");
  }

  return response.json();
}

export async function criarSala(
  sala: Omit<Room, "id" | "createdAt" | "updatedAt">,
): Promise<Room> {
  const response = await fetch(API_URL_COMPLETE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sala),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar sala.");
  }

  return response.json();
}

export async function atualizarSala(
  id: number,
  sala: Partial<Omit<Room, "id" | "createdAt" | "updatedAt">>,
): Promise<Room> {
  const response = await fetch(`${API_URL_COMPLETE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sala),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar sala.");
  }

  return response.json();
}

export async function excluirSala(id: number): Promise<void> {
  const response = await fetch(`${API_URL_COMPLETE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir sala.");
  }
}

export async function gerarRelatorioSala(id: number){
  const response = await fetch(`${API_URL_COMPLETE}/${id}/report`);

  if (!response.ok) {
    throw new Error("Erro ao gerar relatório");
  }

  return response.blob();
}
