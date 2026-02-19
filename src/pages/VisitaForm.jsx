import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RatingInput } from '@/components/RatingInput'
import { FotoUpload } from '@/components/FotoUpload'
import { AsistentesInput } from '@/components/AsistentesInput'
import { api } from '@/api/client'

const DEFAULT_FORM = {
  fecha: new Date().toISOString().split('T')[0],
  sitio: '',
  asistentes: [],
  fotos: [],
  puntuacion_comida: 5,
  puntuacion_local: 5,
  puntuacion_general: 5,
  comentario: '',
}

export function VisitaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    api.getVisita(id)
      .then((v) => setForm({ ...v, fecha: v.fecha?.split('T')[0] ?? v.fecha }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function set(field) {
    return (value) => setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (isEdit) {
        await api.updateVisita(id, form)
      } else {
        await api.createVisita(form)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h1 className="text-xl font-bold">{isEdit ? 'Editar visita' : 'Nueva visita'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Datos generales</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sitio">Restaurante / Sitio *</Label>
              <Input
                id="sitio"
                required
                value={form.sitio}
                onChange={(e) => set('sitio')(e.target.value)}
                placeholder="Casa Pepe, La Taberna..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                required
                value={form.fecha}
                onChange={(e) => set('fecha')(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Asistentes</Label>
              <AsistentesInput
                asistentes={form.asistentes}
                onChange={set('asistentes')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Puntuaciones</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <RatingInput
              label="Comida"
              name="puntuacion_comida"
              value={form.puntuacion_comida}
              onChange={set('puntuacion_comida')}
            />
            <RatingInput
              label="Local / Ambiente"
              name="puntuacion_local"
              value={form.puntuacion_local}
              onChange={set('puntuacion_local')}
            />
            <RatingInput
              label="Puntuación general"
              name="puntuacion_general"
              value={form.puntuacion_general}
              onChange={set('puntuacion_general')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Comentario</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              value={form.comentario}
              onChange={(e) => set('comentario')(e.target.value)}
              placeholder="Qué destacarías de la visita..."
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Fotos</CardTitle></CardHeader>
          <CardContent>
            <FotoUpload fotos={form.fotos} onChange={set('fotos')} />
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link to="/">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Guardar cambios' : 'Crear visita'}
          </Button>
        </div>
      </form>
    </div>
  )
}
