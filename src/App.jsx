import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Home } from '@/pages/Home'
import { VisitaForm } from '@/pages/VisitaForm'
import { DetalleVisita } from '@/pages/DetalleVisita'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visitas/nueva" element={<VisitaForm />} />
          <Route path="/visitas/:id" element={<DetalleVisita />} />
          <Route path="/visitas/:id/editar" element={<VisitaForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
