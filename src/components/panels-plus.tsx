import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  Bookmark,
  Cpu,
  Github,
  Info,
  Landmark,
  Languages,
  MapPin,
  Mic,
  Milestone,
  Plane,
  Search,
  Ship,
  Smartphone,
  Sprout,
  TriangleAlert,
} from "lucide-react";
import {
  Caption,
  FloatingTitle,
  Panel,
  Surface,
} from "@/components/floating-title";
import {
  ADVISORIES,
  ALERT,
  ARCH_STEPS,
  CITIZEN_FEATURES,
  DIFFERENTIATORS,
  FARMER,
  LANG_SAMPLE,
  ROADMAP,
  SAVED_LOCATIONS,
  SEARCH_PLACES,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const FEATURE_ICONS = {
  search: Search,
  saved: Bookmark,
  push: Bell,
  lang: Languages,
} as const;

const ROADMAP_ICONS = [Ship, TriangleAlert, Plane, Mic, Landmark, Milestone];

export function AlertPanel() {
  return (
    <Panel>
      <FloatingTitle
        title="Plain-Language Alerts"
        subtitle="Turning model output into a real warning"
        icon={Bell}
      />
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-title bg-sidebar p-4 shadow-float">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-2xs font-medium tracking-wide text-sidebar-fg uppercase">
              Notification
            </span>
            <span className="text-2xs text-faint">now</span>
          </div>
          <div className="rounded-card bg-sidebar-active p-4 text-sidebar-fg-active">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-control bg-accent/20 text-accent">
                <Cloudlet />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-sidebar-fg">
                  {ALERT.app}
                </p>
                <p className="mt-0.5 text-sm font-semibold">{ALERT.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-sidebar-fg">
                  {ALERT.what}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { k: "What", v: ALERT.what },
          { k: "When", v: ALERT.when },
          { k: "Risk level", v: `${ALERT.risk} — not a red alert, not a shrug.` },
          { k: "Recommended action", v: ALERT.action },
        ].map((row) => (
          <Surface key={row.k}>
            <p className="text-2xs font-medium tracking-wide text-faint uppercase">
              {row.k}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{row.v}</p>
          </Surface>
        ))}
      </div>
      <Caption>
        Same Medium-confidence 35–60 mm envelope from the blending engine —
        written so a person can act without opening a methods annex.
      </Caption>
    </Panel>
  );
}

function Cloudlet() {
  return <Bell className="size-4" strokeWidth={1.75} />;
}

