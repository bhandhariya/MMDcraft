import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { asset } from '../lib/asset'
import { categoryName, materialName, rateLine } from '../lib/catalog'
import { orderMessage } from '../lib/whatsapp'
import { SectionHeading } from './Ui'
import { SceneBoundary } from './SceneBoundary'
import CssPreview from './CssPreview'
import { WhatsAppButton } from './OrderActions'

const MaterialPreview = lazy(() => import('../three/MaterialPreview.jsx'))

function closest(list, value) {
  if (!list?.length) return value
  return list.reduce((best, item) => (Math.abs(item - value) < Math.abs(best - value) ? item : best))
}

function blankForm(specs) {
  const material = specs.materials[0]?.id || 'mdf'
  const thickness = specs.materials[0]?.thicknesses?.[2] || specs.materials[0]?.thicknesses?.[0] || 6
  return {
    id: 'custom',
    name: 'Custom piece',
    category: 'Custom',
    material,
    thickness,
    width: 200,
    height: 200,
    quantity: 1,
    notes: '',
    image: '',
    hooks: 0,
    preview: true,
  }
}

function fromProduct(product, specs, categories) {
  const material = product.materials?.[0] || specs.materials[0]?.id || 'mdf'
  const options = specs.materials.find((item) => item.id === material)?.thicknesses || [6]
  const thickness = options.includes(product.defaultThickness) ? product.defaultThickness : closest(options, product.defaultThickness)
  return {
    id: product.id,
    name: product.name,
    category: categoryName(categories, product.category),
    material,
    thickness,
    width: product.widthMm,
    height: product.heightMm,
    quantity: 1,
    notes: '',
    image: product.images[0] || '',
    hooks: product.hooks,
    preview: product.preview !== false,
    priceLabel: rateLine(product) === 'Ask for the rate' ? '' : rateLine(product),
  }
}

