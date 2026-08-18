# ScriptGuard

ScriptGuard is an AI-powered self-healing automation platform built with **Next.js + TypeScript + Node.js + Tailwind CSS**.

## Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 ScriptGuard                                 │
├───────────────────────┬──────────────────────┬─────────────────────────────┤
│ Incident Management   │ AI Analysis Engine   │ Recovery Orchestrator       │
│ - POST/GET incidents  │ - root cause         │ - risk-based approval        │
│ - status lifecycle    │ - fix recommendation │ - auto-heal low severity     │
│ - unique IDs          │ - structured JSON    │ - execute approved fixes     │
├───────────────────────┴──────────────────────┴─────────────────────────────┤
│ Notification System (Teams + Outlook webhooks) + Audit Logging             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Dashboard (history, severity, recovery status, metrics/reporting)          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Features

- Incident Management REST APIs with unique IDs and status tracking (`Investigating`, `Approved`, `Resolved`)
- AI analysis engine that produces structured JSON analysis reports
- Recovery orchestrator with approval workflow for medium/high risk and auto-healing for low risk
- Notification integration stubs for Microsoft Teams and Outlook webhook delivery
- Dashboard with incident history, severity breakdown, recovery status, and key metrics
- API key security, environment-variable configuration, and audit logging

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` (API key is required):

```bash
SCRIPTGUARD_API_KEY=replace-with-strong-key
TEAMS_WEBHOOK_URL=https://example.webhook.office.com/...
OUTLOOK_WEBHOOK_URL=https://example.outlook.office.com/...
ENABLE_NOTIFICATIONS=true
```

## Usage Guide

### 1) Create an incident

```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -H "x-api-key: replace-with-strong-key" \
  -d '{
    "scriptName": "nightly-etl",
    "errorOutput": "Connection timeout while calling upstream API",
    "severity": "medium"
  }'
```

### 2) List incidents

```bash
curl -H "x-api-key: replace-with-strong-key" http://localhost:3000/api/incidents
```

### 3) Approve and execute medium/high risk fix

```bash
curl -X PATCH http://localhost:3000/api/incidents/<INCIDENT_ID> \
  -H "Content-Type: application/json" \
  -H "x-api-key: replace-with-strong-key" \
  -d '{"action":"approve"}'
```

### 4) Dashboard metrics API

```bash
curl -H "x-api-key: replace-with-strong-key" http://localhost:3000/api/dashboard
```

### 5) Audit log API

```bash
curl -H "x-api-key: replace-with-strong-key" http://localhost:3000/api/audit
```

## API Documentation

### `POST /api/incidents`
Create incident and trigger analysis/recovery orchestration.

Request body:

```json
{
  "scriptName": "string",
  "errorOutput": "string",
  "severity": "low | medium | high"
}
```

### `GET /api/incidents`
List all incidents.

### `GET /api/incidents/:id`
Get a single incident.

### `PATCH /api/incidents/:id`
- `{"action": "approve"}`: approve + execute fix for medium/high incidents
- `{"status": "Investigating|Approved|Resolved"}`: manual status update

### `GET /api/dashboard`
Get dashboard metrics + incident history.

### `GET /api/audit`
Get audit event history.
