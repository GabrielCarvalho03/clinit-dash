import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-admin";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const res = await db.collection("quotes").where("id", "==", body.id).get();
    const docId = res.docs[0].id;

    const resUpdate = await db
      .collection("quotes")
      .doc(docId)
      .update({
        ageGroup: body.ageGroup,
        anchoragePercentage: body.anchoragePercentage ?? null,
        dentistId: body.dentistId,
        downPayment: body.downPayment,
        gift: body.gift,
        installments: body.installments,
        observations: body.observations,
        illustrations: body.illustrations,
        patientAge: body.patientAge,
        customOriginalPrice: body.customOriginalPrice,
        patientBirthdate: body.patientBirthdate,
        patientGender: body.patientGender,
        patientName: body.patientName,
        patientProfile: body.patientProfile,
        paymentConditions: body.paymentConditions,
        paymentPreviewText: body.paymentPreviewText,
        relationship: body.relationship,
        treatments: body.treatments,
        validityCustomDate:
          body.validityCustomDate !== undefined
            ? new Date(body.validityCustomDate).toISOString()
            : null,
        validityDays: body.validityDays ? Number(body.validityDays) : null,
        status: body.status,
      });

    return NextResponse.json({ status: 200 });
  } catch (err) {
    throw new Error(`Nao foi possivel criar o tratamento: ${err}`);
  }
}
