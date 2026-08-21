import { NextRequest, NextResponse } from "next/server";

import { authenticateApiKey } from "@/lib/security";
import { getAuditEvents } from "@/lib/services/auditService";

export async function GET(request: NextRequest) {
  const unauthorized = authenticateApiKey(request);
  if (unauthorized) return unauthorized;

  return NextResponse.json({ events: getAuditEvents() });
}
