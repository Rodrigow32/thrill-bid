import { describe, expect, it } from "vitest";
import { buyerSchema, partnerSchema } from "./registration";

const buyer = { name: "Pessoa Teste", email: "teste@example.com", cpf: "529.982.247-25", password: "Teste12345", referral: "" };
const partner = { company: "Loja Teste", email: "loja@example.com", cnpj: "11.222.333/0001-81", phone: "(11) 99999-9999", category: "casa" };
describe("simulated registration validation", () => {
  it("accepts complete buyer details with optional empty referral", () => expect(buyerSchema.safeParse(buyer).success).toBe(true));
  it("rejects invalid CPF and weak password", () => {
    expect(buyerSchema.safeParse({ ...buyer, cpf: "11111111111" }).success).toBe(false);
    expect(buyerSchema.safeParse({ ...buyer, password: "123" }).success).toBe(false);
  });
  it("rejects invalid email and referral characters", () => {
    expect(buyerSchema.safeParse({ ...buyer, email: "not-email" }).success).toBe(false);
    expect(buyerSchema.safeParse({ ...buyer, referral: "<script>" }).success).toBe(false);
  });
  it("accepts a valid merchant profile", () => expect(partnerSchema.safeParse(partner).success).toBe(true));
  it("rejects invalid CNPJ, phone and missing category", () => {
    expect(partnerSchema.safeParse({ ...partner, cnpj: "00000000000000" }).success).toBe(false);
    expect(partnerSchema.safeParse({ ...partner, phone: "1234" }).success).toBe(false);
    expect(partnerSchema.safeParse({ ...partner, category: "" }).success).toBe(false);
  });
});