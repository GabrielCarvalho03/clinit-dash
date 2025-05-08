import crypto from "crypto";
import { db } from "@/lib/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

type bodyUser = {
  email: string;
  password: string;
  ClinicName: string;
};
export async function POST(req: NextRequest) {
  const body = (await req.json()) as bodyUser;

  try {
    const hashPassword = crypto
      .createHash("sha256")
      .update(body.password)
      .digest("hex");
    console.log({ hash: hashPassword });

    const res = await db.collection("users").add({
      id: uuid(),
      email: body.email,
      password: hashPassword,
      ClinicName: body.ClinicName,
    });

    return NextResponse.json("criado com sucesso", { status: 200 });
  } catch (err) {
    console.log("erro ao criar conta", err);
  }
}
