import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Scale, Plus, Users, Clock, CheckCircle2, Search, Phone as PhoneIcon, Bell } from "lucide-react";

type Status = "Новый" | "В работе" | "Закрыт";
type Client = { id: string; name: string; phone: string; status: Status };

const STORAGE_KEY = "lawyer-crm-clients-ru";
const WEBHOOK_URL = "https://hook.eu1.make.com/pb5livbdspqlhp66h1ggbdpwa8pugudh";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lex — CRM для юристов" },
      { name: "description", content: "Современная LegalTech CRM для управления клиентами, статусами и делами." },
      { property: "og:title", content: "Lex — CRM для юристов" },
      { property: "og:description", content: "Современная LegalTech CRM для управления клиентами, статусами и делами." },
    ],
  }),
  component: Dashboard,
});

const STATUSES: Status[] = ["Новый", "В работе", "Закрыт"];

const statusStyles: Record<Status, string> = {
  "Новый": "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30",
  "В работе": "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30",
  "Закрыт": "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
};

function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      // Remove legacy storage from earlier English version
      localStorage.removeItem("lawyer-crm-clients");
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setClients(JSON.parse(raw));
      else {
        const seed: Client[] = [
          { id: crypto.randomUUID(), name: "Сол Гудман", phone: "+1 (505) 503-4455", status: "Новый" },
          { id: crypto.randomUUID(), name: "Харви Спектер", phone: "+1 (212) 555-0199", status: "В работе" },
          { id: crypto.randomUUID(), name: "Ким Уэкслер", phone: "+1 (505) 555-0177", status: "Новый" },
          { id: crypto.randomUUID(), name: "Мэтт Мёрдок", phone: "+1 (212) 555-0188", status: "Закрыт" },
          { id: crypto.randomUUID(), name: "Перри Мейсон", phone: "+1 (310) 555-0166", status: "В работе" },
          { id: crypto.randomUUID(), name: "Алан Шор", phone: "+1 (617) 555-0155", status: "Закрыт" },
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
    "Новый": clients.filter((c) => c.status === "Новый").length,
    "В работе": clients.filter((c) => c.status === "В работе").length,
    "Закрыт": clients.filter((c) => c.status === "Закрыт").length,
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
              <p className="text-xs text-slate-400">Управление клиентами и делами</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-400 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Все системы работают
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-sky-500/10 p-5 shadow-[0_0_40px_rgba(14,165,233,0.12)]">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-slate-200">
                <span className="font-semibold text-sky-300">Тестовая автоматизация:</span>{" "}
                <a
                  href="https://t.me/lexcrmtest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-sky-300 underline underline-offset-4 transition hover:text-sky-200"
                >
                  Открыть Telegram-канал
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
                . Добавьте нового клиента и уведомление моментально придет в этот канал через вебхук.
              </p>
            </div>
          </div>
        </section>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Дашборд</h2>
            <p className="mt-1 text-sm text-slate-400">Обзор всех активных клиентских дел.</p>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Новые клиенты" value={counts["Новый"]} icon={<Users className="h-4 w-4" />} tint="amber" />
          <StatCard label="В работе" value={counts["В работе"]} icon={<Clock className="h-4 w-4" />} tint="sky" />
          <StatCard label="Закрытые дела" value={counts["Закрыт"]} icon={<CheckCircle2 className="h-4 w-4" />} tint="emerald" />
        </section>

        <section className="mt-10 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-6 py-4">
            <div>
              <h3 className="text-sm font-semibold">Клиенты</h3>
              <p className="text-xs text-slate-400">{clients.length} записей всего</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск клиентов..."
                  className="w-64 rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-3.5 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(14,165,233,0.35)] transition hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" /> Добавить клиента
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3 font-medium">Имя</th>
                  <th className="px-6 py-3 font-medium">Телефон</th>
                  <th className="px-6 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center text-sm text-slate-500">
                      Клиенты не найдены. Добавьте первого клиента, чтобы начать.
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
  const [status, setStatus] = useState<Status>("Новый");
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
        <h3 className="text-lg font-semibold text-white">Новый клиент</h3>
        <p className="mt-1 text-sm text-slate-400">Добавьте запись о клиенте в CRM.</p>

        <div className="mt-6 space-y-4">
          <Field label="Полное имя">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Иванов"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              required
            />
          </Field>
          <Field label="Телефон">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              required
            />
          </Field>
          <Field label="Начальный статус">
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
            Отмена
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(14,165,233,0.35)] transition hover:bg-sky-400 disabled:opacity-60"
          >
            {submitting ? "Добавление..." : "Добавить клиента"}
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
