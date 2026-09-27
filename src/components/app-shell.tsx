import { useEffect, useId, useState, type ComponentType } from "react";
import { CloudRain, Menu, X } from "lucide-react";
import { NavContext } from "@/components/nav-context";
import {
  AboutPanel,
  AlertPanel,
  ArchPanel,
  CitizenPanel,
  DiffPanel,
  FarmerPanel,
  RoadmapPanel,
} from "@/components/panels-plus";
import {
  BlendPanel,
  ConfidencePanel,
  DeltaPanel,
  HowPanel,
  OverviewPanel,
  ScorePanel,
  WeightsPanel,
} from "@/components/panels-core";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS, PERIOD, type SectionId } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PANELS: Record<SectionId, ComponentType> = {
  overview: OverviewPanel,
  how: HowPanel,
  blend: BlendPanel,
  weights: WeightsPanel,
  confidence: ConfidencePanel,
  score: ScorePanel,
  delta: DeltaPanel,
  alert: AlertPanel,
  farmer: FarmerPanel,
  citizen: CitizenPanel,
  diff: DiffPanel,
  arch: ArchPanel,
  roadmap: RoadmapPanel,
  about: AboutPanel,
};

function SidebarNav({
  section,
  onSelect,
  labelledBy,
}: {
  section: SectionId;
  onSelect: (id: SectionId) => void;
  labelledBy: string;
}) {
  return (
    <nav className="flex flex-col gap-1" aria-labelledby={labelledBy}>
      {NAV_ITEMS.map((item) => {
        const active = item.id === section;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "min-h-11 rounded-xl px-3 py-2.5 text-left text-sm leading-snug transition-colors duration-150",
              active
                ? "bg-sidebar-active font-semibold text-sidebar-fg-active"
                : "font-medium text-sidebar-fg hover:bg-sidebar-hover hover:text-sidebar-fg-active",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function Brand({ titleId }: { titleId: string }) {
  return (
    <div className="border-b border-sidebar-fg/10 px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-accent/20 text-accent">
          <CloudRain className="size-5" strokeWidth={1.75} />
        </div>
        <div>
          <p
            id={titleId}
            className="text-sm font-semibold tracking-tight text-sidebar-fg-active"
          >
            AI-NWP Blend
          </p>
          <p className="text-2xs font-medium tracking-widest text-faint uppercase">
            SIH26081
          </p>
        </div>
      </div>
    </div>
  );
}

function SidebarBody({
  section,
  onSelect,
  titleId,
}: {
  section: SectionId;
  onSelect: (id: SectionId) => void;
  titleId: string;
}) {
  return (
    <>
      <Brand titleId={titleId} />
      <div className="scrollbar-sidebar flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav
          section={section}
          onSelect={onSelect}
          labelledBy={titleId}
        />
      </div>
      <div className="border-t border-sidebar-fg/10 px-5 py-4">
        <p className="text-2xs font-medium tracking-wide text-faint uppercase">
          Ministry of Earth Sciences
        </p>
        <p className="mt-1 text-xs text-sidebar-fg">Smart India Hackathon</p>
      </div>
    </>
  );
}

export function AppShell() {
  const titleId = useId();
  const drawerTitleId = useId();
  const [section, setSection] = useState<SectionId>("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("sih-section");
    if (saved && NAV_ITEMS.some((item) => item.id === saved)) {
      setSection(saved as SectionId);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sih-section", section);
  }, [section]);

  useEffect(() => {
    if (!drawerMounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerMounted]);

  function openDrawer() {
    setDrawerMounted(true);
    requestAnimationFrame(() => setDrawerOpen(true));
  }

  function closeDrawer() {
    setDrawerOpen(false);
    window.setTimeout(() => setDrawerMounted(false), 200);
  }

  function selectSection(id: SectionId) {
    setSection(id);
    if (drawerMounted) closeDrawer();
  }

  const Active = PANELS[section];
  const current = NAV_ITEMS.find((item) => item.id === section);

  return (
    <NavContext.Provider value={{ section, setSection: selectSection }}>
      <div className="flex h-dvh bg-canvas text-ink">
        <aside className="hidden h-full w-sidebar shrink-0 flex-col bg-sidebar lg:flex">
          <SidebarBody
            section={section}
            onSelect={selectSection}
            titleId={titleId}
          />
        </aside>

        {drawerMounted ? (
          <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
            <button
              type="button"
              aria-label="Close menu"
              className={cn(
                "absolute inset-0 bg-ink/40 transition-opacity duration-200",
                drawerOpen ? "opacity-100" : "opacity-0",
              )}
              onClick={closeDrawer}
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-labelledby={drawerTitleId}
              className={cn(
                "absolute inset-y-0 left-0 flex h-full w-sidebar flex-col bg-sidebar shadow-drawer transition-transform duration-200 ease-[var(--ease-smooth-out)]",
                drawerOpen ? "translate-x-0" : "-translate-x-full",
              )}
            >
              <button
                type="button"
                onClick={closeDrawer}
                className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-xl text-sidebar-fg hover:bg-sidebar-hover hover:text-sidebar-fg-active"
                aria-label="Close navigation"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
              <SidebarBody
                section={section}
                onSelect={selectSection}
                titleId={drawerTitleId}
              />
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-3 sm:px-5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={openDrawer}
              aria-label="Open navigation"
            >
              <Menu className="size-5" strokeWidth={1.75} />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {current?.label}
              </p>
              <p className="hidden truncate text-2xs text-muted sm:block">
                {PERIOD.city} · {PERIOD.issued}
              </p>
            </div>
            <span className="shrink-0 rounded-pill bg-med-soft px-2.5 py-1 text-2xs font-medium text-med">
              <span className="sm:hidden">Sample data</span>
              <span className="hidden sm:inline">
                Prototype Demo — Sample Data
              </span>
            </span>
          </header>
          <main className="scrollbar-thin flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            <Active />
          </main>
        </div>
      </div>
    </NavContext.Provider>
  );
}
