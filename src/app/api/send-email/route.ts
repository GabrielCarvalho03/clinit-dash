import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email, subject, html } = await req.json();

  try {
    const data = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "clinitt@gmail.com",
        pass: "nvsy xbem fewa gkvu",
      },
    });

    const MailOptions = {
      from: {
        name: "Clinitt AI",
        address: "clinitt@gmail.com",
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
