import { SectionHeading } from './Ui'
import ProductCard from './ProductCard'

export function Sale({ copy, products, categories, specs, phone, onQuick }) {
  return (
    <section id="sale" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <SectionHeading index="03" kicker={copy?.kicker || 'Sale'} title={copy?.title || 'Sale on.'} lede={copy?.lede} />
      {products.length ? (
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
          {products.map((product) => (
            <div key={product.id} className="w-[82%] shrink-0 snap-start md:w-auto">
              <ProductCard product={product} categories={categories} specs={specs} phone={phone} onQuick={onQuick} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-silver/70">No pieces are on sale right now.</p>
      )}
    </section>
  )
}

export function Working({ copy, products, categories, specs, phone, onQuick }) {
  return (
    <section id="working" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <SectionHeading index="04" kicker={copy?.kicker || 'Bench'} title={copy?.title || 'Working on.'} lede={copy?.lede} />
      {products.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categories={categories}
              specs={specs}
              phone={phone}
              onQuick={onQuick}
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-silver/70">Nothing is on the bench right now.</p>
      )}
    </section>
  )
}
