import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const LINKS = [
  ['Story', '#story'],
  ['Collection', '#collection'],
  ['Sale On', '#sale'],
  ['Working On', '#working'],
  ['Custom', '#custom'],
  ['Workshop', '#workshop'],
  ['Bulk', '#bulk'],
  ['About', '#about'],
  ['Contact', '#contact'],
]

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect x="5" y="6" width="16" height="13" rx="1.5" fill="none" stroke="#d5dee8" strokeWidth="1.4" />
      <rect x="11" y="13" width="16" height="13" rx="1.5" fill="none" stroke="#3ef0ff" strokeWidth="1.4" />
    </svg>
  )
}

export default function Nav({ brand }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-obsidian/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-5 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <Mark />
          <span className="font-display text-lg tracking-wide text-white">{brand}</span>
        </a>
        <nav className="nav-scroll ml-auto hidden max-w-[68vw] overflow-x-auto lg:block" aria-label="Sections">
          <ul className="flex items-center gap-5 whitespace-nowrap text-[13px] text-silver/80">
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <a className="transition hover:text-cyan" href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#custom" className="btn-solid ml-auto hidden sm:inline-flex lg:ml-4">
          Custom order
        </a>
        <button
          type="button"
          className="btn-ghost ml-auto px-3 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/10 bg-obsidian/95 px-5 py-4 lg:hidden"
          >
            <ul className="grid gap-1">
              {LINKS.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block rounded-2xl px-3 py-3 text-silver hover:bg-white/5 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
