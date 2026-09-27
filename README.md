# 🌦️ Adaptive AI–NWP Weather Blending Platform

**Smart India Hackathon 2026 — Problem Statement SIH26081**
**Sponsoring Organization:** Ministry of Earth Sciences (MoES)
**Theme:** Disaster Management

> One accurate forecast, blended from the best model for every region, season, and moment.

![Status](https://img.shields.io/badge/status-prototype-orange)
![SIH](https://img.shields.io/badge/SIH-26081-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> **Prototype notice:** This repository currently contains an interactive front-end prototype backed by local sample data. Live forecast ingestion, adaptive scoring, operational alerts, and the backtesting claims below are planned capabilities, not verified production features.

---

## 📌 Problem Statement

Physical NWP models (GFS, ICON, NCUM), AI/ML weather models (ECMWF AIFS, GraphCast, Pangu-Weather), and ensemble forecasts each perform differently depending on **region, season, lead time, and weather regime** — no single source is reliably the best across all conditions.

Today, choosing which model to trust for a given day and place is a **manual judgment call** made by forecasters. This doesn't scale, isn't consistent, and risks under-weighting extreme-event signals when averaged naively.

**Our challenge:** build a framework that automatically assigns adaptive weights to each forecast source based on historical, measurable skill — and produces a blended forecast that provably outperforms any individual model, with full transparency into which source is trusted and why.

---

## 💡 Our Solution

An **adaptive blending engine** that:

1. Continuously tracks each model's recent accuracy (RMSE for temperature/wind, CSI/ETS for rainfall)
2. Splits time into rolling 10-day periods so weighting adapts within a season, not just across it
3. Computes skill-based weights per source, per variable, per period
4. Blends all sources into one forecast — with a confidence label and full explainability
5. Backtests every claim against a held-out year, so improvement is proven, not assumed

The prototype is centered on **Bhopal, Madhya Pradesh**. Its current screens use local sample data; live Open-Meteo ingestion and verified backtesting are not yet wired up. The proposed architecture is designed to scale to national coverage.

---

## ✨ Key Features

| Feature | What it does |
|---|---|
| **Adaptive Blending Engine** | Combines NWP + AI/ML + Ensemble forecasts using period- and variable-specific weights |
| **"Which Model to Trust?" Weight Map** | Visualizes current weight assigned to each source, per variable |
| **Confidence & Uncertainty Engine** | High/Medium/Low confidence label from model agreement + ensemble spread |
| **Forecast Accountability Score** | Backtested proof that the blend beats every individual model on unseen data |
| **"What Changed?" Delta View** | Shows how the forecast shifted since the last update |
| **Explainable Alert Card** | Plain-language what/when/risk/action for serious weather alerts |
| **Farmer Advisory Layer** | Crop-stage-specific sowing/irrigation/spray guidance from the blended output |
| **Citizen App Layer** | Location search, saved locations, threshold alerts, Hindi/English/Hinglish toggle |

**Differentiators:**
- 🗣️ Plain-language explainability (not just weight numbers — *why* a model was trusted)
- 🧑‍💻 Human-in-the-loop override with feedback learning
- 🩺 Model health & failure monitoring (auto-excludes stale/broken data feeds)

---

## 🏗️ Proposed Forecast Pipeline

```
Data Sources (NWP · AI/ML · Ensemble · ERA5)
        │
        ▼
Skill Scoring (RMSE for temp/wind · CSI/ETS for rainfall)
        │
        ▼
Adaptive Weight Computation (per 10-day period, per variable)
        │
        ▼
Bias Correction + Blending Engine
        │
        ▼
Confidence Scoring + Explainability Layer
        │
        ▼
Web app → Dashboard / Farmer Advisory / Citizen Views
```

**Weight formula:**
```
weight_i = (1 / error_i) ÷ Σ (1 / error_j)   for all models j
```

---

## 📊 Data Sources

| Source | Role |
|---|---|
| Open-Meteo Forecast API (GFS/ICON) | Planned physical NWP integration |
| Open-Meteo ECMWF API (ECMWF AIFS) | Planned AI/ML integration |
| Open-Meteo Ensemble API | Planned ensemble integration |
| Open-Meteo Historical + Previous Runs archive | Planned backtesting input |
| ERA5 Reanalysis (Copernicus CDS) | Planned ground-truth source |
| IMD station data (data.gov.in) | Optional local validation source |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, TanStack Start and TanStack Router
- **Build and styling:** Vite, Tailwind CSS
- **Charts:** Recharts
- **Prototype data:** Local sample data in `src/lib/mock-data.ts`
- **Optional app infrastructure:** Better Auth, PostgreSQL/PGlite

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/akshat-aetroiddestroyer/adaptive-ai-nwp-weather-blending-platform.git
cd adaptive-ai-nwp-weather-blending-platform

# Install dependencies
npm ci

# Start the prototype
npm run dev
```

Open the local URL printed by Vite. The app uses sample data and does not require API keys.

```bash
# Optional checks
npm run typecheck
npm test
```

---

## 📁 Project Structure

```
├── src/
│   ├── components/             # Dashboard panels and shared UI
│   ├── lib/mock-data.ts        # Sample forecast and score data
│   ├── routes/                 # TanStack Start routes
│   └── styles.css              # Global styles and design tokens
├── artifacts/                  # Project brief and generated illustrations
├── migrations/                 # Optional auth database schema
├── public/                     # Static app assets
├── screenshots/                # Prototype screenshots
├── scripts/                    # Build, test, and migration utilities
└── package.json
```

---

## 📈 Target Success Metrics

- Measurable skill improvement over every individual model on held-out data
- Weight tables shift across different 10-day periods as model skill changes
- Confidence labels correlate with actual forecast error
- Traceable path from blended forecast to confidence, alert, and farmer recommendation

---

## 🗺️ Roadmap

- [ ] National-scale rollout beyond Bhopal
- [ ] Weather-regime classifier (monsoon/western disturbance/cyclone patterns)
- [ ] Nowcasting extension (0–6 hr, radar/satellite/lightning)
- [ ] Marine, disaster-management, and travel-risk modules
- [ ] Voice-first advisory agent
- [ ] NDMA SACHET/CAP alert integration

---

## 👥 Team

*[Adaptive blending]
Om Tiwari - team leader
Akshat Balothiya - tech lead(AI/ML Engineer / Specialist)
Dev Khatre - forntend developer
Atharv Tiwari - backend developer
Uravshi upadhyay - RnD(Researcher / Domain Expert)
Anushka Nayak - UI/UX Designer & DevOps

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

*Built for Smart India Hackathon 2026 · SIH26081 · Ministry of Earth Sciences*
