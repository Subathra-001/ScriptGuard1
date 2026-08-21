import type { Incident } from "@/lib/types";

export function requiresApproval(incident: Incident): boolean {
  return incident.severity === "medium" || incident.severity === "high";
}

export function executeFix(incident: Incident): Incident {
  const now = new Date().toISOString();

  incident.recoveryState = "ExecutingFix";
  incident.fixExecutionLog.push(`${now}: Started fix execution.`);
  incident.fixExecutionLog.push(`${now}: Applied fix -> ${incident.analysis.recommendedFix}`);
  incident.recoveryState = "Completed";
  incident.status = "Resolved";
  incident.resolvedAt = now;
  incident.updatedAt = now;

  return incident;
}
