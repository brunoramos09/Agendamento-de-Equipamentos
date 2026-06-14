export default interface Room {
  id: number;
  name: string;
  building: string;
  floor: number;
  campus: string;
  createdAt: string;
  updatedAt: string;

  _count?: {
    equipments: number;
  };
}