export function FarmerPanel() {
  return (
    <Panel>
      <FloatingTitle
        title="Farmer Advisory"
        subtitle="Real-world impact for a Panchayat farmer"
        icon={Sprout}
      />
      <Surface className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-title bg-accent-soft text-sm font-semibold text-accent"
          aria-hidden
        >
          RP
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-ink">{FARMER.name}</h2>
          <p className="text-sm text-muted">{FARMER.village}</p>
        </div>
        <dl className="grid grid-cols-3 gap-3 sm:ml-auto">
          {[
            ["Crop", FARMER.crop],
            ["Stage", FARMER.stage],
            ["Plot", FARMER.plot],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-2xs font-medium tracking-wide text-faint uppercase">
                {k}
              </dt>
              <dd className="mt-1 text-sm font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </Surface>
      <div className="grid gap-4 md:grid-cols-3">
        {ADVISORIES.map((item) => (
          <Surface
            key={item.title}
            className={cn(
              item.tone === "warn" && "ring-1 ring-med/30",
              item.tone === "ok" && "ring-1 ring-high/30",
            )}
          >
            <p
              className={cn(
                "text-2xs font-medium tracking-wide uppercase",
                item.tone === "warn" && "text-med",
                item.tone === "ok" && "text-high",
                item.tone === "info" && "text-accent",
              )}
            >
              {item.tone === "warn"
                ? "Hold"
                : item.tone === "ok"
                  ? "Save"
                  : "Watch"}
            </p>
            <h3 className="mt-2 text-base font-semibold text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {item.body}
            </p>
          </Surface>
        ))}
      </div>
      <Caption>
        Advisories are rules on top of the same 38 mm Medium-confidence blend —
        not a second weather model.
      </Caption>
    </Panel>
  );
}

export function CitizenPanel() {
  const [lang, setLang] = useState<keyof typeof LANG_SAMPLE>("en");
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_PLACES;
    return SEARCH_PLACES.filter((p) => p.toLowerCase().includes(q));
  }, [query]);

  return (
    <Panel>
      <FloatingTitle
        title="Citizen App Features"
        subtitle="What a normal user sees"
        icon={Smartphone}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {CITIZEN_FEATURES.map((feat) => {
          const Icon = FEATURE_ICONS[feat.id as keyof typeof FEATURE_ICONS];
          return (
            <Surface key={feat.id} className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon className="size-4" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">{feat.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {feat.body}
                </p>
              </div>
            </Surface>
          );
        })}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Surface>
          <label
            htmlFor="place-search"
            className="text-sm font-semibold text-ink"
          >
            Try location search
          </label>
          <div className="relative mt-3">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint"
              strokeWidth={1.75}
            />
            <input
              id="place-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bhopal, Sehore, Raisen…"
              className="h-11 w-full rounded-control bg-canvas pr-3 pl-10 text-sm text-ink shadow-card placeholder:text-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </div>
          <ul className="mt-3 flex flex-col gap-1">
            {matches.map((place) => (
              <li
                key={place}
                className="flex items-center gap-2 rounded-control px-2 py-2 text-sm text-ink"
              >
                <MapPin className="size-3.5 text-accent" strokeWidth={1.75} />
                {place}
                {place === "Bhopal" ? (
                  <span className="ml-auto text-2xs text-faint">
                    Live demo city
                  </span>
                ) : (
                  <span className="ml-auto text-2xs text-faint">
                    Sample pin
                  </span>
                )}
              </li>
            ))}
            {matches.length === 0 ? (
              <li className="px-2 py-2 text-sm text-muted">
                No match in the sample list.
              </li>
            ) : null}
          </ul>
        </Surface>
        <Surface>
          <p className="text-sm font-semibold text-ink">Language toggle</p>
          <div className="mt-3 flex flex-wrap gap-1 rounded-xl bg-canvas p-1">
            {(
              [
                ["en", "English"],
                ["hi", "हिन्दी"],
                ["hinglish", "Hinglish"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLang(id)}
                className={cn(
                  "min-h-11 flex-1 rounded-lg px-3 text-sm font-medium transition-colors duration-150",
                  lang === id
                    ? "bg-surface text-ink shadow-card"
                    : "text-muted hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-4 rounded-control bg-canvas px-3 py-3 text-sm leading-relaxed text-ink">
            {LANG_SAMPLE[lang]}
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {SAVED_LOCATIONS.map((loc) => (
              <li
                key={loc.name}
                className="flex items-center justify-between rounded-control bg-canvas px-3 py-2 text-sm"
              >
                <span className="font-medium text-ink">{loc.name}</span>
                <span className="text-xs text-muted">{loc.hint}</span>
              </li>
            ))}
          </ul>
        </Surface>
      </div>
    </Panel>
  );
}

export function DiffPanel() {
  return (
    <Panel>
      <FloatingTitle
        title="What Makes This Different"
        subtitle="Beyond a standard weighted average"
        icon={BadgeCheck}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {DIFFERENTIATORS.map((item) => (
          <Surface key={item.title} className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-ink">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{item.body}</p>
          </Surface>
        ))}
      </div>
      <Surface className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">
            Model health · sample
          </p>
          <p className="mt-1 text-sm text-muted">
            AIFS last ingest 14 min ago · GFS members 31/31 · ERA5 complete
          </p>
        </div>
        <span className="rounded-pill bg-high-soft px-3 py-1 text-xs font-semibold text-high">
          All feeds healthy
        </span>
      </Surface>
    </Panel>
  );
}

export function ArchPanel() {
  return (
    <Panel>
      <FloatingTitle
        title="Under the Hood"
        subtitle="How the pipeline is built"
        icon={Cpu}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ARCH_STEPS.map((step) => (
          <Surface key={step.n}>
            <p className="text-2xs font-semibold tracking-wide text-accent uppercase">
              {step.n}
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">{step.title}</p>
          </Surface>
        ))}
      </div>
      <Surface>
        <p className="text-sm font-semibold text-ink">Data sources</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Open-Meteo", "ECMWF AIFS", "ERA5", "GFS / ICON", "IFS ENS"].map(
            (badge) => (
              <span
                key={badge}
                className="rounded-pill bg-canvas px-3 py-1.5 text-xs font-medium text-ink shadow-card"
              >
                {badge}
              </span>
            ),
          )}
        </div>
        <Caption>
          Python ingest → pandas skill tables → FastAPI → this dashboard. SQLite
          for the Bhopal MVP; no paid API keys.
        </Caption>
      </Surface>
    </Panel>
  );
}

export function RoadmapPanel() {
  return (
    <Panel>
      <FloatingTitle
        title="Coming Soon"
        subtitle="Roadmap beyond this prototype"
        icon={Milestone}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {ROADMAP.map((item, i) => {
          const Icon = ROADMAP_ICONS[i] ?? Milestone;
          return (
            <div
              key={item.title}
              className="rounded-card bg-surface/70 p-5 shadow-card outline outline-dashed outline-line"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-canvas text-faint">
                  <Icon className="size-4" strokeWidth={1.75} />
                </div>
                <span className="rounded-pill bg-canvas px-2.5 py-1 text-2xs font-medium text-muted">
                  Roadmap — not part of this prototype
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-muted">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-faint">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function AboutPanel() {
  return (
    <Panel>
      <FloatingTitle
        title="About This Project"
        subtitle="SIH26081 · Ministry of Earth Sciences"
        icon={Info}
      />
      <Surface className="flex flex-col gap-4">
        <div>
          <p className="text-2xs font-medium tracking-wide text-faint uppercase">
            Team
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">
            Adaptive Blend · SIH26081
          </p>
          <p className="mt-1 text-sm text-muted">
            Prototype owner: Om Tiwari. Built as a judge-facing demo of the
            blending engine, not a live operations desk.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-pill bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            SIH26081
          </span>
          <span className="rounded-pill bg-canvas px-3 py-1 text-xs font-medium text-ink">
            Ministry of Earth Sciences
          </span>
          <span className="rounded-pill bg-canvas px-3 py-1 text-xs font-medium text-ink">
            Bhopal MVP
          </span>
        </div>
      </Surface>
      <Surface className="flex items-start gap-3">
        <Github className="mt-0.5 size-4 text-muted" strokeWidth={1.75} />
        <div>
          <p className="text-sm font-semibold text-ink">Repository</p>
          <p className="mt-1 font-sans text-sm text-muted">
            github.com/sih26081/ai-nwp-blend
          </p>
          <Caption>
            Placeholder link — swap for the team repo before the final
            submission.
          </Caption>
        </div>
      </Surface>
      <Caption>
        All numbers on this site are sample data that follow the real blending
        math. Live Open-Meteo feeds are the production path, not this demo.
      </Caption>
    </Panel>
  );
}
