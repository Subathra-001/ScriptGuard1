export type IncidentStatus = "Investigating" | "Approved" | "Resolved";
export type IncidentSeverity = "low" | "medium" | "high";
export type RecoveryState = "PendingApproval" | "AutoHealing" | "ExecutingFix" | "Completed";

export interface AnalysisReport {
  summary: string;
  rootCause: string;
  recommendedFix: string;
  riskLevel: IncidentSeverity;
  confidence: number;
  generatedAt: string;
}

export interface Incident {
  id: string;
  scriptName: string;
  errorOutput: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  analysis: AnalysisReport;
  recoveryState: RecoveryState;
  approvalRequired: boolean;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  resolvedAt?: string;
  fixExecutionLog: string[];
}

export interface AuditEvent {
  id: string;
  incidentId?: string;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}
