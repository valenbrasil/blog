import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
}

const html = fs.readFileSync(path.join(process.cwd(), 'content', 'privacidade.html'), 'utf8')

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
