import type { Equipment } from "../equipaments/types";

export type Reservation = {
  id: number;
  equipmentId: number;
  requester: string;
  startDate: string;
  endDate: string;
  notes?: string;
  equipment: Equipment;
};

export type ReservationForm = {
  equipmentId: number;
  requester: string;
  startDate: string;
  endDate: string;
  notes?: string;
};
