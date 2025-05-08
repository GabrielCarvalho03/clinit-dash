import { db } from "@/lib/firebase/firebase-admin";
import { ca } from "date-fns/locale";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  console.log("dentist/get-by-clinic", body);

  try {
    const res = await db
      .collection("dentists")
      .where("clinicId", "==", body.clinicId)
      .get();

    const dentists = res.docs.map((doc) => doc.data());
    return NextResponse.json(dentists);
  } catch (err) {
    console.log(err);
  }
}
