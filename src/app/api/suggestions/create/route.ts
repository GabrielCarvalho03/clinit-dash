import { openAiCliient } from "@/lib/openAi/openAi";
import { TrainingForSuggestions } from "@/utils/IA/training-for-suggestions";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();
  const quotes = body.quotes;

  try {
    const trainingForSuggestions = TrainingForSuggestions({
      ListQuotes: quotes,
    });
    const SuggestionsIA = await openAiCliient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: trainingForSuggestions }],
    });
    const res = SuggestionsIA.choices[0].message.content;
    const resCleaned = res?.replace(/```json|```/g, "").trim();

    console.log(SuggestionsIA.choices[0].message.content);

    return NextResponse.json(JSON.parse(resCleaned ?? "[]"), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
};
