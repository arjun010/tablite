import type { BarLayout } from '../types'

// Sorted alphabetically by label
const options: { value: BarLayout; label: string }[] = [
  { value: 'group', label: 'Group' },  
  { value: 'stack', label: 'Stack' },
  { value: 'normalize', label: 'Normalize (100%)' },
]

interface BarLayoutOptionsProps {
  value: BarLayout
  onChange: (v: BarLayout) => void
}

export function BarLayoutOptions({ value, onChange }: BarLayoutOptionsProps) {
  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as BarLayout)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
