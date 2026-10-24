import { lazy, Suspense, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { asset } from '../lib/asset'
import { SceneBoundary } from './SceneBoundary'

const HeroScene = lazy(() => import('../three/HeroScene.jsx'))

const SLOTS = [
  'left-[6%] top-[10%] w-[48%] -rotate-6',
  'right-[4%] top-[16%] w-[50%] rotate-6',
  'left-[20%] bottom-[6%] w-[52%] -rotate-2',
]
const DRIFT = ['drift', 'drift drift-late', 'drift drift-later']

function CssPlaques({ images }) {
  return (
    <div className="absolute inset-0">
      {images.slice(0, 3).map((src, index) => (
        <div key={src} className={`absolute ${SLOTS[index]}`}>
          <div className={DRIFT[index]}>
            <div className="holo-frame overflow-hidden rounded-2xl shadow-glow">
              <img
                src={asset(src)}
                alt=""
                className="aspect-[4/5] w-full bg-[#10141c] object-contain"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-cyan/15" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Hero({ site, count, quality }) {
  const hero = site.hero || {}
  const images = hero.images || []
  const lines = hero.lines || ['MMD Craft']
  const reduce = useReducedMotion()
  const stageRef = useRef(null)
  const inView = useInView(stageRef, { margin: '180px 0px', amount: 0.15 })
  const show3d = quality !== 'off' && inView
  const names = (site.ticker || []).concat(site.ticker || [])

  return (
    <section id="top" className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-5 pb-10 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <div>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-cyan"
        >
          {hero.kicker}
        </motion.p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] text-white sm:text-7xl">
          {lines.map((line, index) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className={`block ${index === 0 ? 'text-shine' : ''}`}
                initial={reduce ? false : { y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.85, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-silver/80">{hero.lede}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className="btn-solid" href="#collection">View the collection</a>
          <a className="btn-ghost" href="#custom">Build a piece</a>
        </div>
        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
          {[
            [String(count).padStart(2, '0'), 'Pieces on the floor'],
            ['03', 'Materials'],
            ['01', 'Message to order'],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="font-display text-2xl text-white">{value}</dt>
              <dd className="mt-1 text-xs leading-snug text-silver/70">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div ref={stageRef} className="relative h-[460px] sm:h-[580px]">
        <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-ink">
          <CssPlaques images={images} />
          {show3d ? (
            <div className="absolute inset-0">
              <Suspense fallback={null}>
                <SceneBoundary fallback={null}>
                  <HeroScene images={images} quality={quality} />
                </SceneBoundary>
              </Suspense>
            </div>
          ) : null}
        </div>
        <p className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-silver backdrop-blur">
          {quality === 'off' ? 'Still preview' : quality === 'high' ? 'Move to look' : 'Live preview'}
        </p>
      </div>
      {names.length ? (
        <div className="col-span-full overflow-hidden border-y border-white/10 py-3 text-xs uppercase tracking-[0.28em] text-silver/60 lg:col-span-2">
          <div className="ticker-track">
            {names.map((name, index) => (
              <span key={`${name}-${index}`}>{name}</span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
