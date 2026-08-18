import { randomUUID } from "crypto";

import { store } from "@/lib/store";
import type { AuditEvent } from "@/lib/types";

export function logAuditEvent(event: Omit<AuditEvent, "id" | "timestamp">): AuditEvent {
  const newEvent: AuditEvent = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...event,
  };

  store.auditEvents.unshift(newEvent);
  console.info("[AUDIT]", JSON.stringify(newEvent));
  return newEvent;
}

export function getAuditEvents(): AuditEvent[] {
  return store.auditEvents;
}
