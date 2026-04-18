export type ProductFaq = { question: string; answer: string };

export function parseHighlights(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function parseFaqs(raw: unknown): ProductFaq[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === "object")
    .map((x) => ({
      question: x.question != null ? String(x.question).trim() : "",
      answer: x.answer != null ? String(x.answer).trim() : "",
    }))
    .filter((x) => x.question);
}
