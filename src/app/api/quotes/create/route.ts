import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-admin";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();
  const customId = uuid();

  try {
    const res = await db.collection("quotes").add({
      clinicId: body.clinicId,
      id: uuid(),
      ageGroup: body.ageGroup,
      anchoragePercentage: body.anchoragePercentage,
      dentistId: body.dentistId,
      downPayment: body.downPayment,
      gift: body.gift,
      installments: body.installments,
      observations: body.observations,
      patientAge: body.patientAge,
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
      createdAt: new Date().toISOString(),
      status: body.status,
    });

    return NextResponse.json({ id: customId }, { status: 200 });
  } catch (err) {
    throw new Error(`Nao foi possivel criar o tratamento: ${err}`);
  }
}
