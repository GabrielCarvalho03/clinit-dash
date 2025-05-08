import crypto from "crypto";
import { db } from "@/lib/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

type bodyUser = {
  email: string;
  password: string;
};

type UserObejct = {
  email: string;
  password: string;
  ClinicName: string;
};
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as bodyUser;

  try {
    const hashPassword = crypto
      .createHash("sha256")
      .update(body.password)
      .digest("hex");

    const res = await db
      .collection("users")
      .where("email", "==", body.email)
      .where("password", "==", hashPassword)
      .get();

    if (res.empty) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }

    const user = res.docs[0].data();

    const token = jwt.sign(
      {
        id: user.id,
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

    const response = NextResponse.json({ user }, { status: 200 });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (err) {
    console.log("erro ao criar conta", err);
  }
}
