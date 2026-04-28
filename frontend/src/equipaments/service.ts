import type { Equipment } from "./types";

const API_URL = "http://localhost:3000/equipment";

export async function listarEquipamentos(): Promise<Equipment[]> {
  const res = await fetch(API_URL);
  return res.json();
}

export async function buscarEquipamento(id: string): Promise<Equipment> {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function criarEquipamento(data: Omit<Equipment, "id">) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function editarEquipamento(
  id: string,
  data: Partial<Omit<Equipment, "id">>,
) {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function excluirEquipamento(id: string) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
