import { Resend } from "resend";
import type { Lead } from "@/db/schema";
import { getReagentDashboardUrl } from "@/lib/hosts";

function scoreColor(score: number) {
  if (score >= 75) return "#16a34a";
  if (score >= 45) return "#d97706";
  return "#dc2626";
}

function scoreLabel(score: number) {
  if (score >= 75) return "Hot lead";
  if (score >= 45) return "Warm lead";
  return "Cool lead";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Sends a lead alert email.
 * Returns true only when Resend confirms acceptance.
 */
export async function sendLeadAlert(lead: Lead, toEmail: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[alert] RESEND_API_KEY not set — skipping email alert");
    return false;
  }

  // Free-tier safe default. Custom domains must be verified in Resend first.
  const configuredFrom = process.env.REAGENT_ALERT_FROM?.trim();
  const from =
    configuredFrom && /@resend\.dev>?$/i.test(configuredFrom)
      ? configuredFrom
      : "REagent <onboarding@resend.dev>";

  if (configuredFrom && from !== configuredFrom) {
    console.warn(
      `[alert] Ignoring unverified from address "${configuredFrom}". Using onboarding@resend.dev until your domain is verified in Resend.`,
    );
  }
  const dashboardUrl = getReagentDashboardUrl();
  const resend = new Resend(apiKey);
  const score = lead.score ?? 0;

  const { data, error } = await resend.emails.send({
    from,
    to: toEmail,
    subject: `New lead: ${lead.callerName ?? "Unknown caller"} — Score ${score}/100`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#0f172a;padding:20px 24px;border-radius:12px 12px 0 0">
          <span style="color:#fff;font-size:20px;font-weight:700">REagent</span>
          <span style="color:#94a3b8;font-size:14px;margin-left:8px">New enquiry received</span>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 12px 12px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
            <span style="font-size:28px;font-weight:800;color:${scoreColor(score)}">${score}</span>
            <div>
              <div style="font-weight:600;color:${scoreColor(score)}">${scoreLabel(score)}</div>
              <div style="font-size:13px;color:#64748b">Lead score out of 100</div>
            </div>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#64748b;width:120px">Name</td><td style="padding:6px 0;font-weight:500">${escapeHtml(lead.callerName ?? "—")}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Phone</td><td style="padding:6px 0;font-weight:500">${escapeHtml(lead.callerPhone ?? "—")}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Locality</td><td style="padding:6px 0">${escapeHtml(lead.locality ?? "—")}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Budget</td><td style="padding:6px 0">${escapeHtml(lead.budget ?? "—")}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Property</td><td style="padding:6px 0">${escapeHtml(lead.propertyType ?? "—")}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Timeline</td><td style="padding:6px 0">${escapeHtml(lead.timeline ?? "—")}</td></tr>
          </table>

          <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:8px;font-size:14px;line-height:1.6;color:#334155">
            <strong>Summary</strong><br>${escapeHtml(lead.summary ?? "No summary available.")}
          </div>

          <div style="margin-top:20px;text-align:center">
            <a href="${dashboardUrl}"
               style="display:inline-block;background:#0f172a;color:#fff;padding:12px 28px;border-radius:9999px;text-decoration:none;font-weight:600;font-size:14px">
              Open dashboard →
            </a>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("[alert] Resend error:", error);
    return false;
  }

  console.info("[alert] email accepted", data?.id);
  return true;
}
