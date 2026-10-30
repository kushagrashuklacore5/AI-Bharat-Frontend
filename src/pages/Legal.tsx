import { useEffect } from 'react'
import { Link } from 'react-router'
import { SITE } from '../lib/config'

export default function LegalPage() {
  useEffect(() => {
    document.title = 'Legal — AI Bharat'
  }, [])
  return (
    <div className="container-x max-w-3xl pb-28 pt-36 md:pt-44">
      <p className="eyebrow">Legal</p>
      <h1 className="display mt-6 text-[clamp(2.2rem,5vw,3.8rem)]">Policies</h1>
      <p className="mt-6 leading-relaxed text-fg-soft">
        AI Bharat is owned by {SITE.owner}. Our formal policies are being finalised and will be published here.
      </p>
      <section id="privacy" className="mt-14 scroll-mt-28 border-t border-line pt-10">
        <h2 className="text-2xl text-fg">Privacy</h2>
        <p className="mt-4 leading-relaxed text-muted">
          This website does not include analytics or advertising trackers; web fonts are loaded from Google Fonts. Forms on this site do not transmit data unless an online submission endpoint has been
          configured; draft answers in the project brief are stored only in your own browser. For any privacy question, please{' '}
          <Link to="/contact" className="text-cyan underline-offset-4 hover:underline">
            contact us
          </Link>
          .
        </p>
      </section>
      <section id="terms" className="mt-12 scroll-mt-28 border-t border-line pt-10">
        <h2 className="text-2xl text-fg">Terms</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Product demonstrations, configurations and prices shown on this website are illustrative and do not constitute an offer. Commercial terms are agreed per
          engagement in writing.
        </p>
      </section>
    </div>
  )
}
