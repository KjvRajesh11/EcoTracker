# 🌱 EcoTracker – Green Tech Impact Platform

EcoTracker is a **privacy-first, local-first GreenTech web application** that helps individuals and communities **measure, understand, and reduce their environmental impact** using transparent calculations and actionable insights.

Built with a clean modular architecture, EcoTracker focuses on **carbon footprint, water usage, waste habits, and sustainability challenges**, designed for hackathons, policy demos, and real-world adoption.

---

## 🚀 Live Overview

EcoTracker enables users to:
- Track daily **carbon emissions**
- Measure **water consumption & stress**
- Monitor **waste segregation habits**
- Visualize impact through dashboards
- Participate in **eco-challenges & streaks**
- Use the app **without accounts or cloud tracking**

> **Privacy-first by design** — all data stays on the user’s device (local storage).

---

## 🎯 Problem Statement

Most sustainability apps:
- Are data-heavy and cloud-dependent
- Do not explain *why* impact is high
- Ignore local context (city, region, lifestyle)

**EcoTracker solves this by:**
- Using transparent calculation logic
- Supporting region-based benchmarks
- Encouraging habit change via challenges, not guilt

---

## 🧠 Key Features

### 🌍 Carbon Tracking
- Transport emissions (car, bus, bike, walking)
- Electricity & LPG usage
- Daily & aggregated footprint calculation

### 💧 Water Impact Analysis
- Showers, laundry, dishwashing, cooking
- Water stress indicators
- Per-day and per-month insights

### ♻️ Waste & Habits
- Plastic avoided
- Reusables used
- Segregation score
- Habit streak tracking

### 🏆 Challenges & Gamification
- Eco challenges (bike commute, no-plastic day, etc.)
- Streaks and progress motivation
- Community-ready architecture

### 🔐 Privacy-First Login
- Lightweight local login (no backend required)
- No personal data collection
- Designed for policy and public demos

---

## 🏗️ Tech Stack

- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** CSS / Utility-first classes
- **State:** React hooks + local storage
- **Charts:** Recharts
- **Architecture:** Modular & scalable
- **AI Assistance:** Google AI Studio (for rapid prototyping)

---

## 📁 Project Structure
src/
├── components/ # Reusable UI components
│ └── common/
├── pages/ # App-level pages (Login, Dashboard, etc.)
├── views/ # Feature views (Carbon, Water, Waste)
├── utils/ # Calculation & logic helpers
├── constants/ # Emission & benchmark constants
├── types/ # TypeScript data models
├── context/ # Global app context
├── App.tsx
├── main.tsx


---

## 🧮 Transparent Calculations

All environmental impact calculations are:
- Fully visible in code
- Based on standard emission & water factors
- Easy to audit or extend

This makes EcoTracker suitable for:
- Hackathons
- Research demos
- Policy simulations
- Educational use

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Installation
```bash
npm install
npm run dev

---

## 📄 License

MIT License — free to use, modify, and extend.
