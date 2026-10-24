import { useState } from 'react'
import { telUrl, whatsappUrl } from '../lib/whatsapp'

export function WhatsAppButton({ phone, text, children, className, disabled = false }) {
  const url = whatsappUrl(phone, text)
  const [copied, setCopied] = useState(false)

  if (disabled) {
    return (
      <button type="button" className={`${className} cursor-not-allowed opacity-40`} disabled>
        {children}
      </button>
    )
  }

  if (url) {
    return (
      <a className={className} href={url} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
        } catch {
          window.prompt('Copy this message', text)
        }
      }}
    >
      {copied ? 'Message copied' : children}
    </button>
  )
}

export function CallButton({ phone, text, children, className }) {
  const href = telUrl(phone)
  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    )
  }
  return (
    <WhatsAppButton phone={phone} text={text} className={className}>
      {children}
    </WhatsAppButton>
  )
}

export function WhatsDock({ phone, text }) {
  return (
    <WhatsAppButton
      phone={phone}
      text={text}
      className="btn-solid fixed bottom-5 right-5 z-40 shadow-glow"
    >
      WhatsApp
    </WhatsAppButton>
  )
}
