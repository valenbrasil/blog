import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Sem formulário nem cadastro, o blog só registra o que a medição de audiência coleta sozinha. O que é tratado, com quem, e seus direitos pela LGPD.',
  alternates: { canonical: '/politica-de-privacidade/' },
  // og:url é obrigatório no Open Graph e faltava. Declarar openGraph aqui
  // substitui o bloco do layout, daí type, siteName e locale repetidos.
  openGraph: {
    type: 'website',
    siteName: 'Valen Brasil',
    locale: 'pt_BR',
    url: '/politica-de-privacidade/',
  },
}

const html = fs.readFileSync(path.join(process.cwd(), 'content', 'privacidade.html'), 'utf8')

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-16">
      <div
        className="prose prose-valen texto-justificado max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
