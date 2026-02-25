import { useCallback } from 'react'
import { parseCSV } from '../utils/csv'

interface FileUploadProps {
  onLoad: (data: Record<string, unknown>[], fields: import('../types').DataField[], fileName: string) => void
  currentFile: string | null
}

export function FileUpload({ onLoad, currentFile }: FileUploadProps) {
  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const text = reader.result as string
        const { data, fields } = parseCSV(text)
        onLoad(data, fields, file.name)
      }
      reader.readAsText(file)
      e.target.value = ''
    },
    [onLoad]
  )

  return (
    <div className="flex items-center gap-2 min-w-0">
      <label className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        CSV
        <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
      </label>
      <span className="text-xs text-slate-500 truncate min-w-0" title={currentFile ?? undefined}>
        {currentFile ?? 'No file'}
      </span>
    </div>
  )
}
