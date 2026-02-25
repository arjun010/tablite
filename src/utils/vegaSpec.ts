import type { VizState } from '../types'
import type { TopLevelSpec } from 'vega-lite'

const VL_AGG: Record<NonNullable<import('../types').Aggregation>, string> = {
  sum: 'sum',
  avg: 'mean',
}

export function buildVegaLiteSpec(state: VizState): TopLevelSpec | null {
  const { data, fields, chartType, encoding: enc, aggregation: agg, barLayout, encodingSort } = state
  if (!data || data.length === 0) return null

  const fieldType = (name: string) => fields.find((f) => f.name === name)?.type ?? 'categorical'
  const isNumerical = (name: string) => fieldType(name) === 'numerical'
  const isCategoricalOrDate = (name: string) => !isNumerical(name)

  const vlEncoding: Record<string, unknown> = {}

  const encWithAgg = (
    key: keyof typeof enc,
    field: string,
    title?: string
  ): Record<string, unknown> => {
    const type =
      fieldType(field) === 'numerical'
        ? 'quantitative'
        : fieldType(field) === 'date'
          ? 'temporal'
          : fieldType(field) === 'ordinal'
            ? 'ordinal'
            : 'nominal'
    const base: Record<string, unknown> = {
      field,
      type,
      title: title ?? field,
    }
    const a = agg[key]
    if (a && isNumerical(field)) base.aggregate = VL_AGG[a]
    if (type === 'quantitative') base.axis = { format: '.2s' }
    return base
  }

  const sortByEncoding = (channel: 'x' | 'y', order: 'ascending' | 'descending' | null) =>
    order === 'descending' ? `-${channel}` : channel

  if (enc.x) {
    const xEnc = encWithAgg('x', enc.x, enc.x) as Record<string, unknown>
    if (encodingSort?.y && isNumerical(enc.y!) && isCategoricalOrDate(enc.x)) {
      xEnc.sort = sortByEncoding('y', encodingSort.y)
    } else if (encodingSort?.x) {
      xEnc.sort = encodingSort.x
    }
    if (encodingSort?.x && isNumerical(enc.x!) && isCategoricalOrDate(enc.y!)) {
      xEnc.scale = { reverse: false }
    }
    vlEncoding.x = xEnc
  }
  if (enc.y) {
    const yEnc = encWithAgg('y', enc.y, enc.y) as Record<string, unknown>
    if (chartType === 'bar' && enc.color) {
      yEnc.stack = barLayout === 'group' ? null : barLayout === 'normalize' ? 'normalize' : 'zero'
    }
    if (encodingSort?.x && isNumerical(enc.x!) && isCategoricalOrDate(enc.y)) {
      yEnc.sort = sortByEncoding('x', encodingSort.x)
    } else if (encodingSort?.y) {
      yEnc.sort = encodingSort.y
    }
    if (encodingSort?.y && isNumerical(enc.y!) && isCategoricalOrDate(enc.x!)) {
      yEnc.scale = { reverse: false }
    }
    vlEncoding.y = yEnc
  }
  if (enc.color) {
    vlEncoding.color = encWithAgg('color', enc.color, enc.color)
    // Grouped bar layout: use xOffset so bars are side-by-side per category (Vega-Lite grouped bar pattern).
    if (chartType === 'bar' && barLayout === 'group') {
      vlEncoding.xOffset = { field: enc.color }
    }
  }
  if (enc.size && (chartType === 'scatter' || chartType === 'line')) {
    vlEncoding.size = encWithAgg('size', enc.size, enc.size)
  }

  // Tooltips: include all encoded fields
  const tooltipFields: Record<string, unknown>[] = []
  if (enc.x) tooltipFields.push(encWithAgg('x', enc.x, enc.x))
  if (enc.y) tooltipFields.push(encWithAgg('y', enc.y, enc.y))
  if (enc.color) tooltipFields.push(encWithAgg('color', enc.color, enc.color))
  if (enc.size && (chartType === 'scatter' || chartType === 'line')) {
    tooltipFields.push(encWithAgg('size', enc.size, enc.size))
  }
  if (tooltipFields.length > 0) {
    vlEncoding.tooltip = tooltipFields
  }

  // When nothing selected, all marks full opacity (1). When something selected, unselected fade to 0.3.
  vlEncoding.fillOpacity = {
    condition: { param: 'select', value: 1 },
    value: 0.3,
  }
  // For line marks the path is stroked; use visible default so the line shows. For point/bar, default 0/'' is fine.
  const defaultStrokeWidth = chartType === 'line' ? 2 : 0
  vlEncoding.strokeWidth = {
    condition: [
      { param: 'select', empty: false, value: 3 },
      { param: 'highlight', empty: false, value: 2 },
    ],
    value: defaultStrokeWidth,
  }
  // When line + color encoding, omit stroke so the color channel drives line color (one line per category).
  // Otherwise set stroke for selection/highlight and a constant default.
  if (!(chartType === 'line' && enc.color)) {
    vlEncoding.stroke = {
      condition: [
        { param: 'select', empty: false, value: 'black' },
        { param: 'highlight', empty: false, value: 'black' },
      ],
      value: chartType === 'line' ? '#4c78a8' : '',
    }
  }

  const mark =
    chartType === 'scatter'
      ? { type: 'point' as const, filled: true, size: 100 }
      : chartType === 'line'
        ? { type: 'line' as const, point: true }
        : enc.x && enc.y && !agg.x && !agg.y
          ? { type: 'tick' as const }
          : 'bar'

  const spec: TopLevelSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: data },
    params: [
      { name: 'highlight', select: { type: 'point', on: 'pointerover' } },
      { name: 'select', select: 'point' as const },
    ],
    mark,
    encoding: vlEncoding,
    width: 600,
    height: 400,
  }

  return spec
}
