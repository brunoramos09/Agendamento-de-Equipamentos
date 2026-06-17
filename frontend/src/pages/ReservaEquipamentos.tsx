import { useEffect, useState } from "react";
import { AppTemplate } from "./AppTemplate";
import equipamentosTheme from "../styles/theme/equipamentosTheme";
import { listarEquipamentos } from "../services/equipamentoService";
import { listarReservas } from "../services/reservaService";
import type Equipment from "../interfaces/equipamento";
import type Reservation from "../interfaces/reserva";
import { usePageTitle } from "../hooks/usePageTitle";
import { isAdmin, getUsuario } from "../utils/authRole";

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

function calcularTempoAtraso(endDate: string) {
  const diff = Date.now() - new Date(endDate).getTime();

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const partes = [];
  if (dias > 0) partes.push(`${dias}d`);
  if (horas > 0) partes.push(`${horas}h`);
  if (minutos > 0) partes.push(`${minutos}m`);

  return partes.length > 0 ? partes.join(" ") : "Poucos minutos";
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
    title: "Reservas atrasadas",
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
    title: "Equipamentos em manutenção",
    description: "Carregando...",
    meta: "-",
    status: "-",
  },
  {
    title: "Equipamentos aguardando revisão",
    description: "Carregando...",
    meta: "—",
    status: "—",
  },
];

