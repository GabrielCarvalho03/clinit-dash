import { api } from "@/lib/axios/axios";
import { db } from "@/lib/firebase/firebase-admin";
import { stripeCliente } from "@/lib/stripe/stripe";
import { hashPassword } from "@/utils/passwordhash";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    if (!sig) throw new Error("Assinatura do Stripe não encontrada!");

    const event = stripeCliente.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // 🚀 Trate os eventos conforme necessário
    if (event.type === "checkout.session.completed") {
      const customId = uuid();
      const session = event.data.object;

      console.log("session", session.metadata);

      if (session.metadata?.clinicId) {
        const userData = await db
          .collection("users")
          .where("id", "==", session.metadata?.clinicId)
          .get();

        const userId = userData.docs[0].id;
        await db.collection("users").doc(userId).update({
          active: true,
          firstLogin: true,
        });
      } else {
        console.log("session", session.metadata);
        const userData = await db.collection("users").add({
          id: customId,
          email: session.customer_details?.email,
          active: true,
          firstLogin: true,
        });
      }
      const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Bem-vindo à Clinitt.ai</title>
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
    <h1>Olá, Dentista!</h1>
    <p>Seja bem-vindo à <strong>Clinitt.ai</strong>, o sistema especialista em orçamentos odontológicos estratégicos.</p>
    <p>Sua conta já está ativa.</p>
    <p>Para acessar a plataforma pela primeira vez, clique no botão abaixo e defina sua senha:</p>

    <a href="${process.env.NEXT_PUBLIC_URL}/reset-password/${customId}" class="button">Definir Senha e Acessar</a>

    <p>Com a <strong>Clinitt.ai</strong>, você cria orçamentos personalizados em segundos, aumenta sua taxa de conversão e apresenta sua clínica de forma profissional.</p>

    <p>⚠️ <strong>Atenção:</strong><br>
    Em até 72 horas úteis, nosso time entrará em contato pelo número cadastrado para agendar seu onboarding.</p>

    <p>Nesse encontro, você vai conhecer todos os recursos da plataforma e aprender como potencializar seus resultados desde o início.</p>

    <p>Qualquer dúvida, estamos por aqui.</p>

    <div class="footer">
      <p>Equipe Clinitt.ai</p>
      <p><a href="https://www.clinitt.ai" style="color: #006d77; text-decoration: none;">www.clinitt.ai</a></p>
    </div>
  </div>
</body>
</html>
`;


      
      const sendMail = await api.post("/send-email", {
        email: session.customer_details?.email,
        subject: "Seja bem-vindo à Clinitt.ai – Ative sua conta",
        html: html,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Erro no Webhook:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
