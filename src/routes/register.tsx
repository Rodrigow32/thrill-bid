import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Crown, Gift, Store, UserRound } from "lucide-react";
import { buyerSchema, partnerSchema, type BuyerRegistration, type PartnerRegistration } from "@/lib/registration";
import { actions } from "@/lib/store";
import { useVisitorAccess } from "@/components/VisitorAccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): { perfil: "usuario" | "parceiro" } => ({ perfil: search["perfil"] === "parceiro" ? "parceiro" : "usuario" }),
  head: () => ({ meta: [
    { title: "Cadastro de usuário e parceiro — Thrill Bid" },
    { name: "description", content: "Cadastre seu perfil de comprador ou loja parceira no Thrill Bid e escolha seu plano de lances." },
    { property: "og:title", content: "Cadastre-se no Thrill Bid" },
    { property: "og:description", content: "Comece com 10 lances no Plano Gratuito ou escolha o Premium com 200 lances mensais." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Register,
});

function Register() {
  const { perfil } = Route.useSearch();
  const navigate = useNavigate();
  const { completeRegistration } = useVisitorAccess();
  const [step, setStep] = useState<"form" | "plans" | "received">("form");
  const [showPassword, setShowPassword] = useState(false);
  const buyer = useForm<BuyerRegistration>({ resolver: zodResolver(buyerSchema), defaultValues: { name: "", email: "", cpf: "", password: "", referral: "" } });
  const partner = useForm<PartnerRegistration>({ resolver: zodResolver(partnerSchema), defaultValues: { company: "", cnpj: "", email: "", phone: "" } });
  const fieldClass = "h-11 bg-card";
  function choosePlan(plan: "gratuito" | "pago") { actions.registerDemo(plan); completeRegistration(); navigate({ to: "/usuario" }); }
  const buyerErrors = buyer.formState.errors;
  const partnerErrors = partner.formState.errors;
  function error(id: string, message?: string) { return message ? <p id={id} role="alert" className="mt-1 text-xs text-destructive">{message}</p> : null; }
  return <main className="mx-auto max-w-2xl px-5 py-9 sm:py-12">
    <Button asChild variant="link" className="mb-7 h-auto p-0 text-xs text-muted-foreground"><Link to="/"><ArrowLeft />Voltar aos leilões</Link></Button>
    {step === "received" ? <section className="py-10 text-center">
      <span className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-secondary text-primary"><CheckCircle2 className="size-8" /></span>
      <h1 className="text-3xl font-semibold">Cadastro recebido!</h1>
      <p className="mx-auto mt-4 max-w-lg leading-relaxed text-muted-foreground">Cadastro recebido! Nossa equipe de gestão analisará seu perfil comercial em breve para liberar seu painel de envio de itens.</p>
      <p className="mt-4 text-xs text-muted-foreground">Demonstração: nenhum cadastro foi enviado para análise.</p>
      <Button asChild className="mt-7"><Link to="/">Explorar leilões<ArrowRight /></Link></Button>
    </section> : step === "plans" ? <section>
      <p className="mb-3 text-xs font-semibold text-primary">PASSO 2 DE 2 · SEU PLANO</p><h1 className="text-3xl font-semibold">Escolha como começar.</h1><p className="mt-3 text-sm text-muted-foreground">Seu cadastro foi simulado. Agora, escolha seus primeiros lances.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <article className="flex flex-col rounded-lg border bg-card p-6"><Gift className="mb-5 size-7 text-primary" /><h2 className="text-xl font-semibold">Plano Gratuito</h2><p className="mt-2 text-3xl font-bold">Grátis</p><p className="mt-5 flex items-center gap-2 text-sm"><Check className="size-4 text-primary" />10 lances inclusos</p><p className="mb-6 mt-3 text-sm text-muted-foreground">Para dar seus primeiros lances.</p><Button onClick={() => choosePlan("gratuito")} variant="outline" className="mt-auto w-full">Começar gratuitamente<ArrowRight /></Button></article>
        <article className="flex flex-col rounded-lg border border-primary bg-card p-6"><Crown className="mb-5 size-7 text-primary" /><h2 className="text-xl font-semibold">Plano Premium</h2><p className="mt-2 text-3xl font-bold">200 <span className="text-sm font-normal text-muted-foreground">lances / mês</span></p><p className="mt-5 flex items-center gap-2 text-sm"><Check className="size-4 text-primary" />200 lances mensais</p><p className="mb-6 mt-3 text-sm text-muted-foreground">Mais oportunidades para participar.</p><Button onClick={() => choosePlan("pago")} className="mt-auto w-full">Escolher Premium<ArrowRight /></Button></article>
      </div><p className="mt-5 text-xs text-muted-foreground">Escolha demonstrativa. Nenhuma cobrança ou renovação será realizada.</p>
    </section> : <>
      <p className="mb-3 text-xs font-semibold text-primary">FAÇA PARTE DO THRILL BID</p><h1 className="text-3xl font-semibold sm:text-4xl">Uma nova oportunidade começa aqui.</h1><p className="mt-3 text-sm text-muted-foreground">Seu perfil, seu próximo passo.</p>
      <Tabs value={perfil} onValueChange={v => navigate({ to: "/register", search: { perfil: v === "parceiro" ? "parceiro" : "usuario" }, replace: true })} className="mt-7">
        <TabsList className="grid h-12 w-full grid-cols-2 bg-secondary"><TabsTrigger value="usuario" className="h-10 gap-2 text-xs sm:text-sm"><UserRound className="size-4" />Sou Usuário <span className="hidden sm:inline">(Comprador)</span></TabsTrigger><TabsTrigger value="parceiro" className="h-10 gap-2 text-xs sm:text-sm"><Store className="size-4" />Sou Parceiro <span className="hidden sm:inline">(Lojista)</span></TabsTrigger></TabsList>
      </Tabs>
      <div className="mt-7 border-b pb-4"><h2 className="text-lg font-semibold">{perfil === "usuario" ? "Crie seu perfil de comprador" : "Apresente sua loja"}</h2><p className="mt-1 text-xs text-muted-foreground">{perfil === "usuario" ? "Passo 1 de 2 · Seus dados" : "Seu perfil comercial será analisado antes da liberação do painel."}</p></div>
      <p className="mt-4 text-xs text-muted-foreground">Cadastro demonstrativo: use dados fictícios. Nenhum dado é salvo ou enviado.</p>
      {perfil === "usuario" ? <form noValidate onSubmit={buyer.handleSubmit(() => { buyer.reset(); setStep("plans"); })} className="mt-5 space-y-5">
        <div><label htmlFor="name" className="mb-2 block text-sm font-medium">Nome Completo</label><Input id="name" autoComplete="name" maxLength={100} className={fieldClass} {...buyer.register("name")} aria-invalid={!!buyerErrors.name} aria-describedby="name-error" />{error("name-error", buyerErrors.name?.message)}</div>
        <div><label htmlFor="email" className="mb-2 block text-sm font-medium">E-mail</label><Input id="email" type="email" autoComplete="email" maxLength={255} className={fieldClass} {...buyer.register("email")} aria-invalid={!!buyerErrors.email} aria-describedby="email-error" />{error("email-error", buyerErrors.email?.message)}</div>
        <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="cpf" className="mb-2 block text-sm font-medium">CPF</label><Input id="cpf" inputMode="numeric" maxLength={14} placeholder="000.000.000-00" className={fieldClass} {...buyer.register("cpf")} aria-invalid={!!buyerErrors.cpf} aria-describedby="cpf-error" />{error("cpf-error", buyerErrors.cpf?.message)}</div><div><div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="text-sm font-medium">Senha</label><Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? "Ocultar" : "Mostrar"}</Button></div><Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" maxLength={72} placeholder="Pelo menos 8 caracteres" className={fieldClass} {...buyer.register("password")} aria-invalid={!!buyerErrors.password} aria-describedby="password-error" />{error("password-error", buyerErrors.password?.message)}</div></div>
        <div><label htmlFor="referral" className="mb-2 block text-sm font-medium">Código de Indicação <span className="text-xs font-normal text-muted-foreground">(opcional)</span></label><Input id="referral" placeholder="Quem te indicou?" maxLength={40} className={fieldClass} {...buyer.register("referral")} aria-invalid={!!buyerErrors.referral} aria-describedby="referral-error" />{error("referral-error", buyerErrors.referral?.message)}</div>
        <Button type="submit" className="h-11 w-full">Criar conta e escolher plano<ArrowRight /></Button>
      </form> : <form noValidate onSubmit={partner.handleSubmit(() => { partner.reset(); setStep("received"); })} className="mt-5 space-y-5">
        <div><label htmlFor="company" className="mb-2 block text-sm font-medium">Nome da Empresa/Comércio</label><Input id="company" autoComplete="organization" maxLength={150} className={fieldClass} {...partner.register("company")} aria-invalid={!!partnerErrors.company} aria-describedby="company-error" />{error("company-error", partnerErrors.company?.message)}</div>
        <div><label htmlFor="cnpj" className="mb-2 block text-sm font-medium">CNPJ</label><Input id="cnpj" inputMode="numeric" maxLength={18} placeholder="00.000.000/0000-00" className={fieldClass} {...partner.register("cnpj")} aria-invalid={!!partnerErrors.cnpj} aria-describedby="cnpj-error" />{error("cnpj-error", partnerErrors.cnpj?.message)}</div>
        <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="corporate-email" className="mb-2 block text-sm font-medium">E-mail Corporativo</label><Input id="corporate-email" type="email" autoComplete="email" maxLength={255} className={fieldClass} {...partner.register("email")} aria-invalid={!!partnerErrors.email} aria-describedby="corporate-email-error" />{error("corporate-email-error", partnerErrors.email?.message)}</div><div><label htmlFor="phone" className="mb-2 block text-sm font-medium">Telefone de Contato</label><Input id="phone" type="tel" autoComplete="tel" maxLength={20} placeholder="(11) 99999-9999" className={fieldClass} {...partner.register("phone")} aria-invalid={!!partnerErrors.phone} aria-describedby="phone-error" />{error("phone-error", partnerErrors.phone?.message)}</div></div>
        <div><label htmlFor="category" className="mb-2 block text-sm font-medium">Categoria de Itens que vende</label><select id="category" className="h-11 w-full rounded-md border bg-card px-3 text-sm" {...partner.register("category")} aria-invalid={!!partnerErrors.category} aria-describedby="category-error"><option value="">Selecione uma categoria</option><option value="eletronicos">Eletrônicos e tecnologia</option><option value="moda">Moda e acessórios</option><option value="beleza">Beleza e cuidados pessoais</option><option value="casa">Casa e decoração</option><option value="outros">Outros</option></select>{error("category-error", partnerErrors.category?.message)}</div>
        <Button type="submit" className="h-11 w-full">Enviar cadastro comercial<ArrowRight /></Button>
      </form>}
    </>}
  </main>;
}