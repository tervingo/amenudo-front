import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Loader2, UtensilsCrossed, LogOut, ShieldCheck, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VisitaCard } from '@/components/VisitaCard'
import { VisitaCalendar } from '@/components/VisitaCalendar'
import { AdminDialog } from '@/components/AdminDialog'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/api/client'

export function Home() {
  const { isAdmin, logout, theme, toggleTheme } = useAuth()
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [visitas, setVisitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getVisitas()
      .then((data) => setVisitas(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-col gap-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-10 h-10" />
            <h1 className="text-7xl font-bold">Amenudo</h1>
          </div>
          <img src="/portada_1.jpg" alt="Amenudo" className="w-100 h-100 rounded-lg py-10" />
          <div className="text-lg text-gray-500 text-center px-30 py-10">
            <p><b>Amenudo</b> es un blog creado por un grupo de amigos ya jubilados que, en vez de irse a ver obras o jugar a la petanca, dedican un día al mes a visitar un restaurante del Área Metropolitana de Barcelona con un menú de mediodía atractivo.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Cambiar tema" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          {isAdmin ? (
            <>
              <Button asChild>
                <Link to="/visitas/nueva">
                  <Plus className="w-4 h-4 mr-1" /> Nueva visita
                </Link>
              </Button>
              <Button variant="ghost" size="icon" title="Cerrar sesión" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setShowAdminDialog(true)}>
              <ShieldCheck className="w-4 h-4 mr-1" /> Admin
            </Button>
          )}
        </div>
      </div>

      {showAdminDialog && <AdminDialog onClose={() => setShowAdminDialog(false)} />}

      {/* Content: calendar + cards */}
      <div className="flex gap-6 items-start">

        {/* Left: calendar */}
        <VisitaCalendar visitas={visitas} />

        {/* Right: cards grid */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-destructive">
              Error al cargar las visitas: {error}
            </div>
          )}

          {!loading && !error && visitas.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Aún no hay visitas registradas.</p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/visitas/nueva">Añade la primera</Link>
              </Button>
            </div>
          )}

          {!loading && !error && visitas.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visitas.map((v) => (
                <VisitaCard key={v._id} visita={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
