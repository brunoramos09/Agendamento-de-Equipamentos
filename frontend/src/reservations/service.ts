import type { Reservation, ReservationForm } from "./types";

const API_URL = "http://localhost:3000/reservations";

export async function listarReservas(): Promise<Reservation[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Erro ao listar reservas");
  }

  return res.json();
}

export async function criarReserva(data: ReservationForm) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar reserva");
  }

  return res.json();
}
