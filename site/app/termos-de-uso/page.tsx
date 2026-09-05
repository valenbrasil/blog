import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  alternates: { canonical: '/termos-de-uso/' },
}

const html = fs.readFileSync(path.join(process.cwd(), 'content', 'termos.html'), 'utf8')

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-16">
      <div className="prose prose-valen max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
