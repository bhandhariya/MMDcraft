import { useState } from 'react'
import { enquiryMessage, normalizePhone } from '../lib/whatsapp'
import { SectionHeading } from './Ui'
import { WhatsAppButton } from './OrderActions'

export function Bulk({ copy, specs, phone }) {
  const [form, setForm] = useState({
    name: '',
    business: '',
    material: specs.materials[0]?.name || 'MDF',
    quantity: 25,
    needBy: '',
    message: '',
  })

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const text = enquiryMessage({
    kind: 'Bulk enquiry',
    name: form.name.trim(),
    business: form.business.trim(),
    material: form.material,
    quantity: form.quantity,
    needBy: form.needBy.trim(),
    message: form.message.trim(),
  })
  const ready = form.name.trim() && Number(form.quantity) > 0 && form.message.trim()

  return (
    <section id="bulk" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHeading index="07" kicker={copy?.kicker || 'Bulk'} title={copy?.title || 'Bulk enquiries.'} lede={copy?.lede} />
        <form className="glass rounded-[28px] p-5 sm:p-6" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-silver">
              Name
              <input className="field" value={form.name} onChange={(event) => set('name', event.target.value)} />
            </label>
            <label className="text-sm text-silver">
              Business
              <input className="field" value={form.business} onChange={(event) => set('business', event.target.value)} />
            </label>
            <label className="text-sm text-silver">
              Material
              <select className="field" value={form.material} onChange={(event) => set('material', event.target.value)}>
                {specs.materials.map((item) => (
                  <option key={item.id} value={item.name}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-silver">
              Quantity
              <input className="field" inputMode="numeric" value={form.quantity} onChange={(event) => set('quantity', event.target.value)} />
            </label>
            <label className="text-sm text-silver sm:col-span-2">
              Need by
              <input className="field" placeholder="A date or a week" value={form.needBy} onChange={(event) => set('needBy', event.target.value)} />
            </label>
            <label className="text-sm text-silver sm:col-span-2">
              What do you need?
              <textarea className="field min-h-28" maxLength={500} value={form.message} onChange={(event) => set('message', event.target.value)} />
            </label>
          </div>
          <div className="mt-4">
            <WhatsAppButton phone={phone} text={text} disabled={!ready} className="btn-solid">
              Send bulk enquiry
            </WhatsAppButton>
          </div>
        </form>
      </div>
    </section>
  )
}

export function About({ about }) {
  if (!about) return null
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading index="08" kicker={about.kicker} title={about.title} />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-silver/80">
            {(about.paragraphs || []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <ul className="grid content-end gap-3">
          {(about.points || []).map((point, index) => (
            <li key={point} className="holo-frame rounded-3xl px-5 py-4">
              <span className="font-mono text-xs text-cyan">0{index + 1}</span>
              <p className="mt-2 text-white">{point}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Contact({ copy, site, phone }) {
  const [form, setForm] = useState({ name: '', city: '', message: '' })
  const text = enquiryMessage({
    kind: 'Contact',
    name: form.name.trim(),
    city: form.city.trim(),
    message: form.message.trim(),
  })
  const ready = form.name.trim() && form.message.trim()
  const digits = normalizePhone(phone)
  const facts = [
    digits ? ['WhatsApp', `+${digits}`] : null,
    site.email ? ['Email', site.email] : null,
    site.city ? ['City', site.city] : null,
    site.hours ? ['Hours', site.hours] : null,
  ].filter(Boolean)

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading index="09" kicker={copy?.kicker || 'Contact'} title={copy?.title || 'Contact us.'} lede={copy?.lede} />
          <dl className="mt-8 space-y-4">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-[0.22em] text-silver/50">{label}</dt>
                <dd className="mt-1 text-white">{value}</dd>
              </div>
            ))}
          </dl>
          {!phone ? (
            <p className="mt-6 rounded-2xl border border-cyan/30 bg-cyan/10 p-4 text-sm leading-relaxed text-silver">
              Add your number as "whatsapp" in public/data/site.json. Use 10 digits or include 91. Until then, the order buttons copy the message so you can paste it.
            </p>
          ) : null}
        </div>
        <form className="glass rounded-[28px] p-5 sm:p-6" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-silver">
              Name
              <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="text-sm text-silver">
              City
              <input className="field" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            </label>
            <label className="text-sm text-silver sm:col-span-2">
              Message
              <textarea className="field min-h-32" maxLength={500} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
            </label>
          </div>
          <div className="mt-4">
            <WhatsAppButton phone={phone} text={text} disabled={!ready} className="btn-solid">
              Send on WhatsApp
            </WhatsAppButton>
          </div>
        </form>
      </div>
    </section>
  )
}

export function Footer({ brand }) {
  const links = [
    ['Collection', '#collection'],
    ['Sale On', '#sale'],
    ['Working On', '#working'],
    ['Custom orders', '#custom'],
    ['Workshop', '#workshop'],
    ['Bulk', '#bulk'],
    ['About', '#about'],
    ['Contact', '#contact'],
  ]
  return (
    <footer className="border-t border-white/10 px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl text-white">{brand}</p>
          <p className="mt-2 text-sm text-silver/60">MDF, acrylic, and sublimation. Made to order.</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-silver/75">
          {links.map(([label, href]) => (
            <li key={href}><a className="hover:text-cyan" href={href}>{label}</a></li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
