import { create } from "zustand";
import { ResetPasswordProps } from "./types";
import { toast } from "sonner";
import { api } from "@/lib/axios/axios";

const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Conta ativada - Clinitt.ai</title>
<style>
  body {
    background-color: #f0f4f8;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0; padding: 0;
  }
  .container {
    background: #ffffff;
    border-radius: 12px;
    padding: 40px 30px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    max-width: 500px;
    margin: 40px auto;
    text-align: center;
    color: #333333;
  }
  h1 {
    color: #006d77;
    margin-bottom: 24px;
  }
  p {
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 20px;
  }
  .button {
    display: inline-block;
    padding: 14px 28px;
    background-color: #006d77;
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 20px auto;
  }
  .footer {
    font-size: 14px;
    color: #718096;
    margin-top: 30px;
  }
</style>
</head>
<body>
  <div class="container">
    <h1>Olá!</h1>
    <p>Sua conta foi ativada com sucesso e agora você já pode acessar a plataforma da <strong>Clinitt.ai</strong> normalmente.</p>
    
    <p><strong>🟢 Acesso ao sistema:</strong><br>
    Use sempre o link abaixo para entrar na sua conta:</p>
    
    <a href="${process.env.NEXT_PUBLIC_URL}/login" class="button">Acessar a plataforma</a>
    
    <p><strong>Login:</strong> [seu e-mail cadastrado]<br>
    <strong>Senha:</strong> a que você acabou de definir</p>
    
    <p><strong>📞 Próximo passo: onboarding personalizado</strong><br>
    Nos próximos dias, entraremos em contato com você pelo número cadastrado para agendar o onboarding.<br>
    Nesse encontro, vamos te mostrar como usar todos os recursos da Clinitt.ai para gerar orçamentos que convertem mais.</p>
    
    <p>Enquanto isso, fique à vontade para explorar a plataforma.</p>
    
    <p>Qualquer dúvida, fale com a gente.</p>
    
    <div class="footer">
      <p>Equipe Clinitt.ai</p>
      <p><a href="https://www.clinitt.ai" style="color: #006d77; text-decoration: none;">www.clinitt.ai</a></p>
    </div>
  </div>
</body>
</html>
`;





export const useResetPassword = create<ResetPasswordProps>((set)=>({
    isLoading :false, 
    setIsLoading :(value) => set({isLoading:value}) , 

    handleUploadPassword: async (data, route , id) => {
        const {setIsLoading} = useResetPassword.getState(   )
    
        try {
            setIsLoading(true);
             const res = await api.post('/user/update-password',{
                ...data, 
                clinicId:id, 
             })
            toast(
              'Senha configurada com sucesso!',
              {
            description: "Sua nova senha foi configurada. Você já pode fazer login.",
          });

          const sendMail = await api.post("/send-email", {
            email: data.email,
            subject: "Acesso liberado – o próximo passo com a Clinitt.ai",
            html: html,
          });
            
            // Redirecionar para login após sucesso
            setTimeout(() => {
              route.push("/login");
            }, 2000);
          } catch (error) {
            toast.error('Erro ao configurar senha!',{
              description: "Verifique seu e-mail e tente novamente",
            });
          } finally {
            setIsLoading(false);
          }

        
    }

}))