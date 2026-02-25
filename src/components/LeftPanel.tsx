import { FileUpload } from './FileUpload'
import { ChartTypeSelect } from './ChartTypeSelect'
import { EncodingChannel } from './EncodingChannel'
import { BarLayoutOptions } from './BarLayoutOptions'
import type { VizState } from '../types'

interface LeftPanelProps {
  state: VizState
  loadedFileName: string | null
  selectedCount: number
  onPrintSelection: () => void
  onLogSpec: () => void
  onSortChange: (key: 'x' | 'y', direction: import('../types').EncodingSortDirection) => void
  onDataLoad: (data: Record<string, unknown>[], fields: import('../types').DataField[], fileName: string) => void
  onChartTypeChange: (t: VizState['chartType']) => void
  onEncodingChange: (key: keyof VizState['encoding'], value: string | null) => void
  onAggregationChange: (key: keyof VizState['encoding'], value: import('../types').Aggregation) => void
  onBarLayoutChange: (v: VizState['barLayout']) => void
}

export function LeftPanel({
  state,
  loadedFileName,
  selectedCount,
  onPrintSelection,
  onLogSpec,
  onSortChange,
  onDataLoad,
  onChartTypeChange,
  onEncodingChange,
  onAggregationChange,
  onBarLayoutChange,
}: LeftPanelProps) {
  const { fields, chartType, encoding, aggregation, barLayout, encodingSort } = state
  const hasData = fields.length > 0

  return (
    <aside className="w-72 shrink-0 flex flex-col gap-5 p-4 bg-panel-bg border-r border-panel-border overflow-y-auto">
      {/* Top: minimal single-row data + chart type */}
      <div className="space-y-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Data</span>
        </div>
        <FileUpload onLoad={onDataLoad} currentFile={loadedFileName} />
      </div>

      {hasData && (
        <>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Chart type</h2>
            <ChartTypeSelect value={chartType} onChange={onChartTypeChange} />
          </div>

          <div className="flex-1 min-h-0">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Encoding</h2>
            <div className="space-y-3">
              <EncodingChannel
                label="X"
                value={encoding.x}
                aggregation={aggregation.x ?? null}
                fields={fields}
                onChange={(v) => onEncodingChange('x', v)}
                onAggregationChange={(a) => onAggregationChange('x', a)}
                sort={encodingSort.x ?? null}
                onSortChange={(d) => onSortChange('x', d)}
              />
              <EncodingChannel
                label="Y"
                value={encoding.y}
                aggregation={aggregation.y ?? null}
                fields={fields}
                onChange={(v) => onEncodingChange('y', v)}
                onAggregationChange={(a) => onAggregationChange('y', a)}
                sort={encodingSort.y ?? null}
                onSortChange={(d) => onSortChange('y', d)}
              />
              <EncodingChannel
                label="Color"
                value={encoding.color}
                aggregation={aggregation.color ?? null}
                fields={fields}
                onChange={(v) => onEncodingChange('color', v)}
                onAggregationChange={(a) => onAggregationChange('color', a)}
              />
              {(chartType === 'scatter' || chartType === 'line') && (
                <EncodingChannel
                  label="Size"
                  value={encoding.size}
                  aggregation={aggregation.size ?? null}
                  fields={fields}
                  onChange={(v) => onEncodingChange('size', v)}
                  onAggregationChange={(a) => onAggregationChange('size', a)}
                />
              )}
            </div>
            {chartType === 'bar' && (
              <div className="mt-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Bar layout</h2>
                <BarLayoutOptions value={barLayout} onChange={onBarLayoutChange} />
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-panel-border shrink-0 space-y-2">
            <button
              type="button"
              onClick={onPrintSelection}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              Print selection ({selectedCount})
            </button>
            <button
              type="button"
              onClick={onLogSpec}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              Log Vega-Lite spec
            </button>
          </div>
        </>
      )}
    </aside>
  )
}
