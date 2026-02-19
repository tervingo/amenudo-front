import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function AsistentesInput({ asistentes = [], onChange }) {
  const [value, setValue] = useState('')

  function add() {
    const nombre = value.trim()
    if (!nombre || asistentes.includes(nombre)) return
    onChange([...asistentes, nombre])
    setValue('')
  }

  function remove(nombre) {
    onChange(asistentes.filter((a) => a !== nombre))
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Nombre y Enter"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1 text-sm bg-slate-800 text-white rounded-md hover:bg-slate-700"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {asistentes.map((a) => (
          <Badge key={a} variant="secondary" className="flex items-center gap-1 pr-1">
            {a}
            <button type="button" onClick={() => remove(a)}>
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
