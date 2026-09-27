import { useState } from "react";
import {
  BarChart3,
  CloudRain,
  CloudSun,
  GitCompare,
  PieChart as PieChartIcon,
  ShieldCheck,
  Thermometer,
  Wind,
  Workflow,
} from "lucide-react";
import { SkillBarChart, WeightDonut } from "@/components/charts";
import {
  Caption,
  FloatingTitle,
  Panel,
  Surface,
} from "@/components/floating-title";
import { useNav } from "@/components/nav-context";
import { Button } from "@/components/ui/button";
import {
  CONFIDENCE,
  CSI_SKILL,
  DELTA,
  FLOW_STEPS,
  MODEL_CARDS,
  MODEL_FORECASTS,
  PERIOD,
  RMSE_TEMP,
  SOURCES,
  VARIABLES,
  WEIGHTS,
  blendValue,
  formatBlend,
  type SourceKey,
  type VariableKey,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const VARIABLE_ORDER: VariableKey[] = ["rainfall", "temperature", "wind"];

function leadingSource(variable: VariableKey): SourceKey {
  const w = WEIGHTS[variable];
  return (Object.keys(w) as SourceKey[]).reduce((a, b) =>
    w[a] >= w[b] ? a : b,
  );
}

export function OverviewPanel() {
  const { setSection } = useNav();
  return (
    <Panel>
      <FloatingTitle
        title="Overview & The Problem"
        subtitle="Why one weather model is never enough"
        icon={CloudSun}
      />
      <Surface className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-pill bg-accent-soft px-2.5 py-1 text-2xs font-medium tracking-wide text-accent uppercase">
            SIH26081
          </span>
          <span className="rounded-pill bg-canvas px-2.5 py-1 text-2xs font-medium tracking-wide text-muted uppercase">
            Ministry of Earth Sciences
          </span>
        </div>
        <div>
          <p className="text-2xs font-medium tracking-wide text-faint uppercase">
            Project
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
            Adaptive AI–NWP Weather Blending Platform
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            One trusted forecast for Bhopal, blended from a physical NWP model,
            ECMWF AIFS, and an ensemble — with weights that follow whoever has
            been right lately.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="rounded-xl bg-sidebar px-3 py-2 text-sm font-medium text-sidebar-fg-active">
              1. Overview
            </span>
            <span className="hidden text-faint sm:inline" aria-hidden>
              →
            </span>
            <Button
              type="button"
              variant="outline"
              className="justify-start"
              onClick={() => setSection("weights")}
            >
              2. Weight Map
            </Button>
            <span className="hidden text-faint sm:inline" aria-hidden>
              →
            </span>
            <Button
              type="button"
              variant="outline"
              className="justify-start"
              onClick={() => setSection("score")}
            >
              3. Accountability
            </Button>
          </div>
        </div>
      </Surface>
      <div className="grid gap-4 md:grid-cols-3">
        {MODEL_CARDS.map((card) => (
          <Surface key={card.title} className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-ink">{card.title}</p>
            <p className="text-2xs font-medium tracking-wide text-faint uppercase">
              {card.source}
            </p>
            <div>
              <p className="text-2xs font-medium tracking-wide text-accent uppercase">
                Strength
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink">
                {card.strength}
              </p>
            </div>
            <div>
              <p className="text-2xs font-medium tracking-wide text-muted uppercase">
                Weakness
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {card.weakness}
              </p>
            </div>
          </Surface>
        ))}
      </div>
      <Surface className="bg-accent-soft/60">
        <p className="text-sm font-medium text-ink">
          No single model wins everywhere — hence the need to blend.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          The rest of this prototype shows the weights, the proof, and the
          warning a farmer would actually see.
        </p>
      </Surface>
    </Panel>
  );
}

export function HowPanel() {
  return (
    <Panel>
      <FloatingTitle
        title="How It Works"
        subtitle="From raw model data to one trusted forecast"
        icon={Workflow}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {FLOW_STEPS.map((step) => (
          <Surface key={step.n}>
            <p className="text-2xs font-semibold tracking-wide text-accent uppercase">
              Step {step.n}
            </p>
            <h2 className="mt-2 text-base font-semibold text-ink">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {step.body}
            </p>
          </Surface>
        ))}
      </div>
      <Surface>
        <p className="text-2xs font-medium tracking-wide text-faint uppercase">
          Weight formula
        </p>
        <p className="mt-2 font-sans text-sm font-medium tracking-tight text-ink">
          weightᵢ = (1 / errorᵢ) ÷ Σ (1 / errorⱼ)
        </p>
        <Caption>
          Lower error earns a larger share. Rain uses CSI; temperature and wind
          use RMSE. Recalculated every 10 days.
        </Caption>
      </Surface>
    </Panel>
  );
}

const VAR_ICONS = {
  rainfall: CloudRain,
  temperature: Thermometer,
  wind: Wind,
} as const;

export function BlendPanel() {
  return (
    <Panel>
      <FloatingTitle
        title="Live Blending Engine"
        subtitle="Sample blended forecast for Bhopal"
        icon={CloudRain}
      />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="font-medium text-ink">{PERIOD.city}</span>
        <span>{PERIOD.coords}</span>
        <span>Issued {PERIOD.issued}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {VARIABLE_ORDER.map((key) => {
          const Icon = VAR_ICONS[key];
          return (
            <Surface key={key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">
                  {VARIABLES[key].label}
                </p>
                <Icon className="size-4 text-accent" strokeWidth={1.75} />
              </div>
              <p className="text-3xl font-semibold tracking-tight text-ink tabular-nums">
                {formatBlend(key)}
                <span className="ml-1 text-base font-medium text-muted">
                  {VARIABLES[key].unit}
                </span>
              </p>
              <Caption>{VARIABLES[key].caption} · blended</Caption>
            </Surface>
          );
        })}
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold text-ink">
          What each model said
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(SOURCES) as SourceKey[]).map((src) => (
            <Surface key={src}>
              <p className="text-sm font-semibold text-ink">
                {SOURCES[src].name}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {VARIABLE_ORDER.map((key) => (
                  <li
                    key={key}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="text-muted">{VARIABLES[key].label}</span>
                    <span className="font-medium tabular-nums text-ink">
                      {key === "temperature"
                        ? MODEL_FORECASTS[key][src].toFixed(1)
                        : MODEL_FORECASTS[key][src]}{" "}
                      {VARIABLES[key].unit}
                    </span>
                  </li>
                ))}
              </ul>
            </Surface>
          ))}
        </div>
      </div>
      <Caption>
        Blended value = Σ (weight × model). Rain this window: 0.20×47 + 0.48×33
        + 0.32×40 = {blendValue("rainfall").toFixed(1)} mm, shown as{" "}
        {formatBlend("rainfall")} mm.
      </Caption>
    </Panel>
  );
}

export function WeightsPanel() {
  const [variable, setVariable] = useState<VariableKey>("rainfall");
  const leader = leadingSource(variable);

  return (
    <Panel>
      <FloatingTitle
        title="Which Model Do We Trust?"
        subtitle="Adaptive weight assigned to each source"
        icon={PieChartIcon}
      />
      <div
        className="flex flex-wrap gap-1 rounded-xl bg-canvas p-1"
        role="tablist"
        aria-label="Forecast variable"
      >
        {VARIABLE_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={variable === key}
            onClick={() => setVariable(key)}
            className={cn(
              "min-h-11 flex-1 rounded-lg px-3 text-sm font-medium transition-colors duration-150",
              variable === key
                ? "bg-surface text-ink shadow-card"
                : "text-muted hover:text-ink",
            )}
          >
            {VARIABLES[key].label}
          </button>
        ))}
      </div>
      <Surface className="p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-2xs font-medium tracking-wide text-faint uppercase">
              Active window
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {PERIOD.label} · {PERIOD.city}
            </p>
          </div>
          <p className="rounded-pill bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            Trusting {SOURCES[leader].short} at {WEIGHTS[variable][leader]}%
          </p>
        </div>
        <WeightDonut variable={variable} />
      </Surface>
      <Caption>
        Weights recalculated every 10 days based on recent proven accuracy.
        Switch the variable — rainfall, temperature, and wind do not share a
        mix.
      </Caption>
    </Panel>
  );
}

export function ConfidencePanel() {
  const c = CONFIDENCE.rainfall;
  return (
    <Panel>
      <FloatingTitle
        title="How Sure Are We?"
        subtitle="Confidence label for every forecast"
        icon={ShieldCheck}
      />
      <Surface className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-2xs font-medium tracking-wide text-faint uppercase">
              Bhopal rainfall · next 24h
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular-nums">
              {c.range}
            </p>
            <p className="mt-1 text-sm text-muted">
              Point forecast {c.point} {c.unit}
            </p>
          </div>
          <span className="rounded-pill bg-med-soft px-3 py-1 text-xs font-semibold text-med">
            {c.level} confidence
          </span>
        </div>
        <div className="relative mt-8">
          <div className="relative h-3 rounded-pill bg-line">
            <div
              className="absolute inset-y-0 rounded-pill bg-accent/30"
              style={{ left: "43.75%", width: "31.25%" }}
            />
            <div
              className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-accent shadow-card"
              style={{ left: "47.5%" }}
              title="38 mm"
            />
          </div>
          <div className="relative mt-2 h-4 text-2xs tabular-nums text-faint">
            <span className="absolute left-0">0 mm</span>
            <span className="absolute" style={{ left: "43.75%" }}>
              35
            </span>
            <span className="absolute" style={{ left: "75%" }}>
              60
            </span>
            <span className="absolute right-0">80 mm</span>
          </div>
        </div>
      </Surface>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Model agreement", value: "Partial", note: "AIFS ≈ ensemble; NWP wetter" },
          { label: "Ensemble spread", value: "Moderate", note: "Members 28–55 mm" },
          { label: "Historical accuracy", value: "CSI 0.64", note: "This 10-day window, 2021–2023" },
        ].map((item) => (
          <Surface key={item.label}>
            <p className="text-2xs font-medium tracking-wide text-faint uppercase">
              {item.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-ink">{item.value}</p>
            <Caption>{item.note}</Caption>
          </Surface>
        ))}
      </div>
      <Caption>
        Confidence is driven by model agreement, ensemble spread, and this
        period’s historical skill — not by a round number on a map. {c.why}
      </Caption>
    </Panel>
  );
}

