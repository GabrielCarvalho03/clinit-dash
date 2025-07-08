import { SimulationHistoric } from "@/app/(private)/dashboard/simulation/hooks/use-simulation-historic/types";
import { db } from "@/lib/firebase/firebase-admin";
import { NextResponse } from "next/server";

import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();
  const { clinicId, resultado, photo, tipo } = body as SimulationHistoric & {
    clinicId: string;
  };

  const uuidRamdom = uuid();

  try {
    const response = await db.collection("simulations").add({
      clinicId,
      createdAt: new Date().toISOString(),
      id: uuidRamdom,
      resultado,
      photo,
      tipo,
    });

    const data = {
      clinicId,
      createdAt: new Date().toISOString(),
      id: uuidRamdom,
      resultado,
      photo,
      tipo,
    };

    return NextResponse.json({ data });
  } catch (err: any) {
    console.log("❌ Erro ao criar simulação:", err);
    return NextResponse.json(
      { error: "Erro ao criar simulação" },
      { status: 500 }
    );
    // throw new Error("❌ Erro ao criar simulação:", err);
  }
}
