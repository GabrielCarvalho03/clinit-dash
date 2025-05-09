import { db } from "@/lib/firebase/firebase-admin";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();

  try {
    const resDentists = await db
      .collection("dentists")
      .where("id", "==", body.id)
      .get();
    const docId = resDentists.docs[0]?.id;
    const res = await db.collection("dentists").doc(docId).update({
      name: body.name,
      specialty: body.specialty,
      photo: body.photo,
    });
    return NextResponse.json(res);
  } catch (err) {
    console.log(err);
  }
};
