import { useState, useRef, useEffect } from 'react'
import type { ChartType } from '../types'

// Sorted alphabetically by label
const options: { value: ChartType; label: string; icon: React.ReactNode }[] = [
  {
    value: 'bar',
    label: 'Bar',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M3 13h2v6H3v-6zm4 2h2v4H7v-4zm4-6h2v10h-2V9zm4 4h2v6h-2v-6z" />
      </svg>
    ),
  },
  {
    value: 'line',
    label: 'Line',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4" />
      </svg>
    ),
  },
  {
    value: 'scatter',
    label: 'Scatter',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <circle cx="8" cy="8" r="2.5" />
        <circle cx="16" cy="14" r="2.5" />
        <circle cx="12" cy="6" r="2" />
        <circle cx="6" cy="16" r="2" />
      </svg>
    ),
  },
]

interface ChartTypeSelectProps {
  value: ChartType
  onChange: (t: ChartType) => void
}

export function ChartTypeSelect({ value, onChange }: ChartTypeSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-left shadow-sm hover:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
      >
        <span className="text-slate-500">{current.icon}</span>
        <span>{current.label}</span>
        <svg className="w-4 h-4 ml-auto text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-100 ${value === opt.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-800'}`}
            >
              <span className="text-slate-500">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
