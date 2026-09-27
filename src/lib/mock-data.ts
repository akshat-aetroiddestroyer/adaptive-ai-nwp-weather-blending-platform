export type VariableKey = "rainfall" | "temperature" | "wind";
export type SourceKey = "nwp" | "ai" | "ens";

export const SOURCES: Record<
  SourceKey,
  { name: string; short: string; color: string }
> = {
  nwp: { name: "NWP · GFS / ICON", short: "NWP", color: "var(--color-nwp)" },
  ai: { name: "AI · ECMWF AIFS", short: "AI", color: "var(--color-ai)" },
  ens: { name: "Ensemble · IFS ENS", short: "Ensemble", color: "var(--color-ens)" },
};

export const VARIABLES: Record<
  VariableKey,
  { label: string; unit: string; caption: string }
> = {
  rainfall: { label: "Rainfall", unit: "mm", caption: "Next 24 hours" },
  temperature: { label: "Temperature", unit: "°C", caption: "Afternoon max" },
  wind: { label: "Wind", unit: "km/h", caption: "Sustained, NW" },
};

/** Adaptive weights for the active 10-day window (21–30 Sep, Bhopal). Sum to 100. */
export const WEIGHTS: Record<VariableKey, Record<SourceKey, number>> = {
  rainfall: { nwp: 20, ai: 48, ens: 32 },
  temperature: { nwp: 44, ai: 18, ens: 38 },
  wind: { nwp: 34, ai: 20, ens: 46 },
};

/** Individual model forecasts for Bhopal, issued 27 Sep 2026 12Z. */
export const MODEL_FORECASTS: Record<VariableKey, Record<SourceKey, number>> = {
  rainfall: { nwp: 47, ai: 33, ens: 40 },
  temperature: { nwp: 30.4, ai: 32.0, ens: 31.2 },
  wind: { nwp: 14, ai: 9, ens: 12 },
};

export function blendValue(variable: VariableKey): number {
  const w = WEIGHTS[variable];
  const v = MODEL_FORECASTS[variable];
  return (w.nwp * v.nwp + w.ai * v.ai + w.ens * v.ens) / 100;
}

export function formatBlend(variable: VariableKey): string {
  const value = blendValue(variable);
  if (variable === "temperature") return value.toFixed(1);
  return Math.round(value).toString();
}

export const PERIOD = {
  label: "21–30 September",
  city: "Bhopal, Madhya Pradesh",
  coords: "23.26°N · 77.41°E",
  issued: "27 Sep 2026, 17:30 IST",
  valid: "Next 24 hours from 28 Sep 00 IST",
  cycle: "12Z cycle",
};

export const CONFIDENCE = {
  rainfall: {
    level: "Medium" as const,
    range: "35–60 mm",
    point: formatBlend("rainfall"),
    unit: "mm",
    why: "AIFS and the ensemble agree on rain, but GFS is wetter — spread is wide enough to keep this at Medium, not High.",
  },
};

export const CSI_SKILL = [
  { name: "Blended", value: 0.71, kind: "blend" as const },
  { name: "Ensemble", value: 0.64, kind: "ens" as const },
  { name: "AI / AIFS", value: 0.62, kind: "ai" as const },
  { name: "NWP", value: 0.58, kind: "nwp" as const },
];

export const RMSE_TEMP = [
  { name: "Blended", value: 1.12, kind: "blend" as const },
  { name: "Ensemble", value: 1.39, kind: "ens" as const },
  { name: "NWP", value: 1.48, kind: "nwp" as const },
  { name: "AI / AIFS", value: 1.61, kind: "ai" as const },
];

export const RMSE_WIND = [
  { name: "Blended", value: 1.4 },
  { name: "Ensemble", value: 1.7 },
  { name: "NWP", value: 1.9 },
  { name: "AI / AIFS", value: 2.2 },
];

export const DELTA = {
  previous: { rainfall: 28, issued: "26 Sep, 17:30 IST" },
  current: { rainfall: Number(formatBlend("rainfall")), issued: PERIOD.issued },
  reason:
    "AIFS raised 24-hour QPF after the 12Z cycle. The blend followed — not a silent jump.",
};

export const ALERT = {
  app: "AI-NWP Blend",
  title: "Heavy rain likely — Bhopal urban",
  what: "35–60 mm of rain, locally heavier in low-lying wards.",
  when: "Tomorrow, 28 Sep · 14:00–22:00 IST",
  risk: "Medium",
  action: "Postpone outdoor work after lunch. Cover stored grain and keep drainage clear.",
};

export const FARMER = {
  name: "Ramesh Patel",
  village: "Berkhedi, Phanda block",
  crop: "Soybean",
  stage: "Flowering (R2)",
  plot: "1.8 ha, rainfed",
};

export const ADVISORIES = [
  {
    title: "Hold the spray",
    body: "Skip fungicide tomorrow. Rain will wash it off. Next dry window: 30 Sep morning.",
    tone: "warn" as const,
  },
  {
    title: "Skip irrigation",
    body: "38 mm incoming is enough soil moisture for flowering soybean. Save the pumping cost.",
    tone: "ok" as const,
  },
  {
    title: "Watch waterlogging",
    body: "Low plots along the field drain may pond. Walk the bunds after the evening cell.",
    tone: "info" as const,
  },
];

