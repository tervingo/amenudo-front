const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail || 'Error en la petición')
  }
  return res.json()
}

export const api = {
  // Visitas
  getVisitas: () => request('/visitas'),
  getVisita: (id) => request(`/visitas/${id}`),
  createVisita: (data) => request('/visitas', { method: 'POST', body: JSON.stringify(data) }),
  updateVisita: (id, data) => request(`/visitas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVisita: (id) => request(`/visitas/${id}`, { method: 'DELETE' }),

  // Fotos
  uploadFoto: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request('/upload', {
      method: 'POST',
      headers: {},  // dejar que el browser ponga el Content-Type con boundary
      body: formData,
    })
  },
  deleteFoto: (publicId) =>
    request('/upload', { method: 'DELETE', body: JSON.stringify({ public_id: publicId }) }),
}
