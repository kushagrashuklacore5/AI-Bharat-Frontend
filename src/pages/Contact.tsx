import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { SITE } from '../lib/config'

const TOPICS = ['Workflow Studio early access', 'Custom AI project', 'GPU capacity', 'Partnership', 'Something else']

export default function ContactPage() {
  const [f, setF] = useState({ name: '', email: '', topic: TOPICS[1], message: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'local' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Contact — AI Bharat'
  }, [])

  const text = `To: AI Bharat\nFrom: ${f.name} <${f.email}>\nTopic: ${f.topic}\n\n${f.message}`

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const n: Record<string, string> = {}
    if (!f.name.trim()) n.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) n.email = 'Please enter a valid email.'
    if (f.message.trim().length < 10) n.message = 'Please write a short message (10+ characters).'
    setErr(n)
    if (Object.keys(n).length) return
    if (!SITE.formEndpoint) return setState('local')
    setState('sending')
    try {
      const r = await fetch(SITE.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'contact', ...f }) })
      if (!r.ok) throw new Error()
      setState('sent')
    } catch {
      setState('error')
    }
  }

  const input =
    'mt-2 w-full rounded-xl border border-line bg-ink-950 px-4 py-3 text-[14.5px] text-fg transition-colors focus:border-cyan/50 focus:outline-none aria-[invalid=true]:border-danger/60'

  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(50%_60%_at_20%_10%,rgba(69,211,230,.08),transparent_70%)]" aria-hidden="true" />
      <div className="container-x relative grid gap-14 pb-28 pt-36 md:pt-44 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-6 text-[clamp(2.4rem,5.4vw,4.6rem)]">
            Let’s talk about <span className="serif-accent text-gradient">what you’re building.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-fg-soft">Questions about the platform, GPU capacity or a custom project — send us a note.</p>
          <div className="mt-12 space-y-3">
            <Link to="/build-with-us" className="panel group flex items-center justify-between p-5 transition-colors hover:border-line-strong">
              <span>
                <span className="block text-fg">Have a specific project?</span>
                <span className="block text-[13px] text-muted">Use the guided brief — it helps us respond with something concrete.</span>
              </span>
              <ArrowUpRight size={18} className="text-fg-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            {SITE.contactEmail && (
              <a href={`mailto:${SITE.contactEmail}`} className="panel flex items-center justify-between p-5 hover:border-line-strong">
                <span className="text-fg">{SITE.contactEmail}</span>
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
          <p className="mt-12 text-[12px] text-faint">AI Bharat is owned by {SITE.owner}</p>
        </div>

        <div className="panel p-6 sm:p-9">
          {state === 'sent' || state === 'local' ? (
            <div role="status">
              <span className="grid size-12 place-items-center rounded-full bg-leaf/15 text-leaf">
                <Check size={22} />
              </span>
              <h2 className="mt-6 text-2xl text-fg">{state === 'sent' ? 'Message sent. Thank you.' : 'Message prepared.'}</h2>
              <p className="mt-3 leading-relaxed text-fg-soft">
                {state === 'sent'
                  ? 'We’ll reply to your email.'
                  : 'Online sending isn’t connected in this version of the site, so the message has not been sent. You can copy it and share it with the AI Bharat team.'}
              </p>
              {state === 'local' && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(text)
                      setCopied(true)
                    } catch {
                      /* ignore */
                    }
                  }}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-ink-950"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy message'}
                </button>
              )}
              <button type="button" onClick={() => setState('idle')} className="ml-3 text-sm text-fg-soft hover:text-fg">
                Edit
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-[13.5px] text-fg-soft">
                  Name
                  <input value={f.name} autoComplete="name" onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!err.name} className={input} />
                  {err.name && <span role="alert" className="mt-1.5 block text-[12.5px] text-danger">{err.name}</span>}
                </label>
                <label className="block text-[13.5px] text-fg-soft">
                  Email
                  <input type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-invalid={!!err.email} className={input} />
                  {err.email && <span role="alert" className="mt-1.5 block text-[12.5px] text-danger">{err.email}</span>}
                </label>
              </div>
              <fieldset>
                <legend className="text-[13.5px] text-fg-soft">Topic</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={f.topic === t}
                      onClick={() => setF({ ...f, topic: t })}
                      className={`rounded-full border px-3.5 py-2 text-[13px] transition-colors ${f.topic === t ? 'border-cyan/50 bg-cyan/[0.08] text-fg' : 'border-line text-muted hover:text-fg-soft'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block text-[13.5px] text-fg-soft">
                Message
                <textarea rows={6} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} aria-invalid={!!err.message} className={`${input} resize-y`} />
                {err.message && <span role="alert" className="mt-1.5 block text-[12.5px] text-danger">{err.message}</span>}
              </label>
              {state === 'error' && <p className="text-[13px] text-danger">Sending failed. Please try again.</p>}
              <button type="submit" disabled={state === 'sending'} className="inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-ink-950 hover:bg-white disabled:opacity-60">
                {state === 'sending' ? 'Sending…' : 'Send message'} <ArrowUpRight size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
