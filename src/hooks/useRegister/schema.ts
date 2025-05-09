import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(2, { message: "O nome da clínica é obrigatório" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, { message: "A confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export type RegisterSchemaData = z.infer<typeof RegisterSchema>;
