/* eslint-disable @typescript-eslint/no-explicit-any */

const API_URL = "http://localhost:3000/reservations";

export async function listarReservas() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erro ao listar reservas.");
  }

  return response.json();
}

export async function buscarReservaPorId(id: number) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar reserva.");
  }

  return response.json();
}

export async function criarReserva(payload: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);

    throw new Error(erro?.message || "Erro ao criar reserva.");
  }

  return response.json();
}

export async function atualizarReserva(id: number, payload: any) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);

    throw new Error(erro?.message || "Erro ao atualizar reserva.");
  }

  return response.json();
}

export async function devolverReserva(id: number) {
  const response = await fetch(`${API_URL}/${id}/return`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);

    throw new Error(erro?.message || "Erro ao devolver reserva.");
  }

  return response.json();
}

export async function excluirReserva(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir reserva.");
  }
}
