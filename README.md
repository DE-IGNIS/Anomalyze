<div align="center" id="top"> 
  <img src="./.github/app.gif" alt="Anomalyze" />
</div>

<h1 align="center">Anomalyze</h1>

<p align="center">
  <img src="https://img.shields.io/github/stars/DE-IGNIS/Anomalyze">
  <img src="https://img.shields.io/github/forks/DE-IGNIS/Anomalyze">
  <img src="https://img.shields.io/github/issues/DE-IGNIS/Anomalyze">
  <img alt="License" src="https://img.shields.io/github/license/DE-IGNIS/anomalyze?color=56BEB8">
</p>

<p align="center">
  <a href="#dart-about">About</a> • 
  <a href="#brain-problem-statement">Problem</a> •
  <a href="#sparkles-features">Features</a> • 
  <a href="#gear-architecture">Architecture</a> •
  <a href="#rocket-technologies">Technologies</a> • 
  <a href="#white_check_mark-requirements">Requirements</a> • 
  <a href="#checkered_flag-starting">Getting Started</a> • 
  <a href="#chart-future-scope">Future Scope</a> •
  <a href="#memo-license">License</a>
</p>

---

## :dart: About

**Anomalyze** is a real-time anomaly detection system built to assist banking professionals in identifying suspicious financial activities.

The platform analyzes transactions using predefined and extensible rules, flags anomalies instantly, and presents actionable insights through a clean and intuitive interface.

It is designed with scalability, clarity, and decision support in mind making it easier for bank employees to investigate, validate, and act on financial irregularities.

---

## :brain: Problem Statement

How can a bank automatically detect tampering, inconsistencies, or potential forgery in financial statements in real time, and generate intelligent insights to enable faster and more reliable underwriting decisions?

---

## :sparkles: Features

:heavy_check_mark: Real-time transaction anomaly detection  
:heavy_check_mark: Rule-based analysis engine (bank-configurable)  
:heavy_check_mark: Clean and intuitive mobile interface  
:heavy_check_mark: Transaction history tracking for investigations  
:heavy_check_mark: Insight generation for decision support  
:heavy_check_mark: Report generation system  
:heavy_check_mark: Scalable architecture for future integrations

---

## :gear: Architecture

The system is designed with a modular and scalable architecture:

- **Frontend (Mobile App)**  
  Built using React Native (Expo), providing a smooth and responsive UI for bank employees.

- **Backend API**  
  Handles transaction processing, rule evaluation, and anomaly detection logic.

- **Data Layer**  
  Stores transaction history and flagged anomalies for audit and investigation.

- **Rule Engine**  
  Core logic that evaluates transactions based on predefined or dynamic rules.

---

## :rocket: Technologies

The following tools were used in this project:

- Expo
- React Native
- React
- Node.js
- TypeScript

---

## :white_check_mark: Requirements

Before starting, ensure you have the following installed:

- Git
- Node.js
- Yarn or npm

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/DE-IGNIS/NoteSphere.git
cd NoteSphere
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Supabase

- Create a project on Supabase
- Get your **Project URL** and **Anon Key**
- Create a `.env` file in the root:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

---

:chart_with_upwards_trend: Future Scope
AI/ML-based anomaly detection (beyond rule-based systems)
Integration with banking APIs and financial data providers
Fraud risk scoring system
Real-time alerts and notifications
Dashboard for analytics and trends
Role-based access control for enterprise usage

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License · Copyright (c) 2026 DARSYN
```

<div align="center"> Made with ❤️ by <a href="https://github.com/DE-IGNIS" target="_blank">Darsyn</a> </div>

<a href="#top">Back to top</a>
