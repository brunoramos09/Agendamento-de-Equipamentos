import { AppTemplate } from "./AppTemplate";

const equipamentosTheme = {
  background: "#fcfbec",
  surface: "#ffffff",
  surfaceAlt: "#fffef4",
  border: "#e8e4a0",
  text: "#3e3a12",
  muted: "#757148",
  primary: "#bab51f",
  primaryStrong: "#8f8a18",
  accent: "#e0d84a",
};

export function ReservaEquipamentos() {
  return (
    <AppTemplate
      appDescription="Interface para consultar equipamentos disponíveis, realizar reservas e acompanhar solicitações."
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
