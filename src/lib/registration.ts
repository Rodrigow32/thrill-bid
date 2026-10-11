import { z } from "zod";

const digits = (value: string) => value.replace(/\D/g, "");
function validDocument(value: string, kind: "cpf" | "cnpj") {
  const n = digits(value);
  if (n.length !== (kind === "cpf" ? 11 : 14) || /^(\d)\1+$/.test(n)) return false;
  const weights = kind === "cpf" ? [[10,9,8,7,6,5,4,3,2], [11,10,9,8,7,6,5,4,3,2]] : [[5,4,3,2,9,8,7,6,5,4,3,2], [6,5,4,3,2,9,8,7,6,5,4,3,2]];
  return weights.every(w => {
    const remainder = w.reduce((sum, weight, i) => sum + Number(n[i]) * weight, 0) % 11;
    return Number(n[w.length]) === (remainder < 2 ? 0 : 11 - remainder);
  });
}
const email = z.string().trim().max(255, "Use até 255 caracteres.").email("Informe um e-mail válido.");
export const buyerSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo.").max(100, "Use até 100 caracteres.").refine(v => v.split(/\s+/).length >= 2, "Informe nome e sobrenome."),
  email,
  cpf: z.string().max(14).regex(/^[\d.\-]+$/, "Informe um CPF válido.").refine(v => validDocument(v, "cpf"), "Informe um CPF válido."),
  password: z.string().min(8, "Use pelo menos 8 caracteres.").max(72, "Use até 72 caracteres."),
  referral: z.string().trim().max(40, "Use até 40 caracteres.").regex(/^[\p{L}\p{N}_ -]*$/u, "Use apenas letras, números, espaços, hífen ou sublinhado."),
});
export const partnerSchema = z.object({
  company: z.string().trim().min(2, "Informe o nome da empresa.").max(150, "Use até 150 caracteres."),
  cnpj: z.string().max(18).regex(/^[\d.\/-]+$/, "Informe um CNPJ válido.").refine(v => validDocument(v, "cnpj"), "Informe um CNPJ válido."),
  email,
  phone: z.string().max(20).regex(/^[\d\s()+-]+$/, "Informe um telefone válido.").refine(v => /^(?:55)?\d{10,11}$/.test(digits(v)), "Informe o telefone com DDD."),
  category: z.enum(["eletronicos", "moda", "beleza", "casa", "outros"], { errorMap: () => ({ message: "Selecione uma categoria." }) }),
});
export type BuyerRegistration = z.infer<typeof buyerSchema>;
export type PartnerRegistration = z.infer<typeof partnerSchema>;