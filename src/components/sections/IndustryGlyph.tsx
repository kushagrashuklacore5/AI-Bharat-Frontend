import type { Industry } from '../../lib/content'

/** Small line artwork per industry; each animates differently on card hover (see .ind-card rules). */
export function IndustryGlyph({ glyph, color }: { glyph: Industry['glyph']; color: string }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 64 64" className={`ind-glyph ind-${glyph} size-14`} aria-hidden="true">
      {glyph === 'grid' &&
        Array.from({ length: 9 }, (_, i) => (
          <rect key={i} className="g-cell" x={10 + (i % 3) * 16} y={10 + Math.floor(i / 3) * 16} width="12" height="12" rx="2.5" {...s} style={{ transitionDelay: `${i * 40}ms` }} />
        ))}
      {glyph === 'pulse' && <path className="g-draw" d="M4 34 H18 L23 22 L30 46 L36 16 L42 34 H60" {...s} pathLength={1} />}
      {glyph === 'bars' &&
        [18, 30, 24, 40].map((h, i) => <rect key={i} className="g-bar" x={10 + i * 12} y={52 - h} width="8" height={h} rx="2" {...s} style={{ transitionDelay: `${i * 60}ms` }} />)}
      {glyph === 'cart' && (
        <g className="g-slide">
          <path d="M8 14 H16 L22 40 H48 L54 22 H19" {...s} />
          <circle cx="26" cy="49" r="3.5" {...s} />
          <circle cx="44" cy="49" r="3.5" {...s} />
        </g>
      )}
      {glyph === 'gear' && (
        <g className="g-spin" style={{ transformOrigin: '32px 32px' }}>
          <circle cx="32" cy="32" r="9" {...s} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2
            return <line key={i} x1={32 + Math.cos(a) * 14} y1={32 + Math.sin(a) * 14} x2={32 + Math.cos(a) * 21} y2={32 + Math.sin(a) * 21} {...s} />
          })}
        </g>
      )}
      {glyph === 'org' && (
        <g>
          <rect x="24" y="8" width="16" height="12" rx="3" {...s} />
          {[10, 26, 42].map((x, i) => (
            <rect key={x} className="g-drop" x={x} y="42" width="12" height="12" rx="3" {...s} style={{ transitionDelay: `${i * 70}ms` }} />
          ))}
          <path d="M32 20 V31 M16 31 H48 M16 31 V42 M32 31 V42 M48 31 V42" {...s} strokeOpacity=".6" />
        </g>
      )}
      {glyph === 'chat' && (
        <g>
          <path className="g-pop1" d="M8 14 h30 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h-18 l-8 6 v-6 h-4 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4z" {...s} />
          <path className="g-pop2" d="M56 30 h-14 v10 a4 4 0 0 1 -4 4 h-6 v2 a4 4 0 0 0 4 4 h12 l6 5 v-5 h2 a4 4 0 0 0 4 -4 v-12 a4 4 0 0 0 -4 -4z" {...s} strokeOpacity=".7" />
        </g>
      )}
    </svg>
  )
}
