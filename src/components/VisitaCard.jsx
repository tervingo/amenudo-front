import { Link } from 'react-router-dom'
import { Calendar, Star, Eye, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export function VisitaCard({ visita }) {
  const { isAdmin } = useAuth()
  const foto = visita.fotos?.[0]

  return (
    <Card className="overflow-hidden h-full">
      {foto && (
        <img
          src={foto.url}
          alt={visita.sitio}
          className="w-full h-36 object-cover"
        />
      )}
      <CardContent className="p-3 space-y-2">
        <p className="font-semibold text-xl line-clamp-1">{visita.sitio}</p>
        <div className="flex items-center justify-between text-lg text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(visita.fecha).toLocaleDateString('es-ES')}
          </span>
          <span className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-3 h-3 fill-amber-500" />
            {visita.puntuacion_general?.toFixed(1) ?? '—'}
          </span>
        </div>
        <div className="flex justify-end gap-1 pt-1 border-t">
          <Button variant="ghost" size="icon" asChild title="Ver visita">
            <Link to={`/visitas/${visita._id}`}><Eye className="w-4 h-4" /></Link>
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="icon" asChild title="Editar visita">
              <Link to={`/visitas/${visita._id}/editar`}><Pencil className="w-4 h-4" /></Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
