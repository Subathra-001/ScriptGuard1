import { getDashboardMetrics, listIncidents } from "@/lib/services/incidentService";

export default function Home() {
  const metrics = getDashboardMetrics();
  const incidents = listIncidents();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">ScriptGuard Dashboard</h1>
        <p className="text-slate-600">Incident history, severity tracking, recovery status, and operational metrics.</p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Total Incidents" value={metrics.totalIncidents} />
        <MetricCard label="Auto-Healed" value={metrics.autoHealed} />
        <MetricCard label="Requires Approval" value={metrics.requiresApproval} />
        <MetricCard label="Resolved" value={metrics.byStatus.Resolved} />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Low Severity" value={metrics.bySeverity.low} />
        <MetricCard label="Medium Severity" value={metrics.bySeverity.medium} />
        <MetricCard label="High Severity" value={metrics.bySeverity.high} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold">Incident History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="px-2 py-2">Incident ID</th>
                <th className="px-2 py-2">Script</th>
                <th className="px-2 py-2">Severity</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Recovery</th>
                <th className="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-2 py-6 text-center text-slate-500">
                    No incidents yet. Create incidents via POST /api/incidents.
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr key={incident.id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-mono">{incident.id}</td>
                    <td className="px-2 py-2">{incident.scriptName}</td>
                    <td className="px-2 py-2 capitalize">{incident.severity}</td>
                    <td className="px-2 py-2">{incident.status}</td>
                    <td className="px-2 py-2">{incident.recoveryState}</td>
                    <td className="px-2 py-2">{new Date(incident.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
