import { Label } from '@/components/ui/label'

export function RatingInput({ label, name, value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name}>{label}</Label>
        <span className="text-sm font-semibold tabular-nums w-8 text-right">
          {value ?? '—'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">0</span>
        <input
          id={name}
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={value ?? 5}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-slate-700"
        />
        <span className="text-xs text-muted-foreground">10</span>
      </div>
    </div>
  )
}
