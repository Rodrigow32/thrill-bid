import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { actions } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Acesso Administrativo — Thrill Bid" },
      { name: "description", content: "Login restrito da equipe de gestão da plataforma." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acesso Administrativo — Thrill Bid" },
      { property: "og:description", content: "Login restrito da equipe de gestão." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (actions.adminLogin(email, password)) {
      navigate({ to: "/admin/dashboard" });
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-slate-800 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-slate-800 text-white">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="mt-4 text-center text-xl font-bold text-slate-900">Acesso Administrativo</h1>
        <p className="mt-1 text-center text-xs text-slate-500">Área restrita à equipe de gestão do Thrill Bid.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email" className="text-slate-700">E-mail do Administrador</Label>
            <Input id="admin-email" type="email" required autoComplete="username" value={email}
              onChange={(e) => { setEmail(e.target.value); setError(false); }}
              placeholder="admin@thrillbid.com" className="border-slate-300" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-pass" className="text-slate-700">Senha</Label>
            <Input id="admin-pass" type="password" required autoComplete="current-password" value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="••••••••" className="border-slate-300" />
          </div>

          {error && (
            <p role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              <LockKeyhole className="size-3.5 shrink-0" />
              Acesso negado. Credenciais administrativas inválidas.
            </p>
          )}

          <Button type="submit" className="w-full bg-slate-800 text-white hover:bg-slate-700">Entrar no painel</Button>
        </form>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-400">
          Demonstração local: use admin@thrillbid.com / admin123. Nenhum dado é enviado a servidores.
        </p>
      </div>
    </div>
  );
}
