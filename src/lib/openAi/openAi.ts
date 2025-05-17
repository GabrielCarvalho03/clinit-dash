import OpenAI from "openai";

export const openAiCliient = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
});
