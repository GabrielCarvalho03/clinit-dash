import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-admin";

export async function POST(req: Request) {
  const body = (await req.json()) as { clinicId: string };

  try {
    const res = await db
      .collection("quotes")
      .where("clinicId", "==", body.clinicId)
      .get();
    const quotes = res.docs.map((doc) => doc.data());

    return NextResponse.json({ quotes }, { status: 200 });
  } catch (err) {
    throw new Error(`Nao foi possivel criar o tratamento: ${err}`);
  }
}
