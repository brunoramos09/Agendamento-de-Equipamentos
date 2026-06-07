export async function listarEquipamentos() {
  const response = await fetch("http://localhost:3000/equipments");

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamentos");
  }

  return await response.json();
}
