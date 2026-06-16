/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE = (import.meta as any).env?.VITE_BASE_PATH?.replace(/\/$/, "") || "";

export const API_URL = import.meta.env.DEV
  ? "http://localhost:3000/api"
  : `${BASE}/api`;

export function equipmentFileUrl(fileName: string) {
  return `${API_URL}/equipments/file/${encodeURIComponent(fileName)}`;
}
