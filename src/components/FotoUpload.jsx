import { useState, useRef } from 'react'
import { X, ImagePlus, Loader2 } from 'lucide-react'
import { api } from '@/api/client'

export function FotoUpload({ fotos = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  async function handleFiles(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError(null)
    try {
      const uploads = await Promise.all(files.map((f) => api.uploadFoto(f)))
      onChange([...fotos, ...uploads])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDelete(foto) {
    try {
      await api.deleteFoto(foto.public_id)
      onChange(fotos.filter((f) => f.public_id !== foto.public_id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {fotos.map((foto) => (
          <div key={foto.public_id} className="relative group w-24 h-24">
            <img
              src={foto.url}
              alt="foto visita"
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              type="button"
              onClick={() => handleDelete(foto)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-slate-500 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="w-5 h-5" />
              <span className="text-xs">Añadir</span>
            </>
          )}
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  )
}
