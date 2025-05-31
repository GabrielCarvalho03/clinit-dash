import { z } from "zod";


export const resetPasswordSchema = z.object({
    email: z.string().email({ message: "Digite um e-mail válido" }),
    password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().min(8, { message: "Confirme sua senha" }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
  
 export  type resetPasswordData = z.infer<typeof resetPasswordSchema>;