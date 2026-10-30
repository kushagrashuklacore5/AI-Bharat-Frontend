import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Copy, Download, FileText, Sparkles } from 'lucide-react'
import { BUDGETS, DEPLOYMENTS, EMPTY_BRIEF, INTEGRATIONS, SOLUTION_TYPES, TIMELINES, USERS, briefToText, composeBrief, type BriefForm } from '../lib/brief'
import { SITE } from '../lib/config'

const STEPS = ['About you', 'The problem', 'Scope', 'Review']
const DRAFT_KEY = 'aib-brief-draft'
const FREE_MAIL = /@(gmail|yahoo|outlook|hotmail|icloud|proton|rediffmail)\./i

type Errors = Partial<Record<keyof BriefForm, string>>

function validate(f: BriefForm, step: number): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!f.name.trim()) e.name = 'Please enter your name.'
    if (!f.email.trim()) e.email = 'Please enter your work email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'That email address doesn’t look valid.'
    if (!f.company.trim()) e.company = 'Please enter your company or organisation.'
  }
  if (step === 1) {
    if (!f.types.length) e.types = 'Choose at least one option (or “Not sure yet”).'
    if (f.problem.trim().length < 30) e.problem = 'Please describe the problem in at least 30 characters.'
  }
  if (step === 2) {
    if (!f.users) e.users = 'Select the expected number of users.'
    if (!f.deployment) e.deployment = 'Select a deployment preference.'
  }
  return e
}

