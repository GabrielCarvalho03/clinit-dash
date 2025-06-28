import { StandardTreatment } from "@/@types/quotes";
import { db } from "@/lib/firebase/firebase-admin";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

type bodyTreatment = StandardTreatment & {
  clinicId: string;
};

export const POST = async (request: Request) => {
  const body = (await request.json()) as bodyTreatment;
  const customId = uuid();

  try {
    const res = await db.collection("treatments").add({
      clinicId: body.clinicId,
      id: customId,
      name: body.name,
      description: body.description,
      price: body.price,
      photo: body.photo ?? "",
    });

    return NextResponse.json({ id: customId }, { status: 200 });
  } catch (err) {
    throw new Error(`Não foi possivel criar o tratamento: ${err}`);
  }
};
