import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { asset } from '../lib/asset'
import { SectionHeading } from './Ui'

export default function Showcase({ steps, quality }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const list = steps || []

  useEffect(() => {
    if (paused || quality === 'off' || list.length < 2) return undefined
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % list.length)
    }, 3800)
    return () => window.clearInterval(id)
  }, [paused, quality, list.length])

  if (!list.length) return null
  const step = list[active]

  return (
    <section id="workshop" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeading
        index="06"
        kicker="Manufacturing"
        title="The bench."
        lede="Artwork, print, cut, hardware, then a finish check. These frames are from the current pieces."
      />
      <div
        className="mt-10 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <ol className="space-y-2">
          {list.map((item, index) => {
            const on = index === active
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className={`flex w-full gap-4 rounded-3xl border px-4 py-4 text-left transition ${on ? 'border-cyan/50 bg-cyan/10 shadow-glow' : 'border-white/10 hover:border-white/25'}`}
                >
                  <span className="font-mono text-xs text-cyan">{item.index}</span>
                  <span>
                    <span className="block font-display text-2xl text-white">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-silver/75">{item.text}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        <div className="holo-frame relative min-h-[420px] overflow-hidden rounded-[28px] bg-ink">
          <AnimatePresence mode="wait">
            <motion.img
              key={step.image}
              src={asset(step.image)}
              alt={step.title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: quality === 'off' ? 0 : 0.45 }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </AnimatePresence>
          <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
            {step.index} {step.title}
          </div>
        </div>
      </div>
    </section>
  )
}
