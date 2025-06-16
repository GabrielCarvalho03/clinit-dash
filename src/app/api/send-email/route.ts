import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email, subject, html } = await req.json();

  try {
    const data = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: "contato@clinitt.com.br",
        pass: "111%CRESCEmuito",
      },
    });

    const MailOptions = {
      from: {
        name: "Clinitt",
        address: "contato@clinitt.com.br",
      },
      to: email,
      subject: subject,
      html: html,
    };

    const handleSendMail = await data.sendMail(MailOptions);
    console.log("email enviado");
    return NextResponse.json({ success: true, handleSendMail });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao enviar e-mail" },
      { status: 500 }
    );
  }
}
