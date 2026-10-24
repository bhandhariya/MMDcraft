import { useEffect, useState } from 'react'
import { asset } from '../lib/asset'
import { categoryName, materialName, rateLine } from '../lib/catalog'
import { CallButton, WhatsAppButton } from './OrderActions'
import { productOrder } from './ProductCard'

export default function QuickView({ product, categories, specs, phone, onClose, onCustomise }) {
  const [shot, setShot] = useState(0)

  useEffect(() => {
    setShot(0)
  }, [product?.id])

  useEffect(() => {
    if (!product) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [product, onClose])

  if (!product) return null
  const images = product.images.length ? product.images : ['']
  const text = productOrder(product, categories, specs)

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-title"
        className="glass max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] p-4 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-3xl bg-[#0c1016]">
              {images[shot] ? (
                <img src={asset(images[shot])} alt={product.name} className="max-h-[520px] w-full object-contain" />
              ) : null}
            </div>
            {images.length > 1 ? (
              <div className="mt-3 flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={`h-14 w-14 overflow-hidden rounded-xl border ${index === shot ? 'border-cyan' : 'border-white/15'}`}
                    onClick={() => setShot(index)}
                  >
                    <img src={asset(image)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan">Quick view</p>
              <button type="button" className="btn-ghost px-3" onClick={onClose}>
                Close
              </button>
            </div>
            <h2 id="quick-title" className="mt-3 font-display text-4xl leading-none text-white">
              {product.name}
            </h2>
            <p className="mt-3 text-silver/80">{product.summary}</p>
            <p className="mt-4 text-lg text-cyan">{rateLine(product)}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 p-3">
                <dt className="text-silver/55">Category</dt>
                <dd className="mt-1 text-white">{categoryName(categories, product.category)}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 p-3">
                <dt className="text-silver/55">Size</dt>
                <dd className="mt-1 text-white">{product.widthMm} × {product.heightMm} mm</dd>
              </div>
              <div className="rounded-2xl border border-white/10 p-3">
                <dt className="text-silver/55">Thickness</dt>
                <dd className="mt-1 text-white">{product.defaultThickness} mm</dd>
              </div>
              <div className="rounded-2xl border border-white/10 p-3">
                <dt className="text-silver/55">Hooks</dt>
                <dd className="mt-1 text-white">{product.hooks || 'None'}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.materials.map((id) => (
                <span key={id} className="chip chip-on inline-flex items-center">
                  {materialName(specs, id)}
                </span>
              ))}
            </div>
            {product.specs?.length ? (
              <ul className="mt-5 space-y-2 text-sm text-silver/80">
                {product.specs.map((line) => (
                  <li key={line} className="border-l border-cyan/40 pl-3">{line}</li>
                ))}
              </ul>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-2">
              <CallButton phone={phone} text={text} className="btn-ghost">Call to order</CallButton>
              <WhatsAppButton phone={phone} text={text} className="btn-solid">Order on WhatsApp</WhatsAppButton>
              <button type="button" className="btn-ghost" onClick={() => onCustomise(product.id)}>
                Customise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
