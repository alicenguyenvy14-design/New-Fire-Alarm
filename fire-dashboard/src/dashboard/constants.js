export const styles = {
  page: "dashboard-page min-h-screen bg-slate-100 py-4 pr-4 pl-0 md:py-6 md:pr-6 md:pl-0 text-slate-900",
  shell: "dashboard-shell w-full",
  layout: "dashboard-layout grid grid-cols-1 gap-4",
  panel: "dashboard-panel rounded-3xl border border-slate-200 bg-white shadow-sm",
  side: "p-5",
  main: "space-y-6",
  section: "p-5",
  card: "dashboard-card rounded-2xl border border-slate-200 bg-white shadow-sm",
  mutedCard: "dashboard-muted rounded-2xl border border-slate-200 bg-slate-50",
  badge: "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
  button: "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
  input: "dashboard-input w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500",
};

export const toneClasses = {
  safe: {
    card: "border-emerald-200 bg-emerald-50 text-emerald-700",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  caution: {
    card: "border-amber-200 bg-amber-50 text-amber-700",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  warning: {
    card: "border-orange-200 bg-orange-50 text-orange-700",
    badge: "border-orange-200 bg-orange-50 text-orange-700",
  },
  danger: {
    card: "border-red-200 bg-red-50 text-red-700",
    badge: "border-red-200 bg-red-50 text-red-700",
  },
  neutral: {
    card: "border-slate-200 bg-slate-50 text-slate-700",
    badge: "border-slate-200 bg-slate-50 text-slate-700",
  },
};
