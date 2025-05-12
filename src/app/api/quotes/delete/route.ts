import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-admin";

export async function POST(req: Request) {
  const body = (await req.json()) as { id: string };

  try {
    const res = await db.collection("quotes").where("id", "==", body.id).get();
    const docId = res.docs[0].id;

    const resDelete = await db.collection("quotes").doc(docId).delete();

    return NextResponse.json({ status: 200 });
  } catch (err) {
    throw new Error(`Nao foi possivel criar o tratamento: ${err}`);
  }
}
