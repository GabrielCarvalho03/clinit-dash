import { resetPasswordData } from "@/hooks/use-reset-password/schema";
import { db } from "@/lib/firebase/firebase-admin";
import { hashPassword } from "@/utils/passwordhash";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

type dentist = {
  id: string;
  clinicId: string;
  name: string;
  specialty: string;
  photo: string;
};

type bodyUserUpdate = resetPasswordData& {
  clinicId: string;

};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as bodyUserUpdate

  try {
    const Passwordhashd = hashPassword(body.password);

    const res = await db
      .collection("users")
      .where("id", "==", body.clinicId)
      .get();
    const docID = res.docs[0].id;

    await db
      .collection("users")
      .doc(docID)
      .update({
        password: Passwordhashd
      });


    return NextResponse.json("criado com sucesso", { status: 200 });
  } catch (err) {
    console.log("erro ao criar conta", err);
  }
}
