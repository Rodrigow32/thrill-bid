import { createFileRoute } from "@tanstack/react-router";
import { UserDashboard } from "@/components/UserDashboard";

export const Route = createFileRoute("/usuario")({
  head: () => ({
    meta: [
      { title: "Meu painel — Thrill Bid" },
      { name: "description", content: "Saldos de lances gratuitos, comprados e por indicação, histórico e arremates no Thrill Bid." },
      { property: "og:title", content: "Meu painel — Thrill Bid" },
      { property: "og:description", content: "Acompanhe sua carteira, seus arremates e indique amigos no Thrill Bid." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UserDashboard,
});

