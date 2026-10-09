import type { Lead } from "@/db/schema";

export function toPublicLead(lead: Lead) {
  return {
    id: lead.id,
    dealerEmail: lead.dealerEmail,
    callerName: lead.callerName,
    callerPhone: lead.callerPhone,
    locality: lead.locality,
    budget: lead.budget,
    propertyType: lead.propertyType,
    timeline: lead.timeline,
    score: lead.score,
    summary: lead.summary,
    transcript: lead.transcript,
    recordingUrl: lead.recordingUrl,
    status: lead.status,
    scoringStatus: lead.scoringStatus,
    alertSent: lead.alertSent,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}
