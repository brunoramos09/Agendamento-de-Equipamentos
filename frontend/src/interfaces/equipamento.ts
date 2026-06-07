export default interface Equipment {
  id: number;
  name: string;
  description: string | null;
  notes: string | null;
  roomId: number;
  createdAt: string;
  updatedAt: string;
}
