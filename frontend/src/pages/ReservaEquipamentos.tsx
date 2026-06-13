import { useEffect, useState } from "react";
import { AppTemplate } from "./AppTemplate";
import equipamentosTheme from "../styles/theme/equipamentosTheme";
import { listarEquipamentos } from "../services/equipamentoService";
import { listarReservas } from "../services/reservaService";
import type Equipment from "../interfaces/equipamento";
import type Reservation from "../interfaces/reserva";

type MetricCard = {
  label: string;
  value: string;
  hint: string;
};

type RecentItem = {
  title: string;
  description: string;
  meta: string;
  status: string;
};

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function diasAtraso(endDate: string) {
  const diff = Date.now() - new Date(endDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const defaultMetrics: MetricCard[] = [
  {
    label: "Equipamentos totais",
    value: "—",
    hint: "Total de equipamentos cadastrados",
  },
  {
    label: "Equipamentos disponíveis",
    value: "—",
    hint: "Com status disponível",
  },
  {
    label: "Reservas ativas",
    value: "—",
    hint: "Em andamento no momento atual",
  },
];

const defaultRecentItems: RecentItem[] = [
  {
    title: "Reservas ativas",
    description: "Carregando...",
    meta: "—",
    status: "—",
  },
  {
    title: "Equipamentos disponíveis",
    description: "Carregando...",
    meta: "—",
    status: "—",
  },
  {
    title: "Reservas atrasadas",
    description: "Carregando...",
    meta: "—",
    status: "—",
  },
];

export function ReservaEquipamentos() {
  const [metrics, setMetrics] = useState<MetricCard[]>(defaultMetrics);
  const [recentItems, setRecentItems] =
    useState<RecentItem[]>(defaultRecentItems);

  useEffect(() => {
    async function fetchDados() {
      try {
        const [equipamentos, reservas]: [Equipment[], Reservation[]] =
          await Promise.all([listarEquipamentos(), listarReservas()]);

        const now = new Date();

        const total = equipamentos.length;
        const disponiveis = equipamentos.filter(
          (e) => e.status === "DISPONIVEL",
        );
        const ativas = reservas.filter(
          (r) => !r.returnedAt && new Date(r.endDate) >= now,
        );

        setMetrics([
          {
            label: "Equipamentos totais",
            value: String(total),
            hint: "Total de equipamentos cadastrados",
          },
          {
            label: "Equipamentos disponíveis",
            value: String(disponiveis.length),
            hint: "Com status disponível",
          },
          {
            label: "Reservas ativas",
            value: String(ativas.length),
            hint: "Em andamento no momento atual",
          },
        ]);

        const proximasVencer = [...ativas]
          .sort(
            (a, b) =>
              new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
          )
          .slice(0, 3);

        const descricaoAtivas =
          proximasVencer.length > 0
            ? proximasVencer
                .map((r) => {
                  const nomes = r.equipments
                    ?.map((item) => item.equipment?.name)
                    .filter(Boolean)
                    .join(", ");
                  return `${r.user}${nomes ? ` · ${nomes}` : ""}`;
                })
                .join(" / ")
            : "Nenhuma reserva ativa no momento.";

        const metaAtivas =
          proximasVencer.length > 0
            ? `Vence em ${formatarData(proximasVencer[0].endDate)}`
            : "—";

        const primeirosDisponiveis = [...disponiveis]
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 4);

        const descricaoDisponiveis =
          primeirosDisponiveis.length > 0
            ? primeirosDisponiveis
                .map((e) =>
                  e.room?.name ? `${e.name} (${e.room.name})` : e.name,
                )
                .join(", ")
            : "Nenhum equipamento disponível no momento.";

        const atrasadas = reservas
          .filter((r) => !r.returnedAt && new Date(r.endDate) < now)
          .sort(
            (a, b) =>
              new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
          )
          .slice(0, 3);

        const descricaoAtrasadas =
          atrasadas.length > 0
            ? atrasadas
                .map((r) => {
                  const dias = diasAtraso(r.endDate);
                  return `${r.user} · ${dias} dia${dias !== 1 ? "s" : ""} em atraso`;
                })
                .join(" / ")
            : "Nenhuma reserva em atraso.";

        const metaAtrasadas =
          atrasadas.length > 0
            ? `${atrasadas.length} reserva${atrasadas.length !== 1 ? "s" : ""} em atraso`
            : "Em dia";

        setRecentItems([
          {
            title: "Reservas ativas",
            description: descricaoAtivas,
            meta: metaAtivas,
            status: `${ativas.length} ativa${ativas.length !== 1 ? "s" : ""}`,
          },
          {
            title: "Equipamentos disponíveis",
            description: descricaoDisponiveis,
            meta: `${disponiveis.length} disponíve${disponiveis.length !== 1 ? "is" : "l"}`,
            status: "Disponível",
          },
          {
            title: "Reservas atrasadas",
            description: descricaoAtrasadas,
            meta: metaAtrasadas,
            status: atrasadas.length > 0 ? "Atenção" : "Em dia",
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    }

    fetchDados();
  }, []);

  return (
    <AppTemplate
      theme={equipamentosTheme}
      metrics={metrics}
      appDescription="Visão geral com informações sobre equipamentos e reservas.  "
      primaryAction={{
        label: "Nova reserva",
        href: "/reserva-equipamentos/reservas/criar",
      }}
      secondaryAction={null}
      featuredTitle="Fluxo principal de reserva"
      featuredDescription="Selecione um equipamento disponível, escolha o período de uso e acompanhe o status da solicitação."
      featuredBullets={[
        "Usuários padrão podem reservar equipamentos e acompanhar suas próprias reservas.",
        "Administradores podem cadastrar, editar e remover equipamentos.",
        "Relatórios permitem acompanhar reservas e uso dos equipamentos.",
      ]}
      recentTitle="Resumo operacional"
      recentItems={recentItems}
    />
  );
}

export default ReservaEquipamentos;
