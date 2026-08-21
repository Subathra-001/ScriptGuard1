import { NextRequest, NextResponse } from "next/server";

import { authenticateApiKey } from "@/lib/security";
import { approveAndExecuteFix, getIncidentById, updateIncidentStatus } from "@/lib/services/incidentService";
import type { IncidentStatus } from "@/lib/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function getActor(request: NextRequest): string {
  return request.headers.get("x-actor") ?? "api";
}

export async function GET(request: NextRequest, context: RouteContext) {
  const unauthorized = authenticateApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const incident = getIncidentById(id);

  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  return NextResponse.json({ incident });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const unauthorized = authenticateApiKey(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const actor = getActor(request);

  if (body.action === "approve") {
    const incident = await approveAndExecuteFix(id, actor);
    if (!incident) return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    return NextResponse.json({ incident });
  }

  if (body.status && ["Investigating", "Approved", "Resolved"].includes(body.status)) {
    const incident = await updateIncidentStatus(id, body.status as IncidentStatus, actor);
    if (!incident) return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    return NextResponse.json({ incident });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
