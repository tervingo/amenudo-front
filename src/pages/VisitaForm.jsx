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
import { MenuInput } from '@/components/MenuInput'
import { api } from '@/api/client'

const PONENTES = ['Antonio', 'Jesús', 'Josep Lluís', 'Juan', 'Pepe']

const DEFAULT_FORM = {
  fecha: new Date().toISOString().split('T')[0],
  sitio: '',
  dirección: '',
  asistentes: [],
  ponente: '',
  menu: { descripcion: '', foto: null, precio: null },
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
      .then((v) => setForm({ ...DEFAULT_FORM, ...v, fecha: v.fecha?.split('T')[0] ?? v.fecha }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function set(field) {
    return (value) => setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.asistentes.length < 2) {
      setError('Debes seleccionar al menos 2 asistentes.')
      return
    }
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
              <Label htmlFor="dirección">Dirección</Label>
              <Input
                id="dirección"
                value={form.dirección}
                onChange={(e) => set('dirección')(e.target.value)}
                placeholder="Calle, número, ciudad..."
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

            <div className="space-y-2">
              <Label htmlFor="ponente">Ponente</Label>
              <select
                id="ponente"
                value={form.ponente}
                onChange={(e) => set('ponente')(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
              >
                <option value="">— Sin ponente —</option>
                {PONENTES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Menú</CardTitle></CardHeader>
          <CardContent>
            <MenuInput menu={form.menu} onChange={set('menu')} />
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
