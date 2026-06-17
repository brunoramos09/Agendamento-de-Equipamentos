import type Reservation from "../interfaces/reserva";

export const ITENS_POR_PAGINA = 8;

export type FiltroStatus = "TODAS" | "ATIVA" | "ATRASADA" | "DEVOLVIDA" | "AGENDADA" | "PENDENTE";

export type ReservaStatus = {
  label: "ATIVA" | "ATRASADA" | "DEVOLVIDA" | "AGENDADA" | "PENDENTE";
  bg: string;
  color: string;
  key: Exclude<FiltroStatus, "TODAS">;
};

export const filtroOptions: {
  value: FiltroStatus;
  label: string;
  bg: string;
  color: string;
}[] = [
  { value: "TODAS", label: "Todas", bg: "#111827", color: "#fff" },
  { value: "ATIVA", label: "Ativas", bg: "#dcfce7", color: "#166534" },
  { value: "ATRASADA", label: "Atrasadas", bg: "#fee2e2", color: "#991b1b" },
  { value: "DEVOLVIDA", label: "Devolvidas", bg: "#dbeafe", color: "#1d4ed8" },
  { value: "AGENDADA", label: "Agendadas", bg: "#f0dbfe", color: "#871dd8" },
  { value: "PENDENTE", label: "Pendentes", bg: "#feecdb", color: "#d8b61d" },

];

export function formatarData(data?: string | null) {
  if (!data) return "-";

  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusReserva(reserva: Reservation): ReservaStatus {
  if (reserva.returnedAt) {
    return {
      label: "DEVOLVIDA",
      bg: "#dbeafe",
      color: "#1d4ed8",
      key: "DEVOLVIDA",
    };
  }

  if (reserva.status === "PENDENTE_APROVACAO") {
    return {
      label: "PENDENTE",
      bg: "#feecdb",
      color: "#d8b61d",
      key: "PENDENTE",
    };
  }

  if (new Date(reserva.endDate) < new Date()) {
    return {
      label: "ATRASADA",
      bg: "#fee2e2",
      color: "#991b1b",
      key: "ATRASADA",
    };
  }

  if (new Date(reserva.startDate) > new Date()) {
    return {
      label: "AGENDADA",
      bg: "#f0dbfe",
      color: "#871dd8",
      key: "AGENDADA",
    };
  }

  return {
    label: "ATIVA",
    bg: "#dcfce7",
    color: "#166534",
    key: "ATIVA",
  };
}


export function filtrarReservas(
  reservas: Reservation[],
  filtroStatus: FiltroStatus,
  pesquisa: string,
) {
  const termo = pesquisa.trim().toLowerCase();

  return reservas.filter((reserva) => {
    const passaFiltroStatus =
      filtroStatus === "TODAS" ||
      getStatusReserva(reserva).key === filtroStatus;

    if (!termo) return passaFiltroStatus;

    const passaPesquisa = [
      reserva.user?.name,
      reserva.observations,
      reserva.id?.toString(),
      reserva.equipments
        ?.map((item) => item.equipment?.name)
        .filter(Boolean)
        .join(" "),
    ]
      .filter(Boolean)
      .some((valor) => valor!.toString().toLowerCase().includes(termo));

    return passaFiltroStatus && passaPesquisa;
  });
}

export function paginarReservas(
  reservas: Reservation[],
  pagina: number,
  itensPorPagina = ITENS_POR_PAGINA,
) {
  const inicio = (pagina - 1) * itensPorPagina;

  return {
    inicio,
    totalPaginas: Math.ceil(reservas.length / itensPorPagina),
    reservasPagina: reservas.slice(inicio, inicio + itensPorPagina),
  };
}
