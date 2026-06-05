import type { CSSProperties, ReactNode } from "react";
import styles from "./AppTemplate.module.css";

type ThemePalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  primaryStrong: string;
  accent: string;
};

type NavigationItem = {
  label: string;
  href: string;
};

type MetricCard = {
  label: string;
  value: string;
  hint: string;
};

type ActionLink = {
  label: string;
  href: string;
};

type ListItem = {
  title: string;
  description: string;
  meta: string;
  status: string;
};

export type AppTemplateProps = {
  backLinkLabel?: string;
  backLinkHref?: string;
  appName?: string;
  appSubtitle?: string;
  appDescription?: string;
  brandLabel?: string;
  navigation?: NavigationItem[];
  metrics?: MetricCard[];
  primaryAction?: ActionLink;
  secondaryAction?: ActionLink;
  featuredTitle?: string;
  featuredDescription?: string;
  featuredBullets?: string[];
  recentTitle?: string;
  recentItems?: ListItem[];
  theme?: Partial<ThemePalette>;
  children?: ReactNode;
};

const defaultTheme: ThemePalette = {
  background: "#eef3f7",
  surface: "#ffffff",
  surfaceAlt: "#f8fbfd",
  border: "#dce4ea",
  text: "#10233d",
  muted: "#617084",
  primary: "#0f264a",
  primaryStrong: "#1d4ed8",
  accent: "#60a5fa",
};

const defaultNavigation: NavigationItem[] = [
  { label: "Visao geral", href: "#overview" },
  { label: "Operacoes", href: "#operations" },
  { label: "Historico", href: "#history" },
  { label: "Configuracoes", href: "#settings" },
];

const defaultMetrics: MetricCard[] = [
  { label: "Ativos principais", value: "128", hint: "Itens prontos para uso" },
  { label: "Pendencias", value: "14", hint: "Aguardando processamento" },
  { label: "Concluidos hoje", value: "36", hint: "Atualizados recentemente" },
  { label: "Alertas", value: "3", hint: "Exigem atencao" },
];

const defaultRecentItems: ListItem[] = [
  {
    title: "Fluxo de solicitacao padrao",
    description: "Bloco ideal para listar os ultimos registros, tarefas ou cards principais do app.",
    meta: "Atualizado ha 5 min",
    status: "Em andamento",
  },
  {
    title: "Itens de acompanhamento",
    description: "Aqui pode entrar uma tabela, um timeline ou uma area de resumo especifica da aplicacao.",
    meta: "Atualizado ha 22 min",
    status: "Estavel",
  },
  {
    title: "Configuracoes rapidas",
    description: "Use este espaco para atalhos, observacoes ou informacoes operacionais do app.",
    meta: "Atualizado ha 1 h",
    status: "Aguardando",
  },
];

export function AppTemplate(props: Readonly<AppTemplateProps>) {
  const {
  backLinkLabel = "Voltar ao menu do portal",
  backLinkHref = "/home",
  appName = "Nome do App",
  appSubtitle = "Modelo de interface padrao",
  appDescription = "Este template serve como base visual para as aplicacoes do portal, sem incluir login ou regras de autenticacao.",
  brandLabel = "Portal Integrador",
  navigation = defaultNavigation,
  metrics = defaultMetrics,
  primaryAction = { label: "Acao principal", href: "#primary-action" },
  secondaryAction = { label: "Acao secundaria", href: "#secondary-action" },
  featuredTitle = "Area destacada",
  featuredDescription = "Substitua este bloco pelo conteudo central do app. A estrutura ja suporta diferentes paletas, cards e secoes por aplicacao.",
  featuredBullets = [
    "Reaproveite a mesma estrutura entre apps.",
    "Troque apenas os dados e as cores por configuracao.",
    "Mantenha uma experiencia visual consistente no portal.",
  ],
  recentTitle = "Painel de informacoes",
  recentItems = defaultRecentItems,
  theme,
  children,
  } = props;

  const palette = { ...defaultTheme, ...theme };

  const cssVars = {
    "--app-background": palette.background,
    "--app-surface": palette.surface,
    "--app-surface-alt": palette.surfaceAlt,
    "--app-border": palette.border,
    "--app-text": palette.text,
    "--app-muted": palette.muted,
    "--app-primary": palette.primary,
    "--app-primary-strong": palette.primaryStrong,
    "--app-accent": palette.accent,
  } as CSSProperties;

  return (
    <main className={styles.shell} style={cssVars}>
      <aside className={styles.sidebar}>
        <div className={styles.backBar}>
          <a className={styles.backButton} href={backLinkHref}>
            {backLinkLabel}
          </a>
        </div>

        <div className={styles.brandBlock}>
          <span className={styles.brandKicker}>{brandLabel}</span>
          <strong>{appName}</strong>
          <p>{appSubtitle}</p>
        </div>

        <nav className={styles.navigation} aria-label="Navegacao do app">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} className={styles.navigationItem}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.sidebarNote}>
          <span className={styles.noteLabel}>Padrao base</span>
          <p>
            Este bloco lateral pode receber menus, filtros ou detalhes de contexto sem alterar a estrutura do template.
          </p>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.titleBlock}>
            <span className={styles.pageKicker}>{brandLabel}</span>
            <h1>{appName}</h1>
            <p>{appDescription}</p>
          </div>

          <div className={styles.actionGroup}>
            <a href={secondaryAction.href} className={`${styles.actionButton} ${styles.actionSecondary}`}>
              {secondaryAction.label}
            </a>
            <a href={primaryAction.href} className={`${styles.actionButton} ${styles.actionPrimary}`}>
              {primaryAction.label}
            </a>
          </div>
        </header>

        <section className={styles.metricsGrid} aria-label="Indicadores do app">
          {metrics.map((metric) => (
            <article key={metric.label} className={styles.metricCard}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <strong className={styles.metricValue}>{metric.value}</strong>
              <p>{metric.hint}</p>
            </article>
          ))}
        </section>

        <section className={styles.panelGrid}>
          <article className={`${styles.panel} ${styles.featuredPanel}`}>
            <header className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Bloco principal</span>
                <h2>{featuredTitle}</h2>
              </div>
            </header>

            <p className={styles.featuredText}>{featuredDescription}</p>

            <ul className={styles.bulletList}>
              {featuredBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>

          <article className={`${styles.panel} ${styles.recentPanel}`}>
            <header className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Resumo rapido</span>
                <h2>{recentTitle}</h2>
              </div>
            </header>

            <div className={styles.recentList}>
              {recentItems.map((item) => (
                <article key={item.title} className={styles.recentItem}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <div className={styles.recentMeta}>
                    <span>{item.meta}</span>
                    <strong>{item.status}</strong>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className={`${styles.panel} ${styles.placeholderPanel}`} id="overview">
            <header className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Conteudo expansivel</span>
                <h2>Espaco para novas secoes</h2>
              </div>
            </header>

            <p>
              Use este espaco para tabelas, formularios, tabs, graficos ou qualquer feature especifica de cada app.
            </p>

            {children}
          </article>
        </section>
      </section>
    </main>
  );
}

export default AppTemplate;