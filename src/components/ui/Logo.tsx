import { Link } from 'react-router'

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#e09a52" />
          <stop offset=".55" stopColor="#3fc1c9" />
          <stop offset="1" stopColor="#5b8cff" />
        </linearGradient>
      </defs>
      <path d="M16 4.5 27 10.5 16 16.5 5 10.5Z" fill="none" stroke="url(#logo-g)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 15.5 16 21.5 27 15.5" fill="none" stroke="#9fb3d6" strokeOpacity=".6" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 20.5 16 26.5 27 20.5" fill="none" stroke="#9fb3d6" strokeOpacity=".35" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="16" cy="10.5" r="1.6" fill="#e8eef8" />
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="AI Bharat — home">
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-[0.14em] text-fg">
        AI<span className="ml-1.5 font-normal text-fg-soft">BHARAT</span>
      </span>
    </Link>
  )
}
