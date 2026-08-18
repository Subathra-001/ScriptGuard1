import { NextRequest, NextResponse } from "next/server";

import { config } from "@/lib/config";

export function authenticateApiKey(request: NextRequest): NextResponse | null {
  const headerApiKey = request.headers.get("x-api-key");
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const apiKey = headerApiKey ?? bearerToken;

  if (!apiKey || apiKey !== config.apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
