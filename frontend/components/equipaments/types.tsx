export type EquipamentoFormData = {
  name: string;
  serialNumber: string;
  responsibleEmployee: string;
  observations: string;
  instructions: string;
  roomId: number;
  status: "DISPONIVEL" | "MANUTENCAO" | "INATIVO";
  photo: File | null;
};
