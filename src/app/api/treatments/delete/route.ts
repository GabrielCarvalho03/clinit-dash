import { db } from "@/lib/firebase/firebase-admin";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();

  try {
    const resTreatments = await db
      .collection("treatments")
      .where("id", "==", body.id)
      .get();
    const docId = resTreatments.docs[0].id;
    const res = await db.collection("treatments").doc(docId).delete();
    return NextResponse.json(res);
  } catch (err) {
    console.log(err);
  }
};
