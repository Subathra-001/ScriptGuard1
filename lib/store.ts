import type { AuditEvent, Incident } from "@/lib/types";

const incidents: Incident[] = [];
const auditEvents: AuditEvent[] = [];

export const store = {
  incidents,
  auditEvents,
};
