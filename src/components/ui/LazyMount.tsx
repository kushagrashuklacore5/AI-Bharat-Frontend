import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

/** Mounts heavy children only once their placeholder approaches the viewport. */
export function LazyMount({ children, minHeight, rootMargin = '600px' }: { children: ReactNode; minHeight: number | string; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  const fallback = <div className="animate-pulse rounded-[20px] border border-line bg-ink-900" style={{ minHeight }} />
  return (
    <div ref={ref} style={{ minHeight }}>
      {show ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  )
}
