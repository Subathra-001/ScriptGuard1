import { randomUUID } from "crypto";

import { persistStore, store } from "@/lib/store";
import type { AuditEvent } from "@/lib/types";

export async function logAuditEvent(event: Omit<AuditEvent, "id" | "timestamp">): Promise<AuditEvent> {
  const newEvent: AuditEvent = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...event,
  };

  store.auditEvents.unshift(newEvent);
  await persistStore();
  console.info("[AUDIT]", JSON.stringify(newEvent));
  return newEvent;
}

export function getAuditEvents(): AuditEvent[] {
  return store.auditEvents;
}
