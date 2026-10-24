export function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length >= 11 && digits.length <= 15) return digits
  return ''
}

export function whatsappUrl(phone, text) {
  const digits = normalizePhone(phone)
  if (!digits) return ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function telUrl(phone) {
  const digits = normalizePhone(phone)
  return digits ? `tel:+${digits}` : ''
}

export function orderMessage(details) {
  const lines = ['Hello MMD Craft,', '', `Piece: ${details.name || 'Custom piece'}`]
  if (details.category) lines.push(`Category: ${details.category}`)
  if (details.material) lines.push(`Material: ${details.material}`)
  if (details.thickness) lines.push(`Thickness: ${details.thickness} mm`)
  if (details.width && details.height) lines.push(`Size: ${details.width} × ${details.height} mm`)
  if (details.quantity) lines.push(`Quantity: ${details.quantity}`)
  if (details.hooks) lines.push(`Hooks: ${details.hooks}`)
  if (details.priceLabel) lines.push(`Listed rate: ${details.priceLabel}`)
  if (details.notes) lines.push(`Notes: ${details.notes}`)
  lines.push('', 'Please confirm price and making time.')
  return lines.join('\n')
}

export function enquiryMessage(details) {
  const lines = ['Hello MMD Craft,', '', details.kind || 'Enquiry']
  if (details.name) lines.push(`Name: ${details.name}`)
  if (details.business) lines.push(`Business: ${details.business}`)
  if (details.phone) lines.push(`Phone: ${details.phone}`)
  if (details.city) lines.push(`City: ${details.city}`)
  if (details.material) lines.push(`Material: ${details.material}`)
  if (details.quantity) lines.push(`Quantity: ${details.quantity}`)
  if (details.needBy) lines.push(`Need by: ${details.needBy}`)
  if (details.message) lines.push(`Details: ${details.message}`)
  return lines.join('\n')
}
