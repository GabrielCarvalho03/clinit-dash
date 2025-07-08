import { db } from "@/lib/firebase/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { clinicId } = body;

  try {
    const response = await db
      .collection("simulations")
      .where("clinicId", "==", clinicId)
      .get();
    const data = response.docs.map((doc) => ({
      ...doc.data(),
    }));

    return NextResponse.json({ simulations: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar simulações" },
      { status: 500 }
    );
  }
}
