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

/** Deterministic fallback so a Gemini outage still yields a presentable lead. */
export function heuristicScore(transcript: string): ScoredLead {
  const text = transcript.trim();
  if (!text) return emptyTranscriptScore();

  const phone =
    text.match(/(?:\+?91[\s-]?)?[6-9]\d{9}/)?.[0] ??
    text.match(/\+?\d[\d\s-]{8,}\d/)?.[0] ??
    null;
  const budget =
    text.match(/₹\s?[\d.,]+\s?(?:cr|crore|lakh|lac|k)?/i)?.[0] ??
    text.match(/budget[^\n.]{0,40}/i)?.[0] ??
    null;
  const propertyType =
    text.match(/\b([1-5]\s?bhk|studio|villa|plot|flat|apartment)\b/i)?.[0] ?? null;
  const localityMatch = text.match(
    /\b(?:in|near|at)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\b/,
  );
  const locality = localityMatch?.[1] ?? null;
  const nameMatch = text.match(
    /\b(?:main|I am|I'm|mera naam|my name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  );
  const timeline =
    text.match(/\b(\d+\s*(?:day|days|week|weeks|month|months))\b/i)?.[0] ?? null;

  let score = 35;
  if (budget) score += 20;
  if (propertyType) score += 15;
  if (locality) score += 15;
  if (timeline) score += 10;
  if (phone) score += 10;
  if (text.length < 80) score = Math.min(score, 25);

  return {
    callerName: nameMatch?.[1] ?? null,
    callerPhone: phone,
    locality,
    budget,
    propertyType,
    timeline,
    summary:
      "Lead captured from the call transcript. AI scoring was unavailable, so a basic estimate was used.",
    score: Math.max(0, Math.min(100, score)),
  };
}

export async function scoreLead(transcript: string): Promise<ScoredLead> {
  const trimmed = transcript.trim();
  if (!trimmed) return emptyTranscriptScore();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[scorer] GEMINI_API_KEY missing — using heuristic fallback");
    return heuristicScore(trimmed);
  }

  const genai = new GoogleGenerativeAI(apiKey);

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
      console.warn(`[scorer] model ${modelName} failed, trying next…`, err);
    }
  }

  console.warn("[scorer] all Gemini models failed — using heuristic fallback");
  return heuristicScore(trimmed);
}
