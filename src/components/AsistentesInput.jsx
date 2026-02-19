const OPCIONES = ['Antonio', 'Jesús', 'Josep Lluís', 'Juan', 'Pepe']

export function AsistentesInput({ asistentes = [], onChange }) {
  function toggle(nombre) {
    if (asistentes.includes(nombre)) {
      onChange(asistentes.filter((a) => a !== nombre))
    } else {
      onChange([...asistentes, nombre])
    }
  }

  return (
    <div className="flex flex-wrap gap-4">
      {OPCIONES.map((nombre) => (
        <label key={nombre} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={asistentes.includes(nombre)}
            onChange={() => toggle(nombre)}
            className="w-4 h-4"
          />
          <span className="text-sm">{nombre}</span>
        </label>
      ))}
    </div>
  )
}
