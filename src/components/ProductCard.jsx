import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'
import { categoryName, rateLine } from '../lib/catalog'
import { orderMessage } from '../lib/whatsapp'
import { CallButton, WhatsAppButton } from './OrderActions'

export function productOrder(product, categories, specs) {
  const materialId = product.materials?.[0]
  const material = specs.materials.find((item) => item.id === materialId)?.name || materialId
  return orderMessage({
    name: product.name,
    category: categoryName(categories, product.category),
    material,
    thickness: product.defaultThickness,
    width: product.widthMm,
    height: product.heightMm,
    quantity: 1,
    hooks: product.hooks,
    priceLabel: rateLine(product) === 'Ask for the rate' ? '' : rateLine(product),
  })
}

export function badgeFor(product) {
  if (product.badge) return product.badge
  if (product.onSale) return 'Sale on'
  if (product.status === 'working') return 'On the bench'
  return ''
}

export default function ProductCard({ product, categories, specs, phone, onQuick, priority = false }) {
  const ref = useRef(null)
  const [fine, setFine] = useState(false)
  const [broken, setBroken] = useState(false)
  const badge = badgeFor(product)
  const canOrder = product.orderable !== false
  const text = productOrder(product, categories, specs)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setFine(window.matchMedia('(pointer: fine)').matches && !reduce)
  }, [])

  function onMove(event) {
    if (!fine) return
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    node.style.transition = 'transform 60ms linear'
    node.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 7}deg) translateY(-4px)`
  }

  function onLeave() {
    const node = ref.current
    if (!node) return
    node.style.transition = 'transform 420ms ease'
    node.style.transform = 'rotateY(0deg) rotateX(0deg)'
  }

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] holo-frame bg-ink [transform-style:preserve-3d]"
    >
      <div className="relative h-72 overflow-hidden bg-[#0c1016]">
        {product.images[0] && !broken ? (
          <img
            src={asset(product.images[0])}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setBroken(true)}
            className="h-full w-full object-contain motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-silver/60">{product.name}</div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(62,240,255,0.16)_48%,rgba(255,255,255,0.18)_52%,transparent_68%)] opacity-0 motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:opacity-100" />
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full border border-cyan/40 bg-obsidian/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-silver/55">
          {categoryName(categories, product.category)}
          {product.hooks ? ` · ${product.hooks} hooks` : ''}
          {` · ${product.widthMm} × ${product.heightMm} mm`}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight text-white">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-silver/75">{product.summary}</p>
        <p className="mt-4 font-medium text-cyan">{rateLine(product)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={() => onQuick(product)}>
            Quick view
          </button>
          {canOrder ? <CallButton phone={phone} text={text} className="btn-ghost">Call to order</CallButton> : null}
          {canOrder ? (
            <WhatsAppButton phone={phone} text={text} className="btn-solid">
              WhatsApp
            </WhatsAppButton>
          ) : null}
        </div>
      </div>
    </article>
  )
}
