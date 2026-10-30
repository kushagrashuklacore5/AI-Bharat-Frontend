import { useMemo, useState } from 'react'
import { DemoBadge } from '../ui/DemoBadge'

/**
 * ILLUSTRATIVE DATA ONLY. These are not real GPU models, inventory or prices.
 * Replace with partner-sourced catalogue data before using commercially.
 */
interface Tier {
  id: string
  name: string
  vram: number
  bestFor: string
  availability: 'On demand' | 'Limited' | 'Reserved'
  hourly: number // INR, illustrative
  deployment: string[]
}

const TIERS: Tier[] = [
  { id: 'g1', name: 'Inference · Entry', vram: 16, bestFor: 'Small models, embeddings, prototyping', availability: 'On demand', hourly: 60, deployment: ['Hourly', 'Monthly'] },
  { id: 'g2', name: 'Inference · Standard', vram: 24, bestFor: 'Production inference for 7–13B models', availability: 'On demand', hourly: 110, deployment: ['Hourly', 'Monthly', 'Dedicated'] },
  { id: 'g3', name: 'Training · Performance', vram: 48, bestFor: 'Fine-tuning, larger-context inference', availability: 'Limited', hourly: 240, deployment: ['Hourly', 'Monthly', 'Dedicated'] },
  { id: 'g4', name: 'Training · Flagship', vram: 80, bestFor: 'Large-model training & high-throughput serving', availability: 'Reserved', hourly: 420, deployment: ['Monthly', 'Dedicated'] },
]

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export function GpuCatalogue() {
  const [sel, setSel] = useState('g2')
  const [count, setCount] = useState(1)
  const [hours, setHours] = useState(8)
  const [days, setDays] = useState(22)
  const [mode, setMode] = useState<'Hourly' | 'Monthly'>('Hourly')
  const tier = TIERS.find((t) => t.id === sel)!
  const monthlyOk = tier.deployment.includes('Monthly')
  const hourlyOk = tier.deployment.includes('Hourly')
  const effMode = mode === 'Hourly' && !hourlyOk ? 'Monthly' : mode === 'Monthly' && !monthlyOk ? 'Hourly' : mode

  const est = useMemo(() => {
    if (effMode === 'Hourly') return tier.hourly * count * hours * days
    // illustrative monthly commitment: 730h at a 30% discount
    return tier.hourly * count * 730 * 0.7
  }, [tier, count, hours, days, effMode])

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-soft">Compute catalogue</p>
        <DemoBadge label="Demonstration data — not live inventory or pricing" />
      </div>
      <div className="grid lg:grid-cols-[1.6fr_1fr]">
        {/* table */}
        <div className="overflow-x-auto border-b border-line lg:border-b-0 lg:border-r">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <caption className="sr-only">Illustrative GPU configurations</caption>
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                <th className="px-5 py-3 font-normal sm:px-6">Configuration</th>
                <th className="px-3 py-3 font-normal">VRAM</th>
                <th className="px-3 py-3 font-normal">Availability</th>
                <th className="whitespace-nowrap px-3 py-3 font-normal">₹ / hr*</th>
                <th className="px-3 py-3 font-normal">Deployment</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => {
                const on = t.id === sel
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSel(t.id)}
                    className={`cursor-pointer border-t border-line transition-colors ${on ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input type="radio" name="gpu-tier" checked={on} onChange={() => setSel(t.id)} className="mt-1 accent-cyan" />
                        <span>
                          <span className="block text-fg">{t.name}</span>
                          <span className="block text-[12px] text-muted">{t.bestFor}</span>
                        </span>
                      </label>
                    </td>
                    <td className="px-3 py-4">
                      <span className="font-mono text-fg-soft">{t.vram} GB</span>
                      <span className="mt-1.5 block h-1 w-16 overflow-hidden rounded-full bg-ink-700">
                        <span className="block h-full rounded-full bg-cyan/70" style={{ width: `${(t.vram / 80) * 100}%` }} />
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-fg-soft">
                        <span className={`size-1.5 rounded-full ${t.availability === 'On demand' ? 'bg-leaf' : t.availability === 'Limited' ? 'bg-amber' : 'bg-electric'}`} />
                        {t.availability}
                      </span>
                    </td>
                    <td className="px-3 py-4 font-mono text-fg">{fmt(t.hourly)}</td>
                    <td className="px-3 py-4">
                      <span className="flex flex-wrap gap-1">
                        {t.deployment.map((d) => (
                          <span key={d} className="rounded-md border border-line px-1.5 py-0.5 text-[10.5px] text-muted">
                            {d}
                          </span>
                        ))}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="px-5 pb-4 pt-2 text-[11px] text-faint sm:px-6">
            * Example figures to demonstrate the estimator. Actual configurations and rates depend on partner availability and are quoted on request.
          </p>
        </div>

        {/* estimator */}
        <div className="p-5 sm:p-6">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">Cost estimator</p>
          <p className="mt-2 text-fg">{tier.name}</p>
          <div className="mt-5 inline-flex rounded-full border border-line p-1" role="radiogroup" aria-label="Billing model">
            {(['Hourly', 'Monthly'] as const).map((m) => {
              const ok = tier.deployment.includes(m)
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={effMode === m}
                  disabled={!ok}
                  onClick={() => setMode(m)}
                  className={`rounded-full px-4 py-1.5 text-[12.5px] transition-colors disabled:opacity-30 ${effMode === m ? 'bg-fg text-ink-950' : 'text-muted hover:text-fg'}`}
                >
                  {m === 'Hourly' ? 'Pay as you go' : 'Monthly'}
                </button>
              )
            })}
          </div>
          <Range label="GPUs" value={count} min={1} max={8} onChange={setCount} suffix={count > 1 ? 'GPUs' : 'GPU'} />
          {effMode === 'Hourly' && (
            <>
              <Range label="Hours per day" value={hours} min={1} max={24} onChange={setHours} suffix="h" />
              <Range label="Days per month" value={days} min={1} max={31} onChange={setDays} suffix="days" />
            </>
          )}
          <div className="mt-6 rounded-2xl border border-line bg-ink-950 p-5">
            <p className="text-[12px] text-muted">Estimated monthly cost (illustrative)</p>
            <p className="mt-1 font-mono text-3xl tracking-tight text-fg">{fmt(est)}</p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
              {effMode === 'Hourly'
                ? `${count} × ${hours}h × ${days} days, billed only for usage.`
                : `${count} GPU${count > 1 ? 's' : ''} reserved for the full month at an example commitment discount.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Range({ label, value, min, max, onChange, suffix }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void; suffix: string }) {
  return (
    <label className="mt-5 block">
      <span className="flex justify-between text-[12.5px]">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-fg-soft">
          {value} {suffix}
        </span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-cyan" />
    </label>
  )
}
