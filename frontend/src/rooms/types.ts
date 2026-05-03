export type Room = {
  id: number;
  name: string;
  building: string;
  floor: number;
  campus: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateRoomData = {
  name: string;
  building: string;
  floor: number;
  campus: string;
};
