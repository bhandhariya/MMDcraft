export function SectionHeading({ index, kicker, title, lede }) {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-cyan">
        {index} / {kicker}
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-none text-white sm:text-6xl">{title}</h2>
      {lede ? <p className="mt-5 max-w-xl text-base leading-relaxed text-silver/80 sm:text-lg">{lede}</p> : null}
    </header>
  )
}

export function Boot({ label = 'Loading the floor', error = '' }) {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="font-display text-4xl text-white">MMD Craft</p>
        <p className="mt-4 text-xs uppercase tracking-[0.28em] text-cyan">{error || label}</p>
      </div>
    </div>
  )
}
