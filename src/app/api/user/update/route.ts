import { db } from "@/lib/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

type dentist = {
  id: string;
  clinicId: string;
  name: string;
  specialty: string;
  photo: string;
};

type bodyUserUpdate = {
  clinicId: string;
  id: string;
  name: string;
  cnpj: string;
  phone1: string;
  phone2: string;
  address: string;
  logo: string;
  firstLogin: boolean;
  dentist: dentist[];
  socialMedia: {
    facebook: string;
    instagram: string;
    website: string;
  };
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as bodyUserUpdate;

  try {
    const res = await db
      .collection("users")
      .where("id", "==", body.clinicId)
      .get();
    const docID = res.docs[0].id;

    await db
      .collection("users")
      .doc(docID)
      .update({
        ClinicName: body.name,
        cnpj: body.cnpj,
        phoneNumber: body.phone1,
        phoneNumber2: body.phone2,
        address: body.address,
        firstLogin: body.firstLogin,
        logo: body.logo ?? "",
        socialMedia: body.socialMedia,
      });

    // Busca todos os dentistas dessa clínica
    const existingSnapshot = await db
      .collection("dentists")
      .where("clinicId", "==", body.clinicId)
      .get();

    const existingIds = new Set(
      existingSnapshot.docs.map((doc) => doc.data().id)
    );

    for (const item of body.dentist) {
      if (!existingIds.has(item.id)) {
        const customId = uuid();

        await db.collection("dentists").add({
          id: customId,
          clinicId: body.clinicId,
          name: item.name,
          specialty: item.specialty,
          photo: item.photo,
        });
      }
    }

    return NextResponse.json("criado com sucesso", { status: 200 });
  } catch (err) {
    console.log("erro ao criar conta", err);
  }
}
