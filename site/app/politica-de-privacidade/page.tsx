import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  alternates: { canonical: '/politica-de-privacidade/' },
}

const html = fs.readFileSync(path.join(process.cwd(), 'content', 'privacidade.html'), 'utf8')

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-16">
      <div className="prose prose-valen max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
