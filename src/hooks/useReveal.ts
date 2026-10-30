import { useEffect, type RefObject } from 'react'

/**
 * Reveals every [data-reveal] element inside `ref` when it scrolls into view.
 * Uses IntersectionObserver (no scroll listeners). Stagger with data-reveal="2" etc.
 * Content is visible by default if JS fails, because the hidden state is only
 * applied by CSS and removed here; reduced-motion users see it immediately.
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          const step = Number(el.dataset.reveal || 0)
          el.style.transitionDelay = `${step * 80}ms`
          el.classList.add('is-in')
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ref])
}