export default function Customizer({ products, categories, specs, phone, customId, quality }) {
  const [form, setForm] = useState(() => (products[0] ? fromProduct(products[0], specs, categories) : blankForm(specs)))
  const stageRef = useRef(null)
  const inView = useInView(stageRef, { margin: '120px 0px', amount: 0.2 })
  const webgl = quality === 'high' || quality === 'medium'

  useEffect(() => {
    if (!customId) return
    const product = products.find((item) => item.id === customId)
    if (product) setForm(fromProduct(product, specs, categories))
  }, [customId, products, specs, categories])

  const material = specs.materials.find((item) => item.id === form.material) || specs.materials[0]
  const thicknesses = material?.thicknesses || [6]
  const limits = specs.limits

  const errors = useMemo(() => {
    const next = []
    const width = Number(form.width)
    const height = Number(form.height)
    const quantity = Number(form.quantity)
    if (!Number.isFinite(width) || width < limits.minMm || width > limits.maxMm) {
      next.push(`Width must be ${limits.minMm}–${limits.maxMm} mm.`)
    }
    if (!Number.isFinite(height) || height < limits.minMm || height > limits.maxMm) {
      next.push(`Height must be ${limits.minMm}–${limits.maxMm} mm.`)
    }
    if (!Number.isInteger(quantity) || quantity < limits.minQty || quantity > limits.maxQty) {
      next.push(`Quantity must be ${limits.minQty}–${limits.maxQty}.`)
    }
    return next
  }, [form.width, form.height, form.quantity, limits])

  const message = orderMessage({
    name: form.name,
    category: form.category,
    material: materialName(specs, form.material),
    thickness: form.thickness,
    width: form.width,
    height: form.height,
    quantity: form.quantity,
    hooks: form.hooks,
    notes: form.notes.trim(),
    priceLabel: form.priceLabel,
  })

  function chooseMaterial(id) {
    const nextMaterial = specs.materials.find((item) => item.id === id)
    const options = nextMaterial?.thicknesses || [6]
    setForm((current) => ({
      ...current,
      material: id,
      thickness: options.includes(current.thickness) ? current.thickness : closest(options, current.thickness),
    }))
  }

  function setNumber(key, value) {
    setForm((current) => ({ ...current, [key]: value === '' ? '' : Number(value) }))
  }

  return (
    <section id="custom" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeading
        index="05"
        kicker="Custom orders"
        title="Build your piece."
        lede="Choose MDF, acrylic, or sublimation. Set the thickness, the size, and the quantity. The slip below is the message WhatsApp will send."
      />
      <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
        {products.map((product) => {
          const on = form.id === product.id
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => setForm(fromProduct(product, specs, categories))}
              className={`w-28 shrink-0 overflow-hidden rounded-2xl border text-left ${on ? 'border-cyan shadow-glow' : 'border-white/10'}`}
            >
              <img src={asset(product.images[0])} alt="" className="h-20 w-full bg-[#0c1016] object-contain" />
              <span className="block px-2 py-2 text-[11px] leading-tight text-silver">{product.name}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setForm(blankForm(specs))}
          className={`grid w-28 shrink-0 place-items-center rounded-2xl border px-3 text-left text-xs text-silver ${form.id === 'custom' ? 'border-cyan shadow-glow' : 'border-white/10'}`}
        >
          Your own size
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div ref={stageRef} className="relative holo-frame h-[420px] overflow-hidden rounded-[28px] bg-ink">
          {form.preview && webgl && inView ? (
            <Suspense fallback={<CssPreview {...previewProps(form)} />}>
              <SceneBoundary fallback={<CssPreview {...previewProps(form)} />}>
                <MaterialPreview
                  image={form.image}
                  material={form.material}
                  thickness={Number(form.thickness) || 6}
                  widthMm={Number(form.width) || 200}
                  heightMm={Number(form.height) || 200}
                />
              </SceneBoundary>
            </Suspense>
          ) : (
            <CssPreview {...previewProps(form)} />
          )}
          <p className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-silver/80 backdrop-blur">
            Simplified sheet
          </p>
        </div>

        <form
          className="glass rounded-[28px] p-5 sm:p-6"
          onSubmit={(event) => event.preventDefault()}
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan">Material</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {specs.materials.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseMaterial(item.id)}
                className={`rounded-2xl border p-3 text-left ${form.material === item.id ? 'chip-on' : 'border-white/10'}`}
              >
                <span className="block font-medium text-white">{item.name}</span>
                <span className="mt-1 block text-xs leading-snug text-silver/70">{item.description}</span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-cyan">Thickness</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {thicknesses.map((value) => (
              <button
                key={value}
                type="button"
                className={`chip ${form.thickness === value ? 'chip-on' : ''}`}
                onClick={() => setForm((current) => ({ ...current, thickness: value }))}
              >
                {value} mm
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="text-sm text-silver">
              Width (mm)
              <input className="field" inputMode="numeric" value={form.width} onChange={(event) => setNumber('width', event.target.value)} />
            </label>
            <label className="text-sm text-silver">
              Height (mm)
              <input className="field" inputMode="numeric" value={form.height} onChange={(event) => setNumber('height', event.target.value)} />
            </label>
            <label className="text-sm text-silver">
              Quantity
              <input className="field" inputMode="numeric" value={form.quantity} onChange={(event) => setNumber('quantity', event.target.value)} />
            </label>
          </div>

          <label className="mt-4 block text-sm text-silver">
            Notes
            <textarea
              className="field min-h-24 resize-y"
              maxLength={400}
              placeholder="Artwork notes, hook count, or a finish."
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            />
          </label>
          <p className="mt-1 text-right text-xs text-silver/50">{form.notes.length}/400</p>

          {errors.length ? (
            <ul className="mt-3 space-y-1 text-sm text-cyan">
              {errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          ) : null}

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-silver/60">WhatsApp slip</p>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-silver">{message}</pre>
          </div>

          <div className="mt-4">
            <WhatsAppButton
              phone={phone}
              text={message}
              disabled={errors.length > 0}
              className="btn-solid w-full"
            >
              Send this order on WhatsApp
            </WhatsAppButton>
          </div>
        </form>
      </div>
    </section>
  )
}

function previewProps(form) {
  return {
    image: form.image,
    material: form.material,
    thickness: Number(form.thickness) || 6,
    widthMm: Number(form.width) || 200,
    heightMm: Number(form.height) || 200,
    name: form.name,
  }
}
