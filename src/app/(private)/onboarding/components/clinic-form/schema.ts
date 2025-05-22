import { z } from "zod";

export const clinicFormSchema = z.object({
  name: z.string().min(1, "Nome da clínica é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  phoneNumber: z
    .string()
    .min(14, "Telefone incompleto") // (99) 9999-9999
    .max(15, "Telefone inválido") // (99) 99999-9999
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato de telefone inválido"),
  phoneNumber2: z.string().optional(),
  cnpj: z
    .string()
    .min(18, "CNPJ incompleto")
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido"),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    website: z.string().optional(),
  }),
});

export type ClinicFormData = z.infer<typeof clinicFormSchema>;
