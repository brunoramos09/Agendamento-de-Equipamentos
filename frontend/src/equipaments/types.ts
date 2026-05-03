export type Room = {
  id: number;
  name: string;
  building: string;
  floor: number;
  campus: string;
};

export type Equipment = {
  id: number;
  name: string;
  description?: string;
  notes?: string;
  roomId: number;
  room?: Room;
};

export type CreateEquipmentData = {
  name: string;
  description?: string;
  notes?: string;
  roomId: number;
};
