import { GoogleGenerativeAI } from "@google/generative-ai";

export type ScoredLead = {
  callerName: string | null;
  callerPhone: string | null;
  locality: string | null;
  budget: string | null;
  propertyType: string | null;
  timeline: string | null;
  summary: string;
  score: number; // 0-100
};

const SYSTEM_PROMPT = `You are a real-estate lead scoring assistant.
Given a call transcript between an AI agent and a prospective property buyer/renter, extract structured information and score the lead.

Respond ONLY with a valid JSON object — no markdown fences, no extra text — with these keys:
{
  "callerName": string | null,
  "callerPhone": string | null,
  "locality": string | null,
  "budget": string | null,
  "propertyType": string | null,
  "timeline": string | null,
  "summary": string,
  "score": number
}

Scoring rubric:
- 80-100: Clear intent, specific budget, defined timeline, responsive caller
- 50-79:  Some details missing, moderate intent
- 20-49:  Vague inquiry, unclear budget or timeline
- 0-19:   Silent/spam caller, or caller hung up immediately
`;

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
].filter(Boolean) as string[];

function emptyTranscriptScore(): ScoredLead {
  return {
    callerName: null,
    callerPhone: null,
    locality: null,
    budget: null,
    propertyType: null,
    timeline: null,
    summary: "Caller did not provide a usable enquiry. Low-intent or silent call.",
    score: 5,
  };
}

export async function scoreLead(transcript: string): Promise<ScoredLead> {
  const trimmed = transcript.trim();
  if (!trimmed) return emptyTranscriptScore();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const genai = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genai.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" },
      });

      const result = await model.generateContent([
        SYSTEM_PROMPT,
        `TRANSCRIPT:\n${trimmed}`,
      ]);

      const raw = result.response.text().trim();
      const json = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
      const parsed = JSON.parse(json) as ScoredLead;
      parsed.score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
      parsed.summary = parsed.summary || "Enquiry captured from the call.";
      return parsed;
    } catch (err) {
      lastError = err;
      console.warn(`[scorer] model ${modelName} failed, trying next…`, err);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Gemini scoring failed");
}
