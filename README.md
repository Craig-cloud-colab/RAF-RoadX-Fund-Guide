# RAF RoadX & Fund Guide

> **Version 1.0** — Educational and guidance tool for Road Accident Fund (RAF) claims in South Africa.

---

## ⚠️ Legal Disclaimer

This application is an **educational and guidance tool only**. It does **NOT** provide legal advice. Users are encouraged to consult a qualified attorney. The developers accept no liability for reliance on this tool.

---

## Overview

The RAF RoadX & Fund Guide walks users through the RAF claims process via a multi-step interactive flow:

1. **Welcome** – Introduction to the tool
2. **Eligibility Check** – Determines if the user qualifies for an RAF claim
3. **Claim Path Selection** – Attorney-assisted or direct RAF submission
4. **Claim Path Information** – Details about the chosen path
5. **Required Documents Checklist** – Interactive checklist of 7 required documents
6. **Types of Damages** – Educational overview of compensation categories
7. **Loss of Earnings Calculator** – Real-time calculator with sliders
8. **Claim Summary** – Displays calculated estimates
9. **RAF Process Flowchart** – 8-step visual process overview

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Context API | State management |

---

## Project Structure

```
src/
  components/
    Flow/           # FlowContainer, FlowStep, InfoStep, DecisionStep,
                    # ChoiceStep, ChecklistStep, CalculatorStep, SummaryStep, FlowchartStep
    Disclaimer/     # DisclaimerModal
    Common/         # Button, Slider, Input
  context/
    FlowContext.tsx # Global app state
  hooks/
    useFlow.ts      # Flow navigation and decisions
    useCalculator.ts# Calculator state
  types/
    flow.ts         # TypeScript type definitions
  data/
    flowConfig.ts   # Flow step configuration
  App.tsx
  main.tsx
  index.css
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Craig-cloud-colab/RAF-RoadX-Fund-Guide.git
cd RAF-RoadX-Fund-Guide

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Calculator Formulas

| Calculation | Formula |
|---|---|
| Past Loss | `monthly_income × months_off` |
| Future Loss | `(monthly_income × 12 × future_years) × (1 − contingency / 100)` |
| Total | `past_loss + future_loss` |

**Inputs:**
- Monthly Income (ZAR)
- Months Off Work (0–60)
- Years Affected (0–40)
- Contingency % (5–50%, default 15%)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please ensure all changes pass the TypeScript build (`npm run build`) before submitting.

---

## License

This project is for educational purposes. All content related to RAF claims is based on publicly available information and does not constitute legal advice.
