import { Link } from 'react-router-dom'
import { Calendar, Users, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function Score({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-xl font-bold">{value?.toFixed(1) ?? '—'}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

export function VisitaCard({ visita }) {
  const foto = visita.fotos?.[0]

  return (
    <Link to={`/visitas/${visita._id}`}>
      <Card className="hover:shadow-md transition-shadow overflow-hidden cursor-pointer h-full">
        {foto && (
          <img
            src={foto.url}
            alt={visita.sitio}
            className="w-full h-40 object-cover"
          />
        )}
        <CardHeader className="pb-2">
          <CardTitle className="text-base line-clamp-1">{visita.sitio}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(visita.fecha).toLocaleDateString('es-ES')}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {visita.asistentes?.length ?? 0}
            </span>
          </div>

          <div className="flex justify-around border-t pt-3">
            <Score label="Comida" value={visita.puntuacion_comida} />
            <Score label="Local" value={visita.puntuacion_local} />
            <div className="text-center">
              <div className="flex items-center gap-1 text-xl font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                {visita.puntuacion_general?.toFixed(1) ?? '—'}
              </div>
              <div className="text-xs text-muted-foreground">General</div>
            </div>
          </div>

          {visita.asistentes?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {visita.asistentes.map((a) => (
                <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
