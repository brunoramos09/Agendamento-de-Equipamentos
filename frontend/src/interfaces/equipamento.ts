export type EquipmentStatus = "DISPONIVEL" | "MANUTENCAO" | "INATIVO" | "AGUARDANDO_REVISAO";

export interface Room {
  id: number;
  name: string;
  building: string;
  floor: number;
  campus: string;
  createdAt: string;
  updatedAt: string;
}

export default interface Equipment {
  id: number;

  name: string;

  serialNumber: string | null;

  photo: string | null;

  responsibleEmployee: string | null;

  observations: string | null;

  instructions: string | null;

  attachedDocuments: string[];

  subdivisions: number | null;

  status: EquipmentStatus;

  roomId: number;

  room?: Room;

  createdAt: string;

  updatedAt: string;
}
