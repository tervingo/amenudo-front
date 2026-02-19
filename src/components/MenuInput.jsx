import { useRef, useState } from 'react'
import { X, ImagePlus, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/api/client'

export function MenuInput({ menu = { descripcion: '', foto: null, precio: null }, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  function update(field, value) {
    onChange({ ...menu, [field]: value })
  }

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const foto = await api.uploadFoto(file)
      update('foto', foto)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDeleteFoto() {
    try {
      await api.deleteFoto(menu.foto.public_id)
      update('foto', null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Foto del menú</Label>
        {menu.foto ? (
          <div className="relative group">
            <img
              src={menu.foto.url}
              alt="menú"
              className="w-full max-h-64 object-contain rounded-md border"
            />
            <button
              type="button"
              onClick={handleDeleteFoto}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            disabled={uploading}
            className="w-full h-28 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-slate-500 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                <span className="text-xs">Añadir foto del menú</span>
              </>
            )}
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea
          value={menu.descripcion}
          onChange={(e) => update('descripcion', e.target.value)}
          placeholder="Platos, bebidas, postres..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Precio (€)</Label>
        <Input
          type="number"
          min="0"
          step="0.1"
          value={menu.precio ?? ''}
          onChange={(e) => update('precio', e.target.value === '' ? null : parseFloat(e.target.value))}
          placeholder="0.0"
          className="w-32"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
