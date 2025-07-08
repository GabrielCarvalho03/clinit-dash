import { db } from "@/lib/firebase/firebase-admin";

export async function POST(request: Request) {
  const body = await request.json();
  const { id } = body;

  try {
    const res = await db.collection("simulations").where("id", "==", id).get();
    const docId = res.docs[0].id;
    await db.collection("simulations").doc(docId).delete();
    return new Response(
      JSON.stringify({ message: "Simulação deletada com sucesso!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Erro ao deletar simulação!" }),
      {
        status: 500,
      }
    );
  }
}
