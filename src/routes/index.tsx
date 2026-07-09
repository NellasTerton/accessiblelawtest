import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Scale, Plus, Users, Clock, CheckCircle2, Search, Phone as PhoneIcon } from "lucide-react";

type Status = "New" | "In Progress" | "Closed";
type Client = { id: string; name: string; phone: string; status: Status };

const STORAGE_KEY = "lawyer-crm-clients";
const WEBHOOK_URL = "https://hook.eu1.make.com/pb5livbdspqlhp66h1ggbdpwa8pugudh";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lex — Lawyer CRM Dashboard" },
      { name: "description", content: "Sleek LegalTech CRM to manage clients, statuses, and casework." },
      { property: "og:title", content: "Lex — Lawyer CRM Dashboard" },
      { property: "og:description", content: "Sleek LegalTech CRM to manage clients, statuses, and casework." },
    ],
  }),
  component: Dashboard,
});

const STATUSES: Status[] = ["New", "In Progress", "Closed"];

const statusStyles: Record<Status, string> = {
  New: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30",
  "In Progress": "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30",
  Closed: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
};

function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setClients(JSON.parse(raw));
      else {
        const seed: Client[] = [
          { id: crypto.randomUUID(), name: "Marcus Whitfield", phone: "+1 (415) 555-0134", status: "New" },
          { id: crypto.randomUUID(), name: "Elena Rossi", phone: "+1 (212) 555-0198", status: "In Progress" },
          { id: crypto.randomUUID(), name: "Jonah Beckett", phone: "+1 (646) 555-0177", status: "Closed" },
        ];
        setClients(seed);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients, loaded]);

  const counts = {
    New: clients.filter((c) => c.status === "New").length,
    "In Progress": clients.filter((c) => c.status === "In Progress").length,
    Closed: clients.filter((c) => c.status === "Closed").length,
  };

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.toLowerCase().includes(query.toLowerCase()),
  );

  const updateStatus = (id: string, status: Status) =>
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  const addClient = async (name: string, phone: string, status: Status) => {
    const client: Client = { id: crypto.randomUUID(), name, phone, status };
    setClients((prev) => [client, ...prev]);
    setOpen(false);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_60%)]" />

      <header className="relative border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/20 to-indigo-500/20 ring-1 ring-white/10">
              <Scale className="h-5 w-5 text-sky-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Lex CRM</h1>
              <p className="text-xs text-slate-400">Client Case Management</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-400 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            All systems operational
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
            <p className="mt-1 text-sm text-slate-400">Overview of all active client engagements.</p>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="New Clients" value={counts.New} icon={<Users className="h-4 w-4" />} tint="amber" />
          <StatCard label="In Progress" value={counts["In Progress"]} icon={<Clock className="h-4 w-4" />} tint="sky" />
          <StatCard label="Closed Cases" value={counts.Closed} icon={<CheckCircle2 className="h-4 w-4" />} tint="emerald" />
        </section>

        <section className="mt-10 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-6 py-4">
            <div>
              <h3 className="text-sm font-semibold">Clients</h3>
              <p className="text-xs text-slate-400">{clients.length} total records</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search clients..."
                  className="w-64 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-3.5 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(14,165,233,0.35)] transition hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" /> Add Client
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center text-sm text-slate-500">
                      No clients found. Add your first client to get started.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                            {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                          <span className="font-medium text-slate-100">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <div className="inline-flex items-center gap-2">
                          <PhoneIcon className="h-3.5 w-3.5 text-slate-500" />
                          {c.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={c.status}
                            onChange={(e) => updateStatus(c.id, e.target.value as Status)}
                            className={`appearance-none rounded-full px-3 py-1 pr-7 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${statusStyles[c.status]}`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s} className="bg-[#0a0d14] text-slate-100">
                                {s}
                              </option>
                            ))}
                          </select>
                          <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" /></svg>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {open && <AddClientModal onClose={() => setOpen(false)} onAdd={addClient} />}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tint,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tint: "amber" | "sky" | "emerald";
}) {
  const tints = {
    amber: "from-amber-500/10 text-amber-300 ring-amber-500/20",
    sky: "from-sky-500/10 text-sky-300 ring-sky-500/20",
    emerald: "from-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  }[tint];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-5 transition hover:border-white/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${tints} ring-1`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 text-4xl font-semibold tracking-tight tabular-nums text-white">{value}</div>
    </div>
  );
}

function AddClientModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string, phone: string, status: Status) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("New");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    await onAdd(name.trim(), phone.trim(), status);
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1119] p-6 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-white">New Client</h3>
        <p className="mt-1 text-sm text-slate-400">Add a client record to the CRM.</p>

        <div className="mt-6 space-y-4">
          <Field label="Full name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              required
            />
          </Field>
          <Field label="Phone">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              required
            />
          </Field>
          <Field label="Initial status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#0d1119]">
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(14,165,233,0.35)] transition hover:bg-sky-400 disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Client"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      {children}
    </label>
  );
}
