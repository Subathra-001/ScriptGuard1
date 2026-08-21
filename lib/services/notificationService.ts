import { config } from "@/lib/config";
import type { Incident } from "@/lib/types";

async function sendWebhook(url: string | undefined, payload: object): Promise<void> {
  if (!url || !config.notificationsEnabled) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Notification webhook returned ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Notification webhook delivery failed:", error);
  }
}

export async function sendIncidentAlert(incident: Incident): Promise<void> {
  const payload = {
    title: `ScriptGuard Alert: ${incident.id}`,
    text: `${incident.scriptName} failed. Severity: ${incident.severity}. Status: ${incident.status}.`,
    analysis: incident.analysis,
  };

  await Promise.all([
    sendWebhook(config.teamsWebhookUrl, payload),
    sendWebhook(config.outlookWebhookUrl, payload),
  ]);
}

export async function sendEscalation(incident: Incident): Promise<void> {
  if (incident.severity === "low") return;

  const escalationPayload = {
    title: `ScriptGuard Escalation: ${incident.id}`,
    text: `Approval required for ${incident.severity}-risk fix on ${incident.scriptName}.`,
  };

  await Promise.all([
    sendWebhook(config.teamsWebhookUrl, escalationPayload),
    sendWebhook(config.outlookWebhookUrl, escalationPayload),
  ]);
}
