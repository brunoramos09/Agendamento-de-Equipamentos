import type { CreateRoomData, Room } from "./types";

const API_URL = "http://localhost:3000/rooms";

export async function listarSalas(): Promise<Room[]> {
  const res = await fetch(API_URL);
  return res.json();
}

export async function buscarSala(id: string): Promise<Room> {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function criarSala(data: CreateRoomData) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function editarSala(id: string, data: Partial<CreateRoomData>) {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function excluirSala(id: string) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
