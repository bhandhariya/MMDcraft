async function readJson(name) {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}`)
  if (!response.ok) throw new Error(`Could not load data/${name}`)
  return response.json()
}

function normalizeProduct(raw, index) {
  const images = Array.isArray(raw.images) ? raw.images.filter(Boolean) : []
  return {
    ...raw,
    id: String(raw.id || `product-${index + 1}`),
    name: raw.name || `Piece ${index + 1}`,
    category: raw.category || 'custom',
    materials: Array.isArray(raw.materials) && raw.materials.length ? raw.materials : ['mdf'],
    defaultThickness: Number(raw.defaultThickness) || 6,
    widthMm: Number(raw.widthMm) || 200,
    heightMm: Number(raw.heightMm) || 200,
    hooks: Number(raw.hooks) || 0,
    price: raw.price == null || raw.price === '' ? null : Number(raw.price),
    salePrice: raw.salePrice == null || raw.salePrice === '' ? null : Number(raw.salePrice),
    onSale: Boolean(raw.onSale),
    status: raw.status || 'available',
    badge: raw.badge || '',
    preview: raw.preview !== false,
    images,
    summary: raw.summary || '',
    specs: Array.isArray(raw.specs) ? raw.specs : [],
  }
}

export async function loadCatalog() {
  const [site, categoryFile, productFile, specs] = await Promise.all([
    readJson('site.json'),
    readJson('categories.json'),
    readJson('products.json'),
    readJson('specs.json'),
  ])
  const categories = categoryFile.categories || categoryFile
  const products = productFile.products || productFile
  return {
    site,
    categories,
    products: products.map(normalizeProduct),
    specs: {
      materials: specs.materials || [],
      limits: {
        minMm: 20,
        maxMm: 1200,
        minQty: 1,
        maxQty: 500,
        ...(specs.limits || {}),
      },
    },
  }
}

export function money(value) {
  if (value == null || value === '' || Number.isNaN(Number(value))) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export function rateLine(product) {
  if (!product) return 'Ask for the rate'
  const sale = product.onSale && product.salePrice != null
  if (sale && product.price != null) return `${money(product.salePrice)} · was ${money(product.price)}`
  if (sale && product.salePrice != null) return money(product.salePrice)
  if (product.price != null) return money(product.price)
  return 'Ask for the rate'
}

export function categoryName(categories, id) {
  return categories.find((item) => item.id === id)?.name || id
}

export function materialName(specs, id) {
  return specs.materials.find((item) => item.id === id)?.name || id
}
