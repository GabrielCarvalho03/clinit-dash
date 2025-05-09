import { db } from "@/lib/firebase/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const res = await db.collection("users").where("id", "==", body.id).get();

    return NextResponse.json(res.docs[0].data());
  } catch (err) {
    console.log(err);
  }
}
