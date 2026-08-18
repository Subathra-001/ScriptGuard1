import { NextRequest, NextResponse } from "next/server";

import { authenticateApiKey } from "@/lib/security";
import { createIncident, listIncidents } from "@/lib/services/incidentService";
import type { IncidentSeverity } from "@/lib/types";

export async function GET(request: NextRequest) {
  const unauthorized = authenticateApiKey(request);
  if (unauthorized) return unauthorized;

  return NextResponse.json({ incidents: listIncidents() });
}

export async function POST(request: NextRequest) {
  const unauthorized = authenticateApiKey(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!body || typeof body.scriptName !== "string" || typeof body.errorOutput !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const severity = body.severity as IncidentSeverity;
  if (!["low", "medium", "high"].includes(severity)) {
    return NextResponse.json({ error: "Invalid severity" }, { status: 400 });
  }

  const incident = await createIncident({
    scriptName: body.scriptName,
    errorOutput: body.errorOutput,
    severity,
    actor: "api",
  });

  return NextResponse.json({ incident }, { status: 201 });
}