export function ReservaEquipamentos() {
  const [metrics, setMetrics] = useState<MetricCard[]>(defaultMetrics);
  const [recentItems, setRecentItems] =
    useState<RecentItem[]>(defaultRecentItems);

  const admin = isAdmin();
  const usuarioLogado = getUsuario();

  usePageTitle("Visão Geral");

  useEffect(() => {
    async function fetchDados() {
      try {
        const [equipamentos, reservas]: [Equipment[], Reservation[]] =
          await Promise.all([listarEquipamentos(), listarReservas()]);

        const now = new Date();

        const reservasFiltradas = admin
          ? reservas
          : reservas.filter((r) => r.user.name === usuarioLogado?.name);

        const total = equipamentos.length;

        const disponiveis = equipamentos.filter(
          (e) => e.status === "DISPONIVEL",
        );

        const manutencao = equipamentos.filter(
          (e) => e.status === "MANUTENCAO",
        );

        const revisao = equipamentos.filter(
          (e) => e.status === "AGUARDANDO_REVISAO",
        );

        const ativas = reservasFiltradas.filter(
          (r) =>
            !r.returnedAt && r.status === "ATIVA" && new Date(r.endDate) >= now,
        );

        const pendentes = reservasFiltradas.filter(
          (r) => r.status === "PENDENTE_APROVACAO",
        );

        const atrasadas = reservasFiltradas
          .filter(
            (r) =>
              !r.returnedAt &&
              r.status === "ATIVA" &&
              new Date(r.endDate) < now,
          )
          .sort(
            (a, b) =>
              new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
          )
          .slice(0, 3);

        // Métricas condicionais
        const metricasExibidas: MetricCard[] = [];

        if (admin) {
          metricasExibidas.push(
            {
              label: "Equipamentos totais",
              value: String(total),
              hint: "Cadastrados no sistema",
            },
            {
              label: "Disponíveis",
              value: String(disponiveis.length),
              hint: "Prontos para reserva",
            },
            {
              label: "Reservas ativas",
              value: String(ativas.length),
              hint: "Em andamento",
            },
            {
              label: "Reservas Pendentes",
              value: String(pendentes.length),
              hint: "Aguardando aprovação",
            },
            {
              label: "Manutenção",
              value: String(manutencao.length),
              hint: "Equipamentos indisponíveis",
            },
            {
              label: "Revisão",
              value: String(revisao.length),
              hint: "Equipamentos aguardando análise",
            },
          );
        } else {
          metricasExibidas.push(
            {
              label: "Minhas reservas ativas",
              value: String(ativas.length),
              hint: "Em andamento",
            },
            {
              label: "Minhas reservas pendentes",
              value: String(pendentes.length),
              hint: "Aguardando aprovação",
            },
            {
              label: "Minhas reservas atrasadas",
              value: String(atrasadas.length),
              hint: "Aguardando devolução",
            },
            {
              label: "Equipamentos disponíveis",
              value: String(disponiveis.length),
              hint: "Prontos para reserva",
            },
          );
        }

        setMetrics(metricasExibidas);

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

                  return `${admin ? r.user.name : "Minha reserva"}${nomes ? ` · ${nomes}` : ""}`;
                })
                .join(" / ")
            : "Nenhuma reserva ativa no momento.";

        const descricaoPendentes =
          pendentes.length > 0
            ? pendentes
                .slice(0, 3)
                .map((r) => {
                  const nomes = r.equipments
                    ?.map((item) => item.equipment?.name)
                    .filter(Boolean)
                    .join(", ");

                  return `${admin ? r.user.name : "Minha solicitação"}${
                    nomes ? ` · ${nomes}` : ""
                  }`;
                })
                .join(" / ")
            : "Nenhuma reserva pendente.";

        const metaAtivas =
          proximasVencer.length > 0
            ? `Vence em ${formatarData(proximasVencer[0].endDate)}`
            : "—";

        const primeirosDisponiveis = [...disponiveis]
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 4);

        const primeirosManutencao = [...manutencao]
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 4);

        const primeirosRevisao = [...revisao]
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

        const descricaoManutencao =
          primeirosManutencao.length > 0
            ? primeirosManutencao
                .map((e) =>
                  e.room?.name ? `${e.name} (${e.room.name})` : e.name,
                )
                .join(", ")
            : "Nenhum equipamento em manutenção no momento.";

        const descricaoRevisao =
          primeirosRevisao.length > 0
            ? primeirosRevisao
                .map((e) =>
                  e.room?.name ? `${e.name} (${e.room.name})` : e.name,
                )
                .join(", ")
            : "Nenhum equipamento aguardando revisão no momento.";

        const descricaoAtrasadas =
          atrasadas.length > 0
            ? atrasadas
                .map((r) => {
                  const tempo = calcularTempoAtraso(r.endDate);

                  return `${admin ? r.user.name : "Minha reserva"} · ${tempo} em atraso`;
                })
                .join(" / ")
            : "Nenhuma reserva em atraso.";

        const metaAtrasadas =
          atrasadas.length > 0
            ? `${atrasadas.length} reserva${
                atrasadas.length !== 1 ? "s" : ""
              } em atraso`
            : "Em dia";

        const rankingEquipamentos = equipamentos
          .map((equipamento) => ({
            nome: equipamento.name,
            totalReservas: reservas.filter((reserva) =>
              reserva.equipments.some(
                (item) => item.equipmentId === equipamento.id,
              ),
            ).length,
          }))
          .filter((item) => item.totalReservas > 0)
          .sort((a, b) => b.totalReservas - a.totalReservas)
          .slice(0, 5);

        const descricaoRanking =
          rankingEquipamentos.length > 0
            ? rankingEquipamentos
                .map((item) => `${item.nome} (${item.totalReservas})`)
                .join(", ")
            : "Ainda não há equipamentos com reservas.";

        const itensExibidos: RecentItem[] = [
          {
            title: admin ? "Reservas ativas" : "Minhas reservas ativas",
            description: descricaoAtivas,
            meta: metaAtivas,
            status: `${ativas.length} ativa${ativas.length !== 1 ? "s" : ""}`,
          },
          {
            title: admin ? "Reservas pendentes" : "Minhas reservas pendentes",
            description: descricaoPendentes,
            meta: `${pendentes.length} pendente${pendentes.length !== 1 ? "s" : ""}`,
            status: "Aguardando aprovação",
          },
          {
            title: admin ? "Reservas atrasadas" : "Minhas reservas atrasadas",
            description: descricaoAtrasadas,
            meta: metaAtrasadas,
            status: atrasadas.length > 0 ? "Atenção" : "Em dia",
          },
          {
            title: "Equipamentos disponíveis",
            description: descricaoDisponiveis,
            meta: `${disponiveis.length} equipamento${
              disponiveis.length !== 1 ? "s" : ""
            }`,
            status: "Disponível",
          },
        ];

        if (admin) {
          itensExibidos.push({
            title: "Equipamentos mais reservados",
            description: descricaoRanking,
            meta: "Top 5 por quantidade de reservas",
            status: "Uso frequente",
          });
        }

        if (admin) {
          itensExibidos.push({
            title: "Equipamentos em manutenção",
            description: descricaoManutencao,
            meta: `${manutencao.length} equipamento${
              manutencao.length !== 1 ? "s" : ""
            }`,
            status: "Manutenção",
          });
        }

        if (admin) {
          itensExibidos.push({
            title: "Equipamentos aguardando revisão",
            description: descricaoRevisao,
            meta: `${revisao.length} equipamento${
              revisao.length !== 1 ? "s" : ""
            }`,
            status: "Aguardando Revisão",
          });
        }

        setRecentItems(itensExibidos);
      } catch (error) {
        console.error(error);
      }
    }

    fetchDados();
  }, [admin, usuarioLogado]);

  return (
    <AppTemplate
      theme={equipamentosTheme}
      metrics={metrics}
      appDescription="Visão geral com informações sobre equipamentos e reservas."
      primaryAction={{
        label: "Nova Reserva",
        href: "/reserva-equipamentos/reservas/criar",
      }}
      secondaryAction={{
        label: "Sair",
        href: "/reserva-equipamentos/login",
      }}
      recentTitle="Resumo operacional"
      recentItems={recentItems}
    />
  );
}

export default ReservaEquipamentos;
