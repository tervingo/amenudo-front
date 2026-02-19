import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, Loader2, Calendar, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { api } from '@/api/client'

function ScoreCircle({ label, value, highlight }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${highlight ? 'text-amber-500' : ''}`}>
        {value?.toFixed(1) ?? '—'}
        {highlight && <Star className="inline w-5 h-5 fill-amber-500 ml-1 mb-1" />}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export function DetalleVisita() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [visita, setVisita] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getVisita(id)
      .then(setVisita)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!confirm('¿Eliminar esta visita?')) return
    setDeleting(true)
    try {
      await api.deleteVisita(id)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !visita) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-destructive">
        {error ?? 'Visita no encontrada'}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold line-clamp-1">{visita.sitio}</h1>
            {visita.dirección && (
              <p className="text-sm text-muted-foreground">{visita.dirección}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/visitas/${id}/editar`}>
              <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Fotos */}
      {visita.fotos?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {visita.fotos.map((f) => (
            <img
              key={f.public_id}
              src={f.url}
              alt="foto"
              className="w-full h-36 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          {new Date(visita.fecha).toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </span>
        {visita.asistentes?.length > 0 && (
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {visita.asistentes.length} asistente{visita.asistentes.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {visita.asistentes?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visita.asistentes.map((a) => (
            <Badge key={a} variant="secondary">{a}</Badge>
          ))}
        </div>
      )}

      {visita.ponente && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Ponente:</span> {visita.ponente}
        </p>
      )}

      {(visita.menu?.foto || visita.menu?.descripcion || visita.menu?.precio != null) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Menú
              {visita.menu.precio != null && (
                <span className="text-base font-semibold">{visita.menu.precio.toFixed(1)} €</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {visita.menu.foto && (
              <img
                src={visita.menu.foto.url}
                alt="menú"
                className="w-full max-h-64 object-contain rounded-md border"
              />
            )}
            {visita.menu.descripcion && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{visita.menu.descripcion}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Puntuaciones */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-around">
            <ScoreCircle label="Comida" value={visita.puntuacion_comida} />
            <ScoreCircle label="Local" value={visita.puntuacion_local} />
            <ScoreCircle label="General" value={visita.puntuacion_general} highlight />
          </div>
        </CardContent>
      </Card>

      {/* Comentario */}
      {visita.comentario && (
        <Card>
          <CardHeader><CardTitle>Comentario</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{visita.comentario}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
