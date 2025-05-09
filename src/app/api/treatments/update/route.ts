import { db } from "@/lib/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const resTreatments = await db
      .collection("treatments")
      .where("id", "==", body.id)
      .get();
    const docId = resTreatments.docs[0].id;
    const res = await db
      .collection("treatments")
      .doc(docId)
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        photo: body.image ?? "",
      });

    return NextResponse.json("atualizado com sucesso", { status: 200 });
  } catch (err) {
    console.log("erro ao criar conta", err);
  }
}
