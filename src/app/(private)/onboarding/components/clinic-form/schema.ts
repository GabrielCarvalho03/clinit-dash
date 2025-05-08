import { z } from "zod";

export const clinicFormSchema = z.object({
  name: z.string().min(1, "Nome da clínica é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  phoneNumber: z.string().min(1, "Número de telefone é obrigatório"),
  phoneNumber2: z.string().optional(),
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    website: z.string().optional(),
  }),
});

export type ClinicFormData = z.infer<typeof clinicFormSchema>;
