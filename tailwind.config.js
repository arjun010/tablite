/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        panel: {
          bg: 'rgb(248 250 252)',
          border: 'rgb(226 232 240)',
          accent: 'rgb(99 102 241)',
        },
      },
    },
  },
  plugins: [],
}
