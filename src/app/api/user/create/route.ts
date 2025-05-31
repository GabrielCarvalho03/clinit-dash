import { db } from "@/lib/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/utils/passwordhash";

type bodyUser = {
  email: string;
  password: string;
  ClinicName: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as bodyUser;
  const clinicIdGenerated = uuid();

  try {
    const Passwordhashd = hashPassword(body.password);

    const newUser = {
      id: clinicIdGenerated,
      email: body.email,
      password: Passwordhashd,
      ClinicName: body.ClinicName,
    };

    await db.collection("users").add(newUser);

    const token = jwt.sign(
      {
        id: clinicIdGenerated,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const cookie = serialize("tokenClinitt", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    const response = NextResponse.json(
      { clinicId: clinicIdGenerated },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (err) {
    console.log("erro ao criar conta", err);
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 });
  }
}
