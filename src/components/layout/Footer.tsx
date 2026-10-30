import { Link } from 'react-router'
import { Logo } from '../ui/Logo'
import { SITE } from '../../lib/config'

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: 'Products',
    links: [
      ['Workflow Studio', '/workflow-studio'],
      ['AI Agents', '/ai-agents'],
      ['AI Orchestration', '/ai-orchestration'],
      ['GPU Cloud', '/gpu-cloud'],
    ],
  },
  {
    title: 'Services',
    links: [
      ['Custom AI Development', '/custom-ai-development'],
      ['Build With Us', '/build-with-us'],
      ['AI Architecture', '/#architecture'],
    ],
  },
  {
    title: 'Solutions',
    links: [
      ['Customer Support', '/solutions#customer-support'],
      ['Finance', '/solutions#finance'],
      ['Healthcare', '/solutions#healthcare'],
      ['All industries', '/solutions'],
    ],
  },
  {
    title: 'Developers',
    links: [
      ['Developer overview', '/developers'],
      ['Documentation', '/developers#documentation'],
      ['Workflow nodes', '/workflow-studio#nodes'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Contact', '/contact'],
      ['Privacy', '/legal#privacy'],
      ['Terms', '/legal#terms'],
    ],
  },
]

const SOCIAL_LABELS: Record<string, string> = { linkedin: 'LinkedIn', x: 'X', github: 'GitHub', youtube: 'YouTube' }

export function Footer() {
  const socials = Object.entries(SITE.social).filter(([, url]) => url)
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-950">
      <div className="jaali pointer-events-none absolute inset-0 opacity-[0.05] [mask-image:linear-gradient(to_top,black,transparent_70%)]" />
      <div className="container-x relative pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-fg-soft">
              Your complete AI infrastructure &amp; intelligence partner — from GPU compute to governed, autonomous AI workflows.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Build · Connect · Automate · Orchestrate</p>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2" aria-label="Social and contact">
              {socials.map(([k, url]) => (
                <li key={k}>
                  <a href={url} target="_blank" rel="noreferrer" className="text-sm text-fg-soft hover:text-fg">
                    {SOCIAL_LABELS[k] ?? k}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/contact" className="text-sm text-fg-soft hover:text-fg">
                  Get in touch →
                </Link>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-5">
            {COLS.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map(([label, to]) => (
                    <li key={label}>
                      <Link to={to} className="text-[13.5px] text-fg-soft transition-colors hover:text-fg">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-20 select-none overflow-hidden" aria-hidden="true">
          <p className="bg-gradient-to-b from-white/[0.08] to-transparent bg-clip-text text-center text-[clamp(3.6rem,16.5vw,15rem)] font-semibold leading-[0.82] tracking-[-0.06em] text-transparent">
            AI BHARAT
          </p>
        </div>

        <div className="hairline mt-2 opacity-60" />
        <div className="mt-6 flex flex-col gap-3 text-[12px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AI Bharat. All rights reserved.</p>
          <p className="tracking-wide text-muted/80">Owned by {SITE.owner}</p>
        </div>
      </div>
    </footer>
  )
}
