import type { ReactNode } from 'react'

interface Props {
  index?: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  className?: string
  id?: string
}

export function SectionHeading({ index, eyebrow, title, lead, align = 'left', className = '', id }: Props) {
  const center = align === 'center'
  return (
    <header className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <div data-reveal className={`flex items-center gap-4 ${center ? 'justify-center' : ''}`}>
        {index && <span className="font-mono text-xs text-faint">{index}</span>}
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 id={id} data-reveal="1" className="display mt-5 text-[clamp(2.1rem,4.6vw,3.9rem)] text-fg">
        {title}
      </h2>
      {lead && (
        <p data-reveal="2" className={`mt-6 text-[1.05rem] leading-relaxed text-fg-soft/90 ${center ? 'mx-auto' : ''} max-w-2xl`}>
          {lead}
        </p>
      )}
    </header>
  )
}
