import { mkdirSync, readFileSync } from "fs";
import { rename, writeFile } from "fs/promises";
import { join } from "path";

import type { AuditEvent, Incident } from "@/lib/types";

interface StoreState {
  incidents: Incident[];
  auditEvents: AuditEvent[];
}

const dataDirectory = join(process.cwd(), ".data");
const storeFilePath = join(dataDirectory, "scriptguard-store.json");

function loadStore(): StoreState {
  try {
    const raw = readFileSync(storeFilePath, "utf8");
    const parsed = JSON.parse(raw) as StoreState;
    return {
      incidents: parsed.incidents ?? [],
      auditEvents: parsed.auditEvents ?? [],
    };
  } catch {
    return { incidents: [], auditEvents: [] };
  }
}

const state = loadStore();

export const store: StoreState = {
  incidents: state.incidents,
  auditEvents: state.auditEvents,
};

let persistQueue: Promise<void> = Promise.resolve();

export function persistStore(): Promise<void> {
  const operation = persistQueue.then(async () => {
    mkdirSync(dataDirectory, { recursive: true });
    const tempPath = `${storeFilePath}.tmp`;
    await writeFile(tempPath, JSON.stringify(store));
    await rename(tempPath, storeFilePath);
  });

  persistQueue = operation.catch((error) => {
    console.error("Persist operation failed:", error);
  });

  return operation;
}
