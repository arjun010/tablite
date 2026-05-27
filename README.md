# TabLite

A Tableau-like data visualization authoring app built with Vite, React, TypeScript, Tailwind CSS, and Vega-Lite.

Demo: [https://arjun010.github.io/tablite](https://arjun010.github.io/tablite)

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