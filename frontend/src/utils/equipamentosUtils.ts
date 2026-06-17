import { API_URL } from "../services/api";

export const ITENS_POR_PAGINA = 8;
export const filesUrl = API_URL.replace(/\/api$/, "");

export type FiltroStatus =
  | "TODOS"
  | "DISPONIVEL"
  | "MANUTENCAO"
  | "INATIVO"
  | "AGUARDANDO_REVISAO";

export const statusLabels: Record<string, string> = {
  DISPONIVEL: "DISPONÍVEL",
  MANUTENCAO: "MANUTENÇÃO",
  INATIVO: "INATIVO",
  AGUARDANDO_REVISAO: "AGUARDANDO REVISÃO",
};

export const filtroOptions: { value: FiltroStatus; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "DISPONIVEL", label: "Disponíveis" },
  { value: "MANUTENCAO", label: "Em manutenção" },
  { value: "INATIVO", label: "Inativos" },
  { value: "AGUARDANDO_REVISAO", label: "Aguardando Revisão" },
];

export function getStatusStyle(status: string) {
  if (status === "DISPONIVEL") return { bg: "#dcfce7", color: "#166534" };
  if (status === "MANUTENCAO") return { bg: "#fef3c7", color: "#92400e" };
  if (status === "AGUARDANDO_REVISAO")
    return { bg: "#c7e4fe", color: "#0e5492" };
  return { bg: "#fee2e2", color: "#991b1b" };
}
