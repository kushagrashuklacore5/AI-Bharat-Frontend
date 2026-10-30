import { useRef, type ReactNode, type MouseEvent } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-[background,color,border-color,box-shadow] duration-300 select-none whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary:
    'h-12 pl-6 pr-5 bg-fg text-ink-950 hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,.2),0_10px_40px_-10px_rgba(69,211,230,.45)]',
  secondary:
    'h-12 px-6 border border-line-strong text-fg hover:border-fg-soft/50 hover:bg-white/[0.04]',
  ghost: 'h-10 px-3 text-fg-soft hover:text-fg',
}

interface Props {
  to?: string
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: Variant
  arrow?: boolean
  magnetic?: boolean
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

/** CTA with an optional, subtle magnetic pull toward the pointer. */
export function Button({ to, href, onClick, children, variant = 'primary', arrow = true, magnetic = true, className = '', type = 'button', disabled }: Props) {
  const ref = useRef<HTMLElement | null>(null)

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.18
    const y = (e.clientY - r.top - r.height / 2) * 0.28
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          size={16}
          className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        />
      )}
    </>
  )
  const cls = `group/btn ${base} ${variants[variant]} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`
  const style = { transition: 'transform .5s cubic-bezier(.16,1,.3,1), background .3s, color .3s, border-color .3s' }
  const common = { onMouseMove: onMove, onMouseLeave: onLeave, className: cls, style }

  if (to)
    return (
      <Link to={to} ref={(el) => { ref.current = el }} {...common}>
        {content}
      </Link>
    )
  if (href)
    return (
      <a href={href} ref={(el) => { ref.current = el }} {...common}>
        {content}
      </a>
    )
  return (
    <button type={type} onClick={onClick} disabled={disabled} ref={(el) => { ref.current = el }} {...common}>
      {content}
    </button>
  )
}
