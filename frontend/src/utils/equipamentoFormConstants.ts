export type StatusOption = {
  value: "DISPONIVEL" | "MANUTENCAO" | "INATIVO";
  label: string;
};

export const allStatusOptions: StatusOption[] = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "MANUTENCAO", label: "Manutenção" },
  { value: "INATIVO", label: "Inativo" },
];

export const editStatusOptions: StatusOption[] = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "INATIVO", label: "Inativo" },
];