export default function BuildWithUsPage() {
  const [params] = useSearchParams()
  const [form, setForm] = useState<BriefForm>(() => {
    let draft: BriefForm | null = null
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) draft = { ...EMPTY_BRIEF, ...JSON.parse(raw) }
    } catch {
      /* storage unavailable */
    }
    const base = draft ?? EMPTY_BRIEF
    const t = params.get('type')
    if (t && SOLUTION_TYPES.some((s) => s.id === t) && !base.types.includes(t)) return { ...base, types: [...base.types, t] }
    return base
  })
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'editing' | 'sending' | 'sent' | 'local' | 'error'>('editing')
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const brief = useMemo(() => composeBrief(form), [form])

  useEffect(() => {
    document.title = 'Build With Us — AI Bharat'
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    } catch {
      /* ignore */
    }
  }, [form])

  const set = <K extends keyof BriefForm>(k: K, v: BriefForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }
  const toggle = (k: 'types' | 'integrations', v: string) => set(k, form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v])

  const next = () => {
    const e = validate(form, step)
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submit = async () => {
    for (let s = 0; s < 3; s++) {
      const e = validate(form, s)
      if (Object.keys(e).length) {
        setErrors(e)
        setStep(s)
        return
      }
    }
    if (!SITE.formEndpoint) {
      setState('local')
      return
    }
    setState('sending')
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'project-brief', ...form, brief: briefToText(form) }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('sent')
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch {
        /* ignore */
      }
    } catch {
      setState('error')
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(briefToText(form))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }
  const download = () => {
    const blob = new Blob([briefToText(form)], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `ai-bharat-brief-${(form.company || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const done = state === 'sent' || state === 'local'

  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(50%_60%_at_80%_10%,rgba(224,154,82,.08),transparent_70%)]" aria-hidden="true" />
      <div className="container-x relative pb-28 pt-36 md:pt-44">
        <p className="eyebrow">Build with us</p>
        <h1 className="display mt-6 max-w-4xl text-[clamp(2.4rem,5.4vw,4.6rem)]">
          Describe your problem. <span className="serif-accent text-gradient">We’ll shape the solution.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-soft">
          Plain language is fine — you don’t need to know which models or tools to use. As you answer, a structured project brief is composed alongside.
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          {/* ── Form ─────────────────────────── */}
          <div className="panel scroll-mt-28 p-6 sm:p-9">
            {done ? (
              <div role="status">
                <span className="grid size-12 place-items-center rounded-full bg-leaf/15 text-leaf">
                  <Check size={22} />
                </span>
                <h2 className="mt-6 text-3xl tracking-tight text-fg">{state === 'sent' ? 'Brief received.' : 'Your brief is ready.'}</h2>
                <p className="mt-4 leading-relaxed text-fg-soft">
                  {state === 'sent'
                    ? 'Thank you. Our team will review it and reply to your work email.'
                    : 'Online submission isn’t connected in this version of the site, so nothing has been sent yet. Copy or download the brief below and share it with the AI Bharat team.'}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={copy} className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-ink-950">
                    {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy brief'}
                  </button>
                  <button type="button" onClick={download} className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm text-fg">
                    <Download size={15} /> Download .txt
                  </button>
                  <button type="button" onClick={() => setState('editing')} className="inline-flex h-11 items-center gap-2 px-3 text-sm text-fg-soft hover:text-fg">
                    Edit answers
                  </button>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                  if (step < STEPS.length - 1) next()
                  else submit()
                }}
              >
                {/* stepper */}
                <ol className="flex gap-2" aria-label="Progress">
                  {STEPS.map((s, i) => (
                    <li key={s} className="flex-1">
                      <button
                        type="button"
                        onClick={() => i < step && setStep(i)}
                        disabled={i > step}
                        aria-current={i === step ? 'step' : undefined}
                        className="block w-full text-left"
                      >
                        <span className={`block h-0.5 rounded-full transition-colors duration-500 ${i <= step ? 'bg-cyan' : 'bg-line-strong'}`} />
                        <span className={`mt-2 block font-mono text-[10.5px] uppercase tracking-[0.12em] ${i === step ? 'text-fg' : 'text-faint'}`}>
                          <span className="hidden sm:inline">{String(i + 1).padStart(2, '0')} · </span>
                          {s}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>

                <div key={step} className="mt-9 space-y-6" style={{ animation: 'fade-up .5s cubic-bezier(.16,1,.3,1)' }}>
                  {step === 0 && (
                    <>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Your name" error={errors.name} id="name">
                          <input id="name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby="name-err" className={input} />
                        </Field>
                        <Field label="Role (optional)" id="role">
                          <input id="role" autoComplete="organization-title" value={form.role} onChange={(e) => set('role', e.target.value)} className={input} />
                        </Field>
                      </div>
                      <Field
                        label="Work email"
                        error={errors.email}
                        hint={!errors.email && FREE_MAIL.test(form.email) ? 'A work address helps us respond faster — personal email is fine too.' : undefined}
                        id="email"
                      >
                        <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby="email-err" className={input} />
                      </Field>
                      <Field label="Company / organisation" error={errors.company} id="company">
                        <input id="company" autoComplete="organization" value={form.company} onChange={(e) => set('company', e.target.value)} aria-invalid={!!errors.company} aria-describedby="company-err" className={input} />
                      </Field>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <fieldset aria-invalid={!!errors.types} aria-describedby="types-err" tabIndex={-1} className="focus:outline-none">
                        <legend className={label}>What kind of solution are you considering?</legend>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {SOLUTION_TYPES.map((t) => (
                            <Chip key={t.id} on={form.types.includes(t.id)} onClick={() => toggle('types', t.id)}>
                              {t.label}
                            </Chip>
                          ))}
                        </div>
                        {errors.types && <Err id="types-err">{errors.types}</Err>}
                      </fieldset>
                      <Field label="What problem do you want to solve?" error={errors.problem} id="problem" hint="E.g. “Our support team answers ~400 emails a day; most are order-status and refund questions.”">
                        <textarea id="problem" rows={5} value={form.problem} onChange={(e) => set('problem', e.target.value)} aria-invalid={!!errors.problem} aria-describedby="problem-err" className={`${input} resize-y`} />
                        <span className="mt-1 block text-right font-mono text-[10.5px] text-faint">{form.problem.trim().length} chars</span>
                      </Field>
                      <Field label="What outcome would make this a success? (optional)" id="outcome">
                        <textarea id="outcome" rows={3} value={form.outcome} onChange={(e) => set('outcome', e.target.value)} className={`${input} resize-y`} />
                      </Field>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <fieldset>
                        <legend className={label}>Systems it should connect to</legend>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {INTEGRATIONS.map((t) => (
                            <Chip key={t} on={form.integrations.includes(t)} onClick={() => toggle('integrations', t)}>
                              {t}
                            </Chip>
                          ))}
                        </div>
                        <input
                          aria-label="Other systems, comma separated"
                          placeholder="Other systems, comma separated (e.g. Tally, Zoho)"
                          value={form.integrationsOther}
                          onChange={(e) => set('integrationsOther', e.target.value)}
                          className={`${input} mt-3`}
                        />
                      </fieldset>
                      <div className="grid gap-5 sm:grid-cols-3">
                        <Field label="Expected users" error={errors.users} id="users">
                          <select id="users" value={form.users} onChange={(e) => set('users', e.target.value)} aria-invalid={!!errors.users} aria-describedby="users-err" className={input}>
                            <option value="">Select…</option>
                            {USERS.map((u) => (
                              <option key={u}>{u}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Budget range" id="budget">
                          <select id="budget" value={form.budget} onChange={(e) => set('budget', e.target.value)} className={input}>
                            <option value="">Select…</option>
                            {BUDGETS.map((u) => (
                              <option key={u}>{u}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Timeline" id="timeline">
                          <select id="timeline" value={form.timeline} onChange={(e) => set('timeline', e.target.value)} className={input}>
                            <option value="">Select…</option>
                            {TIMELINES.map((u) => (
                              <option key={u}>{u}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                      <fieldset aria-invalid={!!errors.deployment} aria-describedby="deployment-err" tabIndex={-1} className="focus:outline-none">
                        <legend className={label}>Deployment preference</legend>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {DEPLOYMENTS.map((d) => (
                            <label
                              key={d.id}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${form.deployment === d.id ? 'border-cyan/50 bg-cyan/[0.05]' : 'border-line hover:border-line-strong'}`}
                            >
                              <input type="radio" name="deployment" value={d.id} checked={form.deployment === d.id} onChange={() => set('deployment', d.id)} className="mt-1 accent-cyan" />
                              <span>
                                <span className="block text-[14px] text-fg">{d.label}</span>
                                <span className="block text-[12px] text-muted">{d.d}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.deployment && <Err id="deployment-err">{errors.deployment}</Err>}
                      </fieldset>
                    </>
                  )}

                  {step === 3 && (
                    <div>
                      <p className="leading-relaxed text-fg-soft">Check the brief on the right. You can go back to change any answer.</p>
                      <dl className="mt-6 divide-y divide-line rounded-xl border border-line">
                        {[
                          ['Contact', `${form.name} · ${form.email}`],
                          ['Company', form.company],
                          ['Solution', brief.typeLabels.join(', ')],
                          ['Users', form.users],
                          ['Budget', form.budget || '—'],
                          ['Timeline', form.timeline || '—'],
                          ['Deployment', DEPLOYMENTS.find((d) => d.id === form.deployment)?.label ?? '—'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4 px-4 py-3 text-[14px]">
                            <dt className="text-muted">{k}</dt>
                            <dd className="text-right text-fg">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      {state === 'error' && <p className="mt-4 text-[13.5px] text-danger">Submission failed. Please try again, or copy the brief and send it to us.</p>}
                    </div>
                  )}
                </div>

                <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
                  <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex h-11 items-center gap-2 px-2 text-sm text-fg-soft hover:text-fg disabled:invisible">
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button type="submit" disabled={state === 'sending'} className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-ink-950 transition-colors hover:bg-white disabled:opacity-60">
                    {step < STEPS.length - 1 ? (
                      <>
                        Continue <ArrowRight size={15} />
                      </>
                    ) : state === 'sending' ? (
                      'Sending…'
                    ) : (
                      <>
                        Finish brief <Check size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Live brief ─────────────────────── */}
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Project brief preview">
            <div className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-soft">
                  <FileText size={14} /> Project brief
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-faint">
                  <Sparkles size={11} /> live
                </span>
              </div>
              <div className="space-y-6 p-6 text-[14px]">
                <div>
                  <p className="text-xl tracking-tight text-fg">{brief.title}</p>
                  <p className="mt-1 text-[12.5px] text-muted">{[form.name, form.role, form.company].filter(Boolean).join(' · ') || 'Your details appear here'}</p>
                </div>
                <BriefBlock title="Problem">{form.problem || <span className="text-faint">Describe the problem in step 2.</span>}</BriefBlock>
                {form.outcome && <BriefBlock title="Success looks like">{form.outcome}</BriefBlock>}
                <BriefBlock title="Suggested building blocks">
                  {brief.blocks.length ? (
                    <ul className="space-y-1.5">
                      {brief.blocks.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-cyan" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-faint">Suggestions appear as you describe the problem.</span>
                  )}
                </BriefBlock>
                {brief.integrations.length > 0 && (
                  <BriefBlock title="Integrations">
                    <span className="flex flex-wrap gap-1.5">
                      {brief.integrations.map((i) => (
                        <span key={i} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-fg-soft">
                          {i}
                        </span>
                      ))}
                    </span>
                  </BriefBlock>
                )}
                {brief.questions.length > 0 && (
                  <BriefBlock title="Open questions for discovery">
                    <ul className="space-y-1.5 text-muted">
                      {brief.questions.map((q) => (
                        <li key={q}>? {q}</li>
                      ))}
                    </ul>
                  </BriefBlock>
                )}
              </div>
              <p className="border-t border-line px-6 py-3 text-[11px] leading-relaxed text-faint">
                Composed in your browser from your answers using simple rules — no AI service is called and nothing is sent until you submit. Your draft is kept on this device.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

const input =
  'w-full rounded-xl border border-line bg-ink-950 px-4 py-3 text-[14.5px] text-fg placeholder:text-faint transition-colors focus:border-cyan/50 focus:outline-none aria-[invalid=true]:border-danger/60'
const label = 'text-[13.5px] text-fg-soft'

function Field({ label: l, id, error, hint, children }: { label: string; id: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={label}>
        {l}
      </label>
      <div className="mt-2">{children}</div>
      {error ? <Err id={`${id}-err`}>{error}</Err> : hint ? <p className="mt-1.5 text-[12px] text-muted">{hint}</p> : null}
    </div>
  )
}

function Err({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-[12.5px] text-danger">
      {children}
    </p>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] transition-colors ${on ? 'border-cyan/50 bg-cyan/[0.08] text-fg' : 'border-line text-muted hover:border-line-strong hover:text-fg-soft'}`}
    >
      {on && <Check size={13} className="text-cyan" />}
      {children}
    </button>
  )
}

function BriefBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{title}</p>
      <div className="mt-2 leading-relaxed text-fg-soft">{children}</div>
    </div>
  )
}
