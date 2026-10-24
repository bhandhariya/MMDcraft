import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset'
import { SectionHeading } from './Ui'
import { SceneBoundary } from './SceneBoundary'

gsap.registerPlugin(ScrollTrigger)

const StoryScene = lazy(() => import('../three/StoryScene.jsx'))

export default function Story({ site, quality }) {
  const story = site.story
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const progressRef = useRef(0)
  const barRef = useRef(null)
  const labelRefs = useRef([])
  const inView = useInView(stageRef, { margin: '160px 0px', amount: 0.2 })
  const use3d = quality === 'high' && Boolean(story?.image)

  useLayoutEffect(() => {
    if (!use3d) return undefined
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.65,
        onUpdate: (self) => {
          progressRef.current = self.progress
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
          labelRefs.current.forEach((node, index) => {
            if (!node) return
            const center = (index + 0.5) / labelRefs.current.length
            const near = 1 - Math.min(Math.abs(self.progress - center) * 3.1, 1)
            node.style.opacity = String(0.32 + near * 0.68)
          })
        },
      })
    }, rootRef)
    return () => context.revert()
  }, [use3d])

  if (!story) return null
  const layers = story.layers || []

  return (
    <section id="story" ref={rootRef} className={use3d ? 'relative h-[230vh]' : 'relative py-24'}>
      <div className={use3d ? 'sticky top-0 flex h-screen items-center' : ''}>
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading index="01" kicker={story.kicker} title={story.title} lede={story.lede} />
            <ol className="mt-8 space-y-4">
              {layers.map((layer, index) => (
                <li
                  key={layer.id}
                  ref={(node) => {
                    labelRefs.current[index] = node
                  }}
                  className="border-l border-cyan/40 pl-4"
                  style={use3d ? { opacity: 0.92 } : undefined}
                >
                  <p className="font-display text-xl text-white">{layer.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-silver/75">{layer.text}</p>
                </li>
              ))}
            </ol>
            {use3d ? (
              <div className="mt-8 h-px w-full max-w-sm bg-white/10">
                <div ref={barRef} className="h-px origin-left scale-x-0 bg-cyan" />
              </div>
            ) : null}
          </div>
          <div ref={stageRef} className="relative h-[420px] overflow-hidden rounded-[28px] bg-ink sm:h-[520px]">
            {use3d && inView ? (
              <Suspense fallback={<LayerStack image={story.image} layers={layers} still={quality === 'off'} />}>
                <SceneBoundary fallback={<LayerStack image={story.image} layers={layers} still />}>
                  <StoryScene image={story.image} progressRef={progressRef} quality={quality} />
                </SceneBoundary>
              </Suspense>
            ) : (
              <LayerStack image={story.image} layers={layers} still={quality === 'off'} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function LayerStack({ image, layers, still }) {
  const tones = ['bg-[#8d6a42]', 'bg-transparent', 'bg-cyan/15']
  return (
    <div className="relative mx-auto h-full w-full max-w-md">
      {(layers.length ? layers : [{ id: 'sheet', name: 'Sheet' }]).map((layer, index) => (
        <motion.div
          key={layer.id}
          className="absolute inset-x-4 overflow-hidden rounded-3xl border border-white/15 shadow-glow"
          style={{ top: 24 + index * 36 }}
          initial={false}
          whileInView={still ? undefined : { y: index * 16 - 18, rotate: (index - 1) * 3.5 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: still ? 0 : 0.8, delay: index * 0.06 }}
        >
          {index === 1 && image ? (
            <img src={asset(image)} alt="" className="h-52 w-full object-cover sm:h-64" />
          ) : (
            <div className={`h-52 sm:h-64 ${tones[index] || 'bg-ink'}`} />
          )}
          <p className="absolute bottom-3 left-4 text-xs uppercase tracking-[0.22em] text-white">{layer.name}</p>
        </motion.div>
      ))}
    </div>
  )
}
