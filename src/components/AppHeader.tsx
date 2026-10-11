import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Gavel, LockKeyhole, LogOut, Wallet } from "lucide-react";
import { actions, useStore, type Role } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useVisitorAccess } from "@/components/VisitorAccess";

const ROLES: { id: Role; label: string; to: "/usuario" | "/parceiro" | "/admin/dashboard" }[] = [
  { id: "usuario", label: "Usuário", to: "/usuario" },
  { id: "parceiro", label: "Parceiro", to: "/parceiro" },
  { id: "admin", label: "Admin", to: "/admin/dashboard" },
];
export function AppHeader() {
  const role = useStore(s => s.role);
  const wallet = useStore(s => s.wallet);
  const { signedIn, requestAccess, signOut } = useVisitorAccess();
  const navigate = useNavigate();
  return <header className="border-b bg-card">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-4 px-5 py-5 lg:px-8">
      <Link to="/" className="flex items-center gap-2.5 text-xl font-bold"><span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Gavel className="size-5" /></span>Thrill Bid<span className="text-primary">.</span></Link>
      <nav className="flex items-center gap-5 text-xs font-medium text-muted-foreground">
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Leilões</Link>
        <a href="/#agendados" className="hover:text-primary">Agendados</a>
        <Button asChild variant="ghost" className="h-auto p-0 text-xs text-muted-foreground"><Link to="/register" search={{ perfil: "parceiro" }}>Parceiros</Link></Button>
      </nav>
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        {signedIn ? <>
          <Button asChild variant="secondary" size="sm"><Link to="/usuario"><Wallet /> {wallet} lances</Link></Button>
          <select aria-label="Visão de demonstração" value={role} className="h-8 rounded-md border bg-card px-2 text-xs" onChange={e => { const r = ROLES.find(r => r.id === e.target.value); if (r) { actions.setRole(r.id); navigate({ to: r.to }); } }}>{ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
          <Button size="icon" variant="ghost" title="Voltar ao modo visitante" aria-label="Sair da demonstração" onClick={() => { signOut(); navigate({ to: "/" }); }}><LogOut /></Button>
        </> : <>
          <Button asChild variant="outline" className="h-10 px-3 text-xs"><Link to="/register" search={{ perfil: "parceiro" }}>Seja um Parceiro Comercial<ArrowUpRight /></Link></Button>
          <Button asChild className="h-10 px-4 text-xs"><Link to="/register" search={{ perfil: "usuario" }}>Cadastro de Usuário<ArrowUpRight /></Link></Button>
        </>}
      </div>
    </div>
    {!signedIn && <div className="flex items-center justify-center gap-2 bg-secondary px-4 py-2.5 text-xs text-primary"><LockKeyhole className="size-3.5" /><span>Cadastre-se para liberar o painel de lances</span><Button variant="link" onClick={() => requestAccess()} className="hidden h-auto p-0 text-xs underline sm:inline-flex">Criar minha conta<ArrowUpRight /></Button></div>}
  </header>;
}
