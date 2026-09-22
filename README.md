# 🇵🇭 Philippine CPALE Reviewer & Practice Portal (MERN Stack)

A modern full-stack web application designed for the **Philippine Certified Public Accountant Licensure Examination (CPALE)**.

Includes a comprehensive **50-item question bank** with step-by-step mathematical computations, Philippine statutory legal citations, and official Board of Accountancy (PRC BOA) rating standards.

---

## 🌟 Key Features

* **50 Curated Mock Exam Questions** across all 6 CPALE subjects:
  * **FAR** — Financial Accounting and Reporting (10 items)
  * **AFAR** — Advanced Financial Accounting and Reporting (10 items)
  * **MAS** — Management Advisory Services (8 items)
  * **AUD** — Auditing (8 items)
  * **TAX** — Taxation (7 items)
  * **RFBT** — Regulatory Framework for Business Transactions (7 items)
* **Exam Modes**:
  * 🎓 **Mock Board Exam Mode**: Timed 3-hour exam with flagged questions and official CPALE Board passing rating ($\ge 75\%$ average with no subject $< 65\%$).
  * ⚡ **Self-Paced Practice Mode**: Instant answer checking with step-by-step solutions and legal citations.
  * 🎯 **Subject Drill Mode**: Filter by subject or topic.
* **Examinee Results & Submissions Archive**:
  * Save and browse all past submissions by examinee name.
  * Inspect every question answered: selected choice vs. correct answer, color-coded explanations, full mathematical solutions, and Philippine legal basis.
* **Built-in Financial & Tax Calculator**: Real-time scratchpad with arithmetic solver.

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Server
```bash
# Start backend API (Port 5001)
npm run server

# In another terminal, start React frontend (Port 3000)
npm run dev
```

---

## ☁️ Deploying to Vercel

This repository is pre-configured with `vercel.json` for **1-click Vercel deployment**:

1. Import this repository into **[Vercel](https://vercel.com)**.
2. (Optional) Set `MONGO_URI` in Environment Variables if using MongoDB Atlas. If omitted, the app will run with the built-in high-performance storage.
3. Click **Deploy**!
