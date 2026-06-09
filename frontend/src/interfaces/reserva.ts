import type Equipment from "./equipamento";

export interface ReservationEquipment {
  id: number;
  equipmentId: number;
  subdivisionsQuantity?: number;

  equipment: Equipment;
}

export default interface Reservation {
  id: number;

  user: string;
  startDate: string;
  endDate: string;
  returnedAt?: string | null;
  observations?: string | null;

  createdAt: string;
  updatedAt: string;

  equipments: ReservationEquipment[];
}
