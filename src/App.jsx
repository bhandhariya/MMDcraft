import { useCallback, useEffect, useState } from 'react'
import { loadCatalog } from './lib/catalog'
import { useQuality } from './lib/quality'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Story from './components/Story'
import Gallery from './components/Gallery'
import QuickView from './components/QuickView'
import { Sale, Working } from './components/Bands'
import Customizer from './components/Customizer'
import Showcase from './components/Showcase'
import { About, Bulk, Contact, Footer } from './components/Enquiry'
import { WhatsDock } from './components/OrderActions'
import { Boot } from './components/Ui'

export default function App() {
  const quality = useQuality()
  const [catalog, setCatalog] = useState(null)
  const [error, setError] = useState('')
  const [active, setActive] = useState(null)
  const [customId, setCustomId] = useState(null)

  useEffect(() => {
    loadCatalog().then(setCatalog).catch((err) => setError(err.message || 'Could not load the catalog'))
  }, [])

  const closeQuick = useCallback(() => setActive(null), [])

  const customise = useCallback((id) => {
    setActive(null)
    setCustomId(id)
    document.getElementById('custom')?.scrollIntoView({ behavior: quality === 'off' ? 'auto' : 'smooth' })
  }, [quality])

  if (error) return <Boot error={error} />
  if (!catalog) return <Boot />

  const { site, categories, products, specs } = catalog
  const phone = site.whatsapp || ''
  const sale = products.filter((product) => product.onSale)
  const working = products.filter((product) => product.status === 'working')
  const ticker = [...products.map((product) => product.name), ...categories.map((item) => item.name)]

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 grid-fade opacity-50" aria-hidden="true" />
      <a href="#collection" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:text-obsidian">
        Skip to collection
      </a>
      <Nav brand={site.brand || 'MMD Craft'} />
      <main className="relative">
        <Hero site={{ ...site, ticker }} count={products.length} quality={quality} />
        <Story site={site} quality={quality} />
        <Gallery products={products} categories={categories} specs={specs} phone={phone} onQuick={setActive} />
        <Sale copy={site.sale} products={sale} categories={categories} specs={specs} phone={phone} onQuick={setActive} />
        <Working copy={site.working} products={working} categories={categories} specs={specs} phone={phone} onQuick={setActive} />
        <Customizer
          products={products}
          categories={categories}
          specs={specs}
          phone={phone}
          customId={customId}
          quality={quality}
        />
        <Showcase steps={site.showcase} quality={quality} />
        <Bulk copy={site.bulk} specs={specs} phone={phone} />
        <About about={site.about} />
        <Contact copy={site.contact} site={site} phone={phone} />
      </main>
      <Footer brand={site.brand || 'MMD Craft'} />
      <WhatsDock
        phone={phone}
        text={'Hello MMD Craft,\n\nI want to place an order. Please share what you can make.'}
      />
      <QuickView
        product={active}
        categories={categories}
        specs={specs}
        phone={phone}
        onClose={closeQuick}
        onCustomise={customise}
      />
    </div>
  )
}
