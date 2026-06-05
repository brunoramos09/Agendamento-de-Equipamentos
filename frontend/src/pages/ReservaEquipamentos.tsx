import { AppTemplate } from "./AppTemplate";

const equipamentosTheme = {
  background: "#f3f7f4",
  surface: "#ffffff",
  surfaceAlt: "#f8fbf8",
  border: "#d6e5d8",
  text: "#10231a",
  muted: "#617066",
  primary: "#1f6f43",
  primaryStrong: "#14532d",
  accent: "#38a169",
};

export function ReservaEquipamentos() {
  return (
    <AppTemplate
      appName="Sistema de Reserva de Equipamentos"
      appSubtitle="Reserva e gerenciamento de equipamentos"
      appDescription="Interface para consultar equipamentos disponíveis, realizar reservas e acompanhar solicitações."
      brandLabel="Reserva de Equipamentos"
      backLinkLabel="Voltar ao portal"
      backLinkHref="/home"
      primaryAction={{ label: "Nova reserva", href: "#nova-reserva" }}
      secondaryAction={{ label: "Ver equipamentos", href: "#equipamentos" }}
      featuredTitle="Fluxo principal de reserva"
      featuredDescription="Selecione um equipamento disponível, escolha o período de uso e acompanhe o status da solicitação."
      featuredBullets={[
        "Usuários padrão podem reservar equipamentos e acompanhar suas próprias reservas.",
        "Administradores podem cadastrar, editar e remover equipamentos.",
        "Relatórios permitem acompanhar reservas e uso dos equipamentos.",
      ]}
      recentTitle="Resumo operacional"
      recentItems={[
        {
          title: "Reservas ativas",
          description:
            "Equipamentos atualmente reservados ou aguardando retirada.",
          meta: "Hoje",
          status: "Em andamento",
        },
        {
          title: "Equipamentos disponíveis",
          description:
            "Lista resumida dos equipamentos liberados para novas reservas.",
          meta: "Atualizado",
          status: "Disponível",
        },
        {
          title: "Solicitações pendentes",
          description:
            "Reservas aguardando confirmação ou análise do administrador.",
          meta: "Prioridade",
          status: "Pendente",
        },
      ]}
      theme={equipamentosTheme}
    />
  );
}

export default ReservaEquipamentos;
