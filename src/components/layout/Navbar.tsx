import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { PRODUCTS, SERVICES, type NavItem } from '../../lib/nav'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMenu(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!menu) return
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3.5 py-2 text-[13.5px] transition-colors ${isActive ? 'text-fg bg-white/[0.06]' : 'text-fg-soft hover:text-fg'}`

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="container-x">
        <nav
          aria-label="Primary"
          className={`flex h-14 items-center justify-between rounded-full border pl-5 pr-2 transition-all duration-500 ${
            scrolled || open
              ? 'border-line bg-ink-900/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,.8)] backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          }`}
        >
          <Logo />

          <div className="hidden items-center gap-0.5 lg:flex">
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-expanded={menu}
                aria-controls="products-menu"
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] text-fg-soft hover:text-fg"
              >
                Platform <ChevronDown size={14} className={`transition-transform ${menu ? 'rotate-180' : ''}`} />
              </button>
              <div
                id="products-menu"
                className={`absolute left-1/2 top-full mt-3 w-[620px] -translate-x-1/2 transition-all duration-300 ${
                  menu ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                }`}
              >
                <div className="panel grid grid-cols-2 gap-1 bg-ink-850/95 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)] backdrop-blur-xl">
                  <MenuGroup title="Products" items={PRODUCTS} />
                  <MenuGroup title="Services" items={SERVICES} />
                </div>
              </div>
            </div>
            <NavLink to="/workflow-studio" className={link}>
              Workflow Studio
            </NavLink>
            <NavLink to="/custom-ai-development" className={link}>
              Custom AI
            </NavLink>
            <NavLink to="/solutions" className={link}>
              Solutions
            </NavLink>
            <NavLink to="/about" className={link}>
              About
            </NavLink>
          </div>

          <div className="flex items-center gap-1.5">
            <Link to="/contact" className="hidden rounded-full px-3.5 py-2 text-[13.5px] text-fg-soft hover:text-fg sm:block">
              Contact
            </Link>
            <Link
              to="/build-with-us"
              className="hidden h-10 items-center rounded-full bg-fg px-4 text-[13.5px] font-medium text-ink-950 transition-colors hover:bg-white sm:inline-flex"
            >
              Build with us
            </Link>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-fg lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`fixed inset-x-0 bottom-0 top-[76px] overflow-y-auto bg-ink-950/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="container-x py-8">
          <MobileGroup title="Products" items={PRODUCTS} />
          <MobileGroup title="Services" items={SERVICES} />
          <div className="flex flex-wrap gap-6 text-fg-soft">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/developers">Developers</Link>
          </div>
          <Link
            to="/build-with-us"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-fg text-sm font-medium text-ink-950"
          >
            Build with us
          </Link>
        </div>
      </div>
    </header>
  )
}

function MobileGroup({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="mb-8">
      <p className="eyebrow mb-3">{title}</p>
      <ul>
        {items.map((i) => (
          <li key={i.to} className="border-b border-line">
            <Link to={i.to} className="flex items-baseline justify-between gap-4 py-4">
              <span className="text-xl text-fg">{i.label}</span>
              <span className="text-right text-xs text-muted">{i.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MenuGroup({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="p-2">
      <p className="px-3 pb-2 pt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">{title}</p>
      {items.map((i) => (
        <Link key={i.to} to={i.to} className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04]">
          <span className="block text-sm text-fg">{i.label}</span>
          <span className="block text-[12.5px] text-muted group-hover:text-fg-soft">{i.desc}</span>
        </Link>
      ))}
    </div>
  )
}
