import { asset } from '../lib/asset'

export default function CssPreview({ image, material, thickness, widthMm, heightMm, name }) {
  const wide = widthMm >= heightMm
  const edge = material === 'acrylic'
    ? 'rgba(190, 248, 255, 0.9)'
    : material === 'sublimation'
      ? 'rgba(62, 240, 255, 0.75)'
      : 'rgba(166, 124, 74, 0.95)'
  const border = Math.max(4, Math.min(18, Number(thickness) || 6))

  return (
    <div className="grid h-full place-items-center p-6">
      <div
        className="relative overflow-hidden rounded-2xl bg-[#12161e] shadow-glow"
        style={{
          aspectRatio: `${Math.max(widthMm, 1)} / ${Math.max(heightMm, 1)}`,
          width: wide ? '78%' : 'auto',
          height: wide ? 'auto' : '78%',
          maxWidth: '100%',
          maxHeight: '100%',
          border: `${border}px solid ${edge}`,
          boxShadow: material === 'acrylic'
            ? 'inset 0 0 28px rgba(62,240,255,0.28), 0 18px 40px rgba(0,0,0,0.35)'
            : undefined,
        }}
      >
        {image ? (
          <img src={asset(image)} alt={name || ''} className="h-full w-full object-contain" />
        ) : (
          <div className="grid h-full min-h-40 w-full min-w-40 place-items-center text-sm text-silver/70">Your artwork</div>
        )}
        {material === 'acrylic' ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-cyan/20" />
        ) : null}
      </div>
    </div>
  )
}
