import { db } from "@/lib/firebase/firebase-admin";
import dayjs from "dayjs";

export async function POST(req: Request) {
  const { clinicId } = (await req.json()) as { clinicId: string };

  if (!clinicId) {
    return new Response("Clinic ID is required", { status: 400 });
  }
  try {
    const ExistLastAcessWithThisDate = await db
      .collection("lastAccess")
      .where("clinicId", "==", clinicId)
      .where("lastAccess", "==", dayjs().format("DD/MM/YYYY"))
      .get();

    if (!ExistLastAcessWithThisDate.empty) {
      return new Response("Last access already registered for today", {
        status: 200,
      });
    }

    await db.collection("lastAccess").add({
      clinicId,
      lastAccess: dayjs().format("DD/MM/YYYY"),
    });
  } catch (error: any) {
    console.error("Error updating last access:", error);
    return new Response("Error updating last access", { status: 500 });
  }

  return new Response("Last access updated", { status: 200 });
}
