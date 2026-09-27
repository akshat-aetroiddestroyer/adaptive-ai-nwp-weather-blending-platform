import { useEffect, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CSI_SKILL, SOURCES, WEIGHTS, type VariableKey } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ClientOnly({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div
        className={cn("animate-pulse rounded-card bg-line/70", className)}
        aria-hidden
      />
    );
  }
  return children;
}

function ChartTip({
  active,
  payload,
  label,
  suffix,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="rounded-control bg-surface px-3 py-2 text-xs text-ink shadow-float">
      <p className="font-medium">{label ?? payload[0]?.name}</p>
      <p className="mt-0.5 tabular-nums text-muted">
        {typeof value === "number"
          ? suffix === "csi"
            ? value.toFixed(2)
            : `${value}%`
          : value}
      </p>
    </div>
  );
}

const WEIGHT_COLORS: Record<string, string> = {
  nwp: "var(--color-nwp)",
  ai: "var(--color-ai)",
  ens: "var(--color-ens)",
};

export function WeightDonut({ variable }: { variable: VariableKey }) {
  const w = WEIGHTS[variable];
  const data = (["nwp", "ai", "ens"] as const)
    .map((key) => ({
      key,
      name: SOURCES[key].short,
      value: w[key],
    }))
    .sort((a, b) => b.value - a.value);
  const leader = data.reduce((a, b) => (a.value >= b.value ? a : b));

  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,16rem)_1fr]">
      <ClientOnly className="mx-auto size-56">
        <div className="relative mx-auto size-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={68}
                outerRadius={96}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={WEIGHT_COLORS[entry.key]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTip suffix="%" />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xs font-medium tracking-wide text-faint uppercase">
              Leading
            </p>
            <p className="text-lg font-semibold tracking-tight text-ink">
              {leader.name}
            </p>
            <p className="text-sm tabular-nums text-muted">{leader.value}%</p>
          </div>
        </div>
      </ClientOnly>
      <ul className="flex flex-col gap-3">
        {data.map((entry) => (
          <li key={entry.key} className="flex items-center gap-3">
            <span
              className="size-2.5 shrink-0 rounded-pill"
              style={{ background: WEIGHT_COLORS[entry.key] }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-medium text-ink">
                  {SOURCES[entry.key].name}
                </p>
                <p className="text-sm font-semibold tabular-nums text-ink">
                  {entry.value}%
                </p>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-line">
                <div
                  className="h-full rounded-pill"
                  style={{
                    width: `${entry.value}%`,
                    background: WEIGHT_COLORS[entry.key],
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SKILL_FILL: Record<(typeof CSI_SKILL)[number]["kind"], string> = {
  blend: "var(--color-accent)",
  ens: "var(--color-ens)",
  ai: "color-mix(in oklab, var(--color-ink) 38%, white)",
  nwp: "color-mix(in oklab, var(--color-ink) 22%, white)",
};

export function SkillBarChart() {
  return (
    <ClientOnly className="h-72 w-full">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={CSI_SKILL}
            barCategoryGap="28%"
            margin={{ top: 16, right: 8, left: -12, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
            />
            <YAxis
              domain={[0, 0.85]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => v.toFixed(1)}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "var(--color-canvas)" }}
              content={<ChartTip suffix="csi" />}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72}>
              {CSI_SKILL.map((entry) => (
                <Cell key={entry.name} fill={SKILL_FILL[entry.kind]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ClientOnly>
  );
}
