import { db } from "@/lib/firebase/firebase-admin";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();

  try {
    const res = await db
      .collection("treatments")
      .where("clinicId", "==", body.clinicId)
      .get();
    const procedures = res.docs.map((doc) => doc.data());
    return NextResponse.json(procedures);
  } catch (err) {
    console.log(err);
  }
};
