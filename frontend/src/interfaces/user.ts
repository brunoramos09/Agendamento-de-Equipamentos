export default interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "NORMAL";
}
