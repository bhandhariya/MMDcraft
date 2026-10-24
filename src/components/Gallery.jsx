import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from './Ui'
import ProductCard from './ProductCard'

export default function Gallery({ products, categories, specs, phone, onQuick }) {
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? products : products.filter((product) => product.category === filter)
  const filters = [{ id: 'all', name: 'All' }, ...categories]

  return (
    <section id="collection" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index="02"
          kicker="The floor"
          title="Collection."
          lede="Every card is a real piece from the catalog. Filter by category, then open a quick view or send the spec on WhatsApp."
        />
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categories">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={`chip ${filter === item.id ? 'chip-on' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <motion.div
        key={filter}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-10 grid gap-5 [perspective:1200px] sm:grid-cols-2 xl:grid-cols-3"
      >
        {shown.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            categories={categories}
            specs={specs}
            phone={phone}
            onQuick={onQuick}
            priority={index < 3}
          />
        ))}
      </motion.div>
      {shown.length === 0 ? (
        <p className="mt-8 text-silver/70">No pieces in this category yet.</p>
      ) : null}
    </section>
  )
}
