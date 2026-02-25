import { useCallback, useMemo, useState } from 'react'
import { LeftPanel } from './components/LeftPanel'
import { VegaChart } from './components/VegaChart'
import { buildVegaLiteSpec } from './utils/vegaSpec'
import type { VizState, EncodingState, DataField, ChartType, BarLayout, EncodingAggregation, EncodingSortDirection } from './types'

function datumKey(d: Record<string, unknown>): string {
  return JSON.stringify(d)
}

const initialEncoding: EncodingState = {
  x: null,
  y: null,
  color: null,
  size: null,
}

const initialAggregation: EncodingAggregation = {}
const initialEncodingSort: VizState['encodingSort'] = {}

const initialState: VizState = {
  data: null,
  fields: [],
  chartType: 'bar',
  encoding: { ...initialEncoding },
  aggregation: initialAggregation,
  barLayout: 'group',
  encodingSort: initialEncodingSort,
}

export default function App() {
  const [state, setState] = useState<VizState>(initialState)
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Record<string, unknown>[]>([])

  const onDataLoad = useCallback((data: Record<string, unknown>[], fields: DataField[], fileName: string) => {
    setState((s) => ({
      ...s,
      data,
      fields,
      encoding: { ...initialEncoding },
      aggregation: initialAggregation,
      encodingSort: initialEncodingSort,
    }))
    setLoadedFileName(fileName)
  }, [])

  const onChartTypeChange = useCallback((chartType: ChartType) => {
    setState((s) => ({ ...s, chartType }))
    setSelectedItems([])
  }, [])

  const onEncodingChange = useCallback((key: keyof EncodingState, value: string | null) => {
    setState((s) => ({
      ...s,
      encoding: { ...s.encoding, [key]: value },
    }))
    setSelectedItems([])
  }, [])

  const onAggregationChange = useCallback((key: keyof EncodingState, value: EncodingAggregation[keyof EncodingState]) => {
    setState((s) => ({
      ...s,
      aggregation: { ...s.aggregation, [key]: value ?? undefined },
    }))
    setSelectedItems([])
  }, [])

  const onBarLayoutChange = useCallback((barLayout: BarLayout) => {
    setState((s) => ({ ...s, barLayout }))
  }, [])

  const onSortChange = useCallback((key: 'x' | 'y', direction: EncodingSortDirection) => {
    setState((s) => ({
      ...s,
      encodingSort: { ...s.encodingSort, [key]: direction },
    }))
  }, [])

  const onMarkClick = useCallback((datum: Record<string, unknown> | null, shiftKey: boolean) => {
    if (datum == null) {
      setSelectedItems([])
      return
    }
    setSelectedItems((prev) => {
      const key = datumKey(datum)
      const idx = prev.findIndex((d) => datumKey(d) === key)
      if (shiftKey) {
        // Multi-select: toggle this mark in the list
        if (idx >= 0) return prev.filter((_, i) => i !== idx)
        return [...prev, datum]
      }
      // Single-select: array has 0 or 1 item. Click same mark -> clear; else -> just this mark
      if (idx >= 0 && prev.length === 1) return []
      return [datum]
    })
  }, [])

  const onPrintSelection = useCallback(() => {
    console.log(selectedItems)
  }, [selectedItems])

  // Memoize spec so it only changes when viz state changes—not when selectedItems changes.
  // Otherwise the chart re-embeds on every click and Vega's selection highlight is lost.
  const spec = useMemo(() => buildVegaLiteSpec(state), [state])

  const onLogSpec = useCallback(() => {
    console.log(spec)
  }, [spec])

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="shrink-0 h-14 flex items-center px-6 border-b border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800 font-sans">TabLite</h1>
      </header>
      <div className="flex-1 flex min-h-0">
        <LeftPanel
          state={state}
          loadedFileName={loadedFileName}
          selectedCount={selectedItems.length}
          onPrintSelection={onPrintSelection}
          onLogSpec={onLogSpec}
          onSortChange={onSortChange}
          onDataLoad={onDataLoad}
          onChartTypeChange={onChartTypeChange}
          onEncodingChange={onEncodingChange}
          onAggregationChange={onAggregationChange}
          onBarLayoutChange={onBarLayoutChange}
        />
        <main className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <VegaChart spec={spec} onMarkClick={onMarkClick} />
        </main>
      </div>
    </div>
  )
}
