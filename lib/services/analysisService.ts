import type { AnalysisReport, IncidentSeverity } from "@/lib/types";

function inferRootCause(errorOutput: string): string {
  const text = errorOutput.toLowerCase();

  if (text.includes("timeout")) return "Script execution timed out due to upstream latency.";
  if (text.includes("permission") || text.includes("unauthorized")) return "Permission misconfiguration blocked script execution.";
  if (text.includes("connection") || text.includes("network")) return "Transient network or service connectivity issue.";
  if (text.includes("undefined") || text.includes("null")) return "Unhandled null/undefined value in script logic.";

  return "Unhandled runtime failure detected from script logs.";
}

function recommendFix(rootCause: string, severity: IncidentSeverity): string {
  if (rootCause.includes("timed out")) return "Increase timeout threshold and add retry with exponential backoff.";
  if (rootCause.includes("Permission")) return "Validate service principal roles and rotate stale credentials.";
  if (rootCause.includes("network")) return "Retry failed operations and fail over to a secondary endpoint.";
  if (rootCause.includes("null/undefined")) return "Add input validation and defensive null checks before execution.";

  return severity === "high"
    ? "Escalate to on-call engineer and run guided rollback workflow."
    : "Re-run with safe defaults and capture additional telemetry for triage.";
}

export function analyzeFailure(errorOutput: string, severity: IncidentSeverity): AnalysisReport {
  const rootCause = inferRootCause(errorOutput);
  const recommendedFix = recommendFix(rootCause, severity);

  return {
    summary: `AI analysis completed for ${severity}-severity script failure.`,
    rootCause,
    recommendedFix,
    riskLevel: severity,
    confidence: severity === "low" ? 0.92 : severity === "medium" ? 0.86 : 0.79,
    generatedAt: new Date().toISOString(),
  };
}
