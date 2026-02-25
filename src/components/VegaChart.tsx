import { useEffect, useRef } from 'react'
import vegaEmbed from 'vega-embed'
import type { TopLevelSpec } from 'vega-lite'

interface VegaChartProps {
  spec: TopLevelSpec | null
  onMarkClick?: (datum: Record<string, unknown> | null, shiftKey: boolean) => void
}

export function VegaChart({ spec, onMarkClick }: VegaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onMarkClickRef = useRef(onMarkClick)
  onMarkClickRef.current = onMarkClick

  useEffect(() => {
    if (!containerRef.current || !spec) return
    const node = containerRef.current
    node.innerHTML = ''
    vegaEmbed(node, spec, { actions: false, renderer: 'svg' })
      .then((result) => {
        result.view.addEventListener('click', (event: unknown, item: unknown) => {
          const evt = event as MouseEvent
          const markItem = item as { datum?: unknown } | undefined
          const datum = markItem?.datum
          const handler = onMarkClickRef.current
          if (datum != null && typeof datum === 'object' && !Array.isArray(datum)) {
            handler?.(datum as Record<string, unknown>, evt.shiftKey === true)
          } else {
            handler?.(null, false)
          }
        })
      })
      .catch(console.error)
  }, [spec])

  if (!spec) {
    return (
      <div className="flex items-center justify-center w-full h-80 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
        Load a CSV and assign encodings to see the chart.
      </div>
    )
  }

  return <div ref={containerRef} className="vega-chart flex justify-center overflow-auto" />
}