export const CITIZEN_FEATURES = [
  {
    id: "search",
    title: "Location search",
    body: "City, village, district, or a map pin. Prototype is locked to the Bhopal demo.",
  },
  {
    id: "saved",
    title: "Saved locations",
    body: "Home, work, village, and family pins — each with its own alert threshold.",
  },
  {
    id: "push",
    title: "Push notifications",
    body: "Rain % and heatwave thresholds, delivered per saved location, not as a city blast.",
  },
  {
    id: "lang",
    title: "Language toggle",
    body: "English, Hindi, or Hinglish — same forecast, spoken the way the user reads.",
  },
];

export const SAVED_LOCATIONS = [
  { name: "Bhopal — Home", hint: "Arera Colony" },
  { name: "Hoshangabad", hint: "Family" },
  { name: "Indore", hint: "Travel" },
];

export const LANG_SAMPLE: Record<"en" | "hi" | "hinglish", string> = {
  en: "38 mm of rain expected in Bhopal tomorrow. Medium confidence.",
  hi: "भोपाल में कल 38 मिमी बारिश की संभावना है। मध्यम विश्वास।",
  hinglish: "Bhopal mein kal 38 mm baarish expected hai. Medium confidence.",
};

export const SEARCH_PLACES = [
  "Bhopal",
  "Berasia",
  "Sehore",
  "Raisen",
  "Hoshangabad",
  "Vidisha",
];

export const ROADMAP = [
  {
    title: "Marine module",
    body: "Wave, swell, and tide with a Go / Caution / No-Go trip card.",
  },
  {
    title: "Disaster-management dashboard",
    body: "Multi-hazard mapping and resource planning for district authorities.",
  },
  {
    title: "Travel Weather Guardian",
    body: "Route-aware risk monitoring for a planned road or rail journey.",
  },
  {
    title: "Voice advisory agent",
    body: "Local-language voice Q&A that speaks the confidence label out loud.",
  },
  {
    title: "Multi-hazard chaining",
    body: "Rain to flood to landslide — one event triggering the next, in one view.",
  },
  {
    title: "National scale-up",
    body: "Same engine, many cities. Bhopal is the proof; India is the target.",
  },
];

export const FLOW_STEPS = [
  {
    n: "01",
    title: "Ingest data",
    body: "Pull NWP, AIFS, ensemble, and ERA5 truth for Bhopal from Open-Meteo.",
  },
  {
    n: "02",
    title: "Score recent skill",
    body: "RMSE for temperature and wind. CSI for rainfall. One score per 10-day window.",
  },
  {
    n: "03",
    title: "Compute weights",
    body: "Invert error, normalize to 100%. A wet week does not reuse a dry week’s mix.",
  },
  {
    n: "04",
    title: "Blend the forecast",
    body: "One number, a range, and a High / Medium / Low label the user can act on.",
  },
];

export const ARCH_STEPS = [
  { n: "01", title: "Data sources" },
  { n: "02", title: "Skill scoring" },
  { n: "03", title: "Adaptive weighting" },
  { n: "04", title: "Blending engine" },
  { n: "05", title: "API" },
  { n: "06", title: "Dashboard" },
];

export const MODEL_CARDS = [
  {
    title: "NWP models",
    strength: "Physics you can trust in well-observed, large-scale regimes.",
    weakness: "Miss convective bursts and local orography that Bhopal actually gets.",
    source: "GFS / ICON via Open-Meteo",
  },
  {
    title: "AI / ML models",
    strength: "Fast, sharp on recent patterns — AIFS often leads short-range rain.",
    weakness: "Can drift in rare regimes the training years barely saw.",
    source: "ECMWF AIFS",
  },
  {
    title: "Ensemble models",
    strength: "Spread is a built-in uncertainty signal, not a guess after the fact.",
    weakness: "The mean is safe, and safety is sometimes too dry or too calm.",
    source: "IFS ENS / GFS ENS",
  },
];

export const DIFFERENTIATORS = [
  {
    title: "Plain-language explainability",
    body: "Every product surface can answer “who did we trust, and why” without a methods paper.",
  },
  {
    title: "Human-in-the-loop override",
    body: "A duty forecaster can pin a source or freeze a weight. The blend never silently overrules a human.",
  },
  {
    title: "Model health monitoring",
    body: "Stale ingest, missing members, or a skill crash shows up as a health chip — not a wrong map.",
  },
];

export const NAV_ITEMS = [
  { id: "overview", label: "Overview & Problem" },
  { id: "how", label: "How It Works" },
  { id: "blend", label: "Blending Engine" },
  { id: "weights", label: "Weight Map" },
  { id: "confidence", label: "Confidence" },
  { id: "score", label: "Accountability" },
  { id: "delta", label: "What Changed" },
  { id: "alert", label: "Alert Card" },
  { id: "farmer", label: "Farmer Advisory" },
  { id: "citizen", label: "Citizen App" },
  { id: "diff", label: "What Makes This Different" },
  { id: "arch", label: "Architecture" },
  { id: "roadmap", label: "Roadmap" },
  { id: "about", label: "About / Team" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];
