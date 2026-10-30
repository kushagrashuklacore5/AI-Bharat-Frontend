import { FlaskConical } from 'lucide-react'

export function DemoBadge({ label = 'Illustrative demonstration data', className = '' }: { label?: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber/25 bg-amber/[0.06] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-amber/90 ${className}`}
    >
      <FlaskConical size={12} aria-hidden="true" />
      {label}
    </span>
  )
}
