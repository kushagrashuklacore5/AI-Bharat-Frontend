import { Suspense, useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollTrigger } from '../../lib/gsap'

/** Scrolls to #hash targets after lazy routes have rendered. */
function HashScroll() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    let tries = 0
    const t = setInterval(() => {
      const el = document.getElementById(id)
      if (el || ++tries > 25) {
        clearInterval(t)
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 60)
    return () => clearInterval(t)
  }, [hash, pathname])
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(t)
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration getKey={(l) => l.pathname} />
      <HashScroll />
    </>
  )
}
