import { timingSafeEqual } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { config } from "@/lib/config";

function safeEquals(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function authenticateApiKey(request: NextRequest): NextResponse | null {
  if (!config.apiKey) {
    return NextResponse.json(
      { error: "Server misconfigured: SCRIPTGUARD_API_KEY is required" },
      { status: 500 },
    );
  }

  const headerApiKey = request.headers.get("x-api-key");
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const apiKey = headerApiKey ?? bearerToken;

  if (!apiKey || !safeEquals(apiKey, config.apiKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
