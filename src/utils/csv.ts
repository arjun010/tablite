import Papa from 'papaparse'
import type { DataField, FieldType } from '../types'

// String looks like a plain number (integer or decimal), not a date string.
const looksLikeNumber = (v: string): boolean =>
  /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(v.trim())

const YEAR_MIN = 1900
const YEAR_MAX = 2100
// Two-digit year shorthand (e.g. 70 -> 1970, 82 -> 1982)
const YEAR_2DIGIT_MIN = 0
const YEAR_2DIGIT_MAX = 99

// Column name suggests this is a year field (for 2-digit year disambiguation).
const nameSuggestsYear = (name: string): boolean =>
  /^year$/i.test(name.trim()) || /^model[_\-]?year$/i.test(name.trim())

// Integer in a plausible year range: 1900-2100 (4-digit) or 0-99 (2-digit shorthand).
const looksLikeYear = (v: string, columnName?: string): boolean => {
  const s = v.trim()
  if (!/^-?\d+$/.test(s)) return false
  const n = Number(s)
  if (n >= YEAR_MIN && n <= YEAR_MAX) return true
  // Only treat 0-99 as years when column name suggests it (e.g. "Year" with values 70, 82).
  if (columnName && nameSuggestsYear(columnName) && n >= YEAR_2DIGIT_MIN && n <= YEAR_2DIGIT_MAX)
    return true
  return false
}

// String looks like a date (has date separators or common date patterns). Avoids treating
// plain numbers (e.g. "39811", "0.4894") as dates since new Date() parses those.
const looksLikeDateString = (v: string): boolean => {
  const s = v.trim()
  if (s.length < 4) return false
  // Contains date-like separators
  if (/[\-/\.]/.test(s) && /\d/.test(s)) return true
  // ISO-ish (YYYY-MM-DD or with T)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return true
  // Slash dates (MM/DD/YYYY or DD/MM/YYYY)
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(s)) return true
  // Month name + day/year
  if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(s)) return true
  return false
}

function inferType(values: string[], columnName?: string): FieldType {
  const nonEmpty = values.filter((v) => v != null && String(v).trim() !== '')
  if (nonEmpty.length === 0) return 'categorical'

  const numericCount = nonEmpty.filter((v) => looksLikeNumber(v)).length
  const yearLikeCount = nonEmpty.filter((v) => looksLikeYear(v, columnName)).length
  const dateStringCount = nonEmpty.filter((v) => {
    if (looksLikeNumber(v)) return false // prefer numerical when it's a plain number
    const d = new Date(v)
    return !Number.isNaN(d.getTime()) && looksLikeDateString(v)
  }).length

  // Year column: mostly integers in 1900-2100 (or 0-99 when column name is "Year") -> temporal
  if (yearLikeCount / nonEmpty.length >= 0.7) return 'date'
  if (numericCount / nonEmpty.length > 0.7) {
    // Numeric with very few unique values (e.g. cylinder counts 4, 6, 8) -> ordinal
    const unique = new Set(nonEmpty.map((v) => v.trim()))
    const maxOrdinalCategories = 8
    if (unique.size >= 2 && unique.size <= maxOrdinalCategories) return 'ordinal'
    return 'numerical'
  }
  if (dateStringCount / nonEmpty.length > 0.7) return 'date'
  return 'categorical'
}

export function parseCSV(text: string): { data: Record<string, unknown>[]; fields: DataField[] } {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  })

  const data = parsed.data as unknown as Record<string, unknown>[]
  const rawRows = parsed.data

  if (rawRows.length === 0) {
    const headers = parsed.meta.fields ?? []
    return {
      data: [],
      fields: headers.map((name) => ({ name, type: 'categorical' as FieldType, sampleValues: [] })),
    }
  }

  const headers = parsed.meta.fields ?? Object.keys(rawRows[0] ?? {})
  const fields: DataField[] = headers.map((name) => {
    const columnValues = rawRows.map((row) => String(row[name] ?? ''))
    const sampleValues = columnValues.slice(0, 10)
    return {
      name,
      type: inferType(columnValues, name),
      sampleValues,
    }
  })

  return { data, fields }
}
