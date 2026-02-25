export type FieldType = 'numerical' | 'categorical' | 'ordinal' | 'date'

export interface DataField {
  name: string
  type: FieldType
  sampleValues: string[]
}

export type ChartType = 'bar' | 'scatter' | 'line'

export type BarLayout = 'group' | 'stack' | 'normalize'

export type Aggregation = 'sum' | 'avg' | null

export interface EncodingState {
  x: string | null
  y: string | null
  color: string | null
  size: string | null
  x2?: string | null
  y2?: string | null
}

/** Per-channel aggregation when field is numerical. Vega-Lite uses 'mean' for avg. */
export type EncodingAggregation = Partial<Record<keyof EncodingState, Aggregation>>

export type EncodingSortDirection = 'ascending' | 'descending' | null

/** Sort direction for x/y encoding. null = no sort. */
export type EncodingSort = Partial<Record<'x' | 'y', EncodingSortDirection>>

export interface VizState {
  data: Record<string, unknown>[] | null
  fields: DataField[]
  chartType: ChartType
  encoding: EncodingState
  aggregation: EncodingAggregation
  barLayout: BarLayout
  encodingSort: EncodingSort
}
