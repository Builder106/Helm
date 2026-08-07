import { z } from 'zod';

export const CSResponseSchema = z.object({
  action: z.enum(['auto_send', 'review', 'escalate']),
  confidence: z.number().min(0).max(1),
  response_text: z.string(),
  reasoning: z.string(),
  cited_passages: z.array(z.string()),
});

export type CSResponse = z.infer<typeof CSResponseSchema>;

export interface KBPassage {
  id: string;
  category: string;
  content: string;
  distance: number;
}

/**
 * Tier-1 Customer Service Responder using Vector Retrieval & Confidence Gating.
 * 
 * Rules:
 * - Confidence >= 0.85: auto_send (direct resolution)
 * - 0.60 <= Confidence < 0.85: review (queue for human support agent)
 * - Confidence < 0.60: escalate (route to specialist tier)
 */
export async function generateCSResponse(
  userQuery: string,
  passages: KBPassage[]
): Promise<CSResponse> {
  // If no passages retrieved or highest relevance distance is weak, escalate
  if (passages.length === 0 || passages[0].distance > 0.45) {
    return {
      action: 'escalate',
      confidence: 0.35,
      response_text: 'I could not find an authoritative match in our knowledge base for your inquiry. Escalating to a customer specialist.',
      reasoning: 'Vector distance exceeded cutoff threshold (>0.45 cosine distance).',
      cited_passages: [],
    };
  }

  const topPassage = passages[0];
  const relevanceScore = 1.0 - topPassage.distance;
  const cited = passages.slice(0, 2).map((p) => `[${p.category}] ${p.content}`);

  if (relevanceScore >= 0.85) {
    return {
      action: 'auto_send',
      confidence: Math.min(0.98, relevanceScore),
      response_text: `Based on our policy (${topPassage.category}): ${topPassage.content}`,
      reasoning: 'High-confidence retrieval match with single-unambiguous KB passage.',
      cited_passages: cited,
    };
  }

  return {
    action: 'review',
    confidence: relevanceScore,
    response_text: `Suggested resolution based on ${topPassage.category}: ${topPassage.content}`,
    reasoning: 'Moderate retrieval relevance score; flagged for human agent sign-off.',
    cited_passages: cited,
  };
}
