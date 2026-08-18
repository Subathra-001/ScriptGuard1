import { randomUUID } from "crypto";

import { persistStore, store } from "@/lib/store";
import type { Incident, IncidentSeverity, IncidentStatus } from "@/lib/types";
import { analyzeFailure } from "@/lib/services/analysisService";
import { logAuditEvent } from "@/lib/services/auditService";
import { sendEscalation, sendIncidentAlert } from "@/lib/services/notificationService";
import { executeFix, requiresApproval } from "@/lib/services/recoveryService";

interface CreateIncidentInput {
  scriptName: string;
  errorOutput: string;
  severity: IncidentSeverity;
  actor?: string;
}

export async function createIncident(input: CreateIncidentInput): Promise<Incident> {
  const now = new Date().toISOString();
  const incident: Incident = {
    id: `INC-${now.replace(/\D/g, "").slice(0, 14)}-${randomUUID().slice(0, 8).toUpperCase()}`,
    scriptName: input.scriptName,
    errorOutput: input.errorOutput,
    severity: input.severity,
    status: "Investigating",
    analysis: analyzeFailure(input.errorOutput, input.severity),
    recoveryState: "PendingApproval",
    approvalRequired: false,
    createdAt: now,
    updatedAt: now,
    fixExecutionLog: [],
  };

  incident.approvalRequired = requiresApproval(incident);

  if (incident.approvalRequired) {
    incident.fixExecutionLog.push(`${now}: Waiting for approval.`);
  } else {
    incident.recoveryState = "AutoHealing";
    executeFix(incident);
  }

  store.incidents.unshift(incident);
  await persistStore();

  await logAuditEvent({
    incidentId: incident.id,
    action: "incident.created",
    actor: input.actor ?? "system",
    details: `Incident created with status ${incident.status}.`,
  });

  await sendIncidentAlert(incident);
  await sendEscalation(incident);

  return incident;
}

export function listIncidents(): Incident[] {
  return store.incidents;
}

export function getIncidentById(id: string): Incident | undefined {
  return store.incidents.find((incident) => incident.id === id);
}

export async function updateIncidentStatus(
  id: string,
  status: IncidentStatus,
  actor: string,
): Promise<Incident | undefined> {
  const incident = getIncidentById(id);
  if (!incident) return undefined;

  incident.status = status;
  incident.updatedAt = new Date().toISOString();
  if (status === "Approved") {
    incident.approvedAt = incident.updatedAt;
    incident.recoveryState = "ExecutingFix";
  }
  if (status === "Resolved") {
    incident.resolvedAt = incident.updatedAt;
    incident.recoveryState = "Completed";
  }

  await logAuditEvent({
    incidentId: incident.id,
    action: "incident.status_updated",
    actor,
    details: `Incident moved to ${status}.`,
  });

  await persistStore();
  return incident;
}

export async function approveAndExecuteFix(id: string, actor: string): Promise<Incident | undefined> {
  const incident = getIncidentById(id);
  if (!incident) return undefined;

  incident.status = "Approved";
  incident.approvedAt = new Date().toISOString();
  incident.updatedAt = incident.approvedAt;

  await logAuditEvent({
    incidentId: incident.id,
    action: "incident.approved",
    actor,
    details: "Fix approval granted.",
  });

  executeFix(incident);

  await logAuditEvent({
    incidentId: incident.id,
    action: "incident.resolved",
    actor,
    details: "Approved fix executed successfully.",
  });

  await persistStore();
  return incident;
}

export function getDashboardMetrics() {
  const incidents = listIncidents();

  const bySeverity = incidents.reduce(
    (acc, incident) => {
      acc[incident.severity] += 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 },
  );

  const byStatus = incidents.reduce(
    (acc, incident) => {
      acc[incident.status] += 1;
      return acc;
    },
    { Investigating: 0, Approved: 0, Resolved: 0 },
  );

  const autoHealed = incidents.filter((i) => !i.approvalRequired && i.status === "Resolved").length;

  return {
    totalIncidents: incidents.length,
    autoHealed,
    requiresApproval: incidents.filter((i) => i.approvalRequired).length,
    bySeverity,
    byStatus,
  };
}