export function ScorePanel() {
  const bestSingle = CSI_SKILL.filter((d) => d.kind !== "blend").reduce((a, b) =>
    a.value >= b.value ? a : b,
  );
  const blend = CSI_SKILL[0];
  const lift = ((blend.value - bestSingle.value) / bestSingle.value) * 100;

  return (
    <Panel>
      <FloatingTitle
        title="Proof It Works"
        subtitle="Blended forecast vs. each individual model"
        icon={BarChart3}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Surface className="sm:col-span-1">
          <p className="text-2xs font-medium tracking-wide text-faint uppercase">
            CSI lift vs best source
          </p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-accent tabular-nums">
            +{lift.toFixed(0)}%
          </p>
          <Caption>
            Rainfall CSI, held-out 2024. Higher is better.
          </Caption>
        </Surface>
        <Surface className="sm:col-span-2">
          <p className="text-2xs font-medium tracking-wide text-faint uppercase">
            Headline
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
            The blend beats every individual model on a year it never trained
            on.
          </p>
          <Caption>
            Tested on a held-out year the weight engine never saw. Weights from
            2021–2023, scored on 2024.
          </Caption>
        </Surface>
      </div>
      <Surface className="p-6">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold text-ink">
            Rainfall CSI · held-out 2024
          </h2>
          <p className="text-xs text-muted">Critical Success Index</p>
        </div>
        <SkillBarChart />
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CSI_SKILL.map((row) => (
            <li key={row.name} className="rounded-control bg-canvas px-3 py-2">
              <p className="text-2xs text-muted">{row.name}</p>
              <p
                className={cn(
                  "text-lg font-semibold tabular-nums",
                  row.kind === "blend" ? "text-accent" : "text-ink",
                )}
              >
                {row.value.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </Surface>
      <Surface>
        <p className="text-sm font-semibold text-ink">
          Temperature RMSE · lower is better
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {RMSE_TEMP.map((row) => (
            <li key={row.name}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className={row.kind === "blend" ? "font-semibold text-ink" : "text-muted"}>
                  {row.name}
                </span>
                <span className="tabular-nums font-medium text-ink">
                  {row.value.toFixed(2)}°C
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-pill bg-line">
                <div
                  className={cn(
                    "h-full rounded-pill",
                    row.kind === "blend" ? "bg-accent" : "bg-ens",
                  )}
                  style={{ width: `${(row.value / 1.8) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <Caption>
          Same held-out year. The blend is also the sharpest on temperature —
          not just rain.
        </Caption>
      </Surface>
    </Panel>
  );
}

export function DeltaPanel() {
  const delta = DELTA.current.rainfall - DELTA.previous.rainfall;
  return (
    <Panel>
      <FloatingTitle
        title="What Changed?"
        subtitle="How the forecast shifted since last update"
        icon={GitCompare}
      />
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
        <Surface>
          <p className="text-2xs font-medium tracking-wide text-faint uppercase">
            Previous · {DELTA.previous.issued}
          </p>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-ink">
            {DELTA.previous.rainfall}
            <span className="ml-1 text-base font-medium text-muted">mm</span>
          </p>
          <Caption>24-hour rainfall, Bhopal</Caption>
        </Surface>
        <div className="flex items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-title bg-accent-soft text-accent">
            <span className="text-sm font-semibold tabular-nums">
              +{delta} mm
            </span>
          </div>
        </div>
        <Surface>
          <p className="text-2xs font-medium tracking-wide text-faint uppercase">
            Now · {DELTA.current.issued}
          </p>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-ink">
            {DELTA.current.rainfall}
            <span className="ml-1 text-base font-medium text-muted">mm</span>
          </p>
          <Caption>24-hour rainfall, Bhopal</Caption>
        </Surface>
      </div>
      <Surface>
        <p className="text-sm font-semibold text-ink">Why the jump</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{DELTA.reason}</p>
      </Surface>
      <Caption>
        Seeing the delta — not just the latest map — is how a user learns the
        system is paying attention, not rolling dice each cycle.
      </Caption>
    </Panel>
  );
}
