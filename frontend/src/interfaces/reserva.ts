import type Equipment from "./equipamento";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "NORMAL" | "ADMIN";
}

export interface ReservationEquipment {
  id: number;
  equipmentId: number;
  subdivisionsQuantity?: number;

  equipment: Equipment;
}

export default interface Reservation {
  id: number;

  userId: number;
  user: User;

  startDate: string;
  endDate: string;
  returnedAt?: string | null;
  observations?: string | null;
  hadIssue: boolean;
  returnObservations?: string | null;

  createdAt: string;
  updatedAt: string;

  equipments: ReservationEquipment[];

  status: "ATIVA" | "PENDENTE_APROVACAO" | "REJEITADA";
}
