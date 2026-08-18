import { NextRequest, NextResponse } from "next/server";

import { authenticateApiKey } from "@/lib/security";
import { getDashboardMetrics, listIncidents } from "@/lib/services/incidentService";

export async function GET(request: NextRequest) {
  const unauthorized = authenticateApiKey(request);
  if (unauthorized) return unauthorized;

  return NextResponse.json({
    metrics: getDashboardMetrics(),
    incidents: listIncidents(),
  });
}
