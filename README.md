# TabLite

A Tableau-like data visualization authoring app built with Vite, React, TypeScript, Tailwind CSS, and Vega-Lite.

<img width="1331" height="788" alt="Screenshot 2026-02-27 at 3 09 24 PM" src="https://github.com/user-attachments/assets/d08931f5-c834-4614-a863-54b538172189" />

## Features

- **CSV upload** – Load your data from CSV files; columns are auto-classified as categorical, numerical, or date.
- **Chart types** – Bar, scatter, and line charts.
- **Encoding channels** – Map fields to X, Y, Color, and (for scatter/line) Size. Field types are shown with icons.
- **Bar layout** – For bar charts with a color encoding: Group, Stack, or Normalize (100%).
- **Vega-Lite** – All charts are rendered with Vega-Lite for consistent, declarative specs.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output is in `dist/`.
