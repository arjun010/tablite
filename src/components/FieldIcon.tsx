import { Calendar, Hash, ListOrdered, Type } from 'lucide-react'
import type { FieldType } from '../types'

const iconClass = 'w-4 h-4 shrink-0 text-slate-500'

export function FieldIcon({ type }: { type: FieldType }) {
  switch (type) {
    case 'numerical':
      return <Hash className={iconClass} aria-hidden />
    case 'ordinal':
      return <ListOrdered className={iconClass} aria-hidden />
    case 'date':
      return <Calendar className={iconClass} aria-hidden />
    case 'categorical':
    default:
      return <Type className={iconClass} aria-hidden />
  }
}
