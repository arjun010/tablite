import { useState, useRef, useEffect } from 'react'
import { ArrowDown, ArrowUp, MoreVertical, X } from 'lucide-react'
import { FieldIcon } from './FieldIcon'
import type { DataField, Aggregation, EncodingSortDirection } from '../types'

// Sorted alphabetically by label
const AGG_OPTIONS: { value: Aggregation; label: string }[] = [
  { value: null, label: 'None' },
  { value: 'avg', label: 'Average' },
  { value: 'sum', label: 'Sum' },
]

interface EncodingChannelProps {
  label: string
  value: string | null
  aggregation: Aggregation
  fields: DataField[]
  onChange: (field: string | null) => void
  onAggregationChange: (agg: Aggregation) => void
  /** When set, show sort menu (vertical ellipsis). Only used for x/y. */
  sort?: EncodingSortDirection
  onSortChange?: (direction: EncodingSortDirection) => void
  placeholder?: string
}

const sortedFields = (fields: DataField[]) =>
  [...fields].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

export function EncodingChannel({
  label,
  value,
  aggregation,
  fields,
  onChange,
  onAggregationChange,
  sort,
  onSortChange,
  placeholder = 'Select field',
}: EncodingChannelProps) {
  const [open, setOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const fieldsSorted = sortedFields(fields)
  const searchLower = search.trim().toLowerCase()
  const filteredFields = searchLower
    ? fieldsSorted.filter((f) => f.name.toLowerCase().includes(searchLower))
    : fieldsSorted
  const selected = value ? fields.find((f) => f.name === value) : null
  const showAggregation = selected?.type === 'numerical'

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    if (open || sortOpen) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open, sortOpen])

  useEffect(() => {
    if (open) {
      setSearch('')
      queueMicrotask(() => searchInputRef.current?.focus())
    }
  }, [open])

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex items-center justify-between gap-1">
        <label className="block text-xs font-medium text-slate-600">{label}</label>
        {onSortChange != null && (
          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              title="Sort options"
              aria-label="Sort options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {sortOpen && (
              <div
                className="absolute z-20 right-0 mt-1 py-1.5 rounded-lg border border-slate-200 bg-white shadow-lg min-w-[10rem]"
                role="tooltip"
              >
                <div className="px-2.5 py-1 text-xs font-medium text-slate-500 border-b border-slate-100">Sort</div>
                <button
                  type="button"
                  onClick={() => { onSortChange('ascending'); setSortOpen(false) }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 text-sm text-left hover:bg-slate-100 ${sort === 'ascending' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
                >
                  <ArrowUp className="w-4 h-4 shrink-0" />
                  Ascending
                </button>
                <button
                  type="button"
                  onClick={() => { onSortChange('descending'); setSortOpen(false) }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 text-sm text-left hover:bg-slate-100 ${sort === 'descending' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
                >
                  <ArrowDown className="w-4 h-4 shrink-0" />
                  Descending
                </button>
                <button
                  type="button"
                  onClick={() => { onSortChange(null); setSortOpen(false) }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 text-sm text-left hover:bg-slate-100 ${sort == null ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'}`}
                >
                  Auto
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-2">
      {showAggregation && (
          <select
            value={aggregation ?? ''}
            onChange={(e) => onAggregationChange((e.target.value || null) as Aggregation)}
            className="shrink-0 w-24 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
            title="Aggregation"
          >
            {AGG_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-left shadow-sm hover:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 min-h-[36px]"
          >
            {selected ? (
              <>
                <FieldIcon type={selected.type} />
                <span className="truncate">{selected.name}</span>
              </>
            ) : (
              <span className="text-slate-500">{placeholder}</span>
            )}
            <svg className="w-4 h-4 ml-auto text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-64 overflow-hidden flex flex-col">
              <div className="p-2 border-b border-slate-100 shrink-0">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Search fields..."
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="py-1 overflow-auto max-h-48">
                <button
                  type="button"
                  onClick={() => {
                    onChange(null)
                    setOpen(false)
                  }}
                  className="w-full px-3 py-2 text-sm text-left text-slate-500 hover:bg-slate-100"
                >
                  {placeholder}
                </button>
                {filteredFields.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => {
                      onChange(f.name)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-100 ${value === f.name ? 'bg-indigo-50 text-indigo-700' : 'text-slate-800'}`}
                  >
                    <FieldIcon type={f.type} />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
                {filteredFields.length === 0 && (
                  <div className="px-3 py-2 text-sm text-slate-500">No matching fields</div>
                )}
              </div>
            </div>
          )}
        </div>        
      </div>
    </div>
  )
}
