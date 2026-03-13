import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icons with Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })

const CACHE_KEY = 'amenudo_geocache'
const getCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') } catch { return {} } }
const saveCache = (c) => localStorage.setItem(CACHE_KEY, JSON.stringify(c))

async function geocode(address) {
  const cache = getCache()
  if (cache[address]) return cache[address]
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'es' } }
    )
    const data = await res.json()
    if (!data.length) return null
    const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    saveCache({ ...getCache(), [address]: coords })
    return coords
  } catch {
    return null
  }
}

export function VisitasMapa({ visitas }) {
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const results = await Promise.all(
        visitas
          .filter(v => v.dirección)
          .map(async v => {
            const coords = await geocode(v.dirección)
            return coords ? { ...v, coords } : null
          })
      )
      if (!cancelled) setMarkers(results.filter(Boolean))
    }
    if (visitas.length) load()
    return () => { cancelled = true }
  }, [visitas])

  return (
    <div className="w-full md:w-80 shrink-0">
      <MapContainer
        center={[41.3874, 2.1686]}
        zoom={11}
        style={{ height: '400px', zIndex: 0 }}
        className="rounded-md border border-border md:sticky md:top-4"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />
        {markers.map(v => (
          <Marker key={v._id} position={v.coords}>
            <Popup>
              <strong>{v.sitio}</strong><br />
              {new Date(v.fecha).toLocaleDateString('es-ES')}<br />
              <a href={`/visitas/${v._id}`} style={{ color: 'navy' }}>Ver visita →</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
