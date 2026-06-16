import { API_URL } from "./api";
import type User from "../interfaces/user";

export async function listarUsuarios(): Promise<User[]> {
  const response = await fetch(`${API_URL}/user`);

  if (!response.ok) {
    throw new Error("Erro ao buscar usuários");
  }

  return response.json();
}
