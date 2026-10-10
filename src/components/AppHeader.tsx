import { Link, useNavigate } from "@tanstack/react-router";
import { Gavel, Wallet } from "lucide-react";
import { actions, useStore, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

const ROLES: { id: Role; label: string; to: "/usuario" | "/parceiro" | "/admin" }[] = [
  { id: "usuario", label: "Usuário", to: "/usuario" },
  { id: "parceiro", label: "Parceiro", to: "/parceiro" },
  { id: "admin", label: "Admin", to: "/admin" },
];

export function AppHeader() {
  const role = useStore((s) => s.role);
  const wallet = useStore((s) => s.wallet);
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-urgent text-urgent-foreground"><Gavel className="h-4 w-4" /></span>
          centavo<span className="text-urgent">.</span>
        </Link>
        <nav className="ml-4 hidden gap-4 text-sm sm:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "font-semibold" }} className="text-muted-foreground">Vitrine</Link>
          {ROLES.filter((r) => r.id === role).map((r) => (
            <Link key={r.id} to={r.to} activeProps={{ className: "font-semibold text-foreground" }} className="text-muted-foreground">Meu painel</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {role === "usuario" && (
            <Link to="/usuario" className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold">
              <Wallet className="h-4 w-4" /> {wallet} lances
            </Link>
          )}
          <div className="flex rounded-full border bg-muted p-1 text-xs">
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => { actions.setRole(r.id); nav({ to: r.to }); }}
                className={cn("rounded-full px-3 py-1.5 font-medium transition", role === r.id ? "bg-foreground text-background" : "text-muted-foreground")}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
