import { useRef, type ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

interface Props {
  id?: string
  className?: string
  children: ReactNode
  labelledBy?: string
}

/** A semantic <section> that reveals its [data-reveal] children on scroll. */
export function Section({ id, className = '', children, labelledBy }: Props) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={`relative ${className}`}>
      {children}
    </section>
  )
}
