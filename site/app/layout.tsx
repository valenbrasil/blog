import type { Metadata } from 'next'
import { Jost, Manrope, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { OrganizationSchema } from '@/components/OrganizationSchema'
import { SITE_URL } from '@/lib/site-config'
import './globals.css'

/*
  As três famílias do design system. O guia as carrega por @import do Google
  Fonts; aqui o next/font baixa e serve os WOFF2 do próprio domínio, o que evita
  uma requisição a terceiro e o salto de layout da troca de fonte.
*/
const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  /*
    metadataBase é o que faz o Next transformar caminho relativo (canonical,
    og:url, og:image) em URL absoluta — sem ele o canonical sai relativo e não
    resolve a disputa com a instância antiga do Ghost, que ainda serve o mesmo
    conteúdo. SITE_URL já embute o endereço completo; quando o site roda sob
    subdiretório (GitHub Pages de projeto), esse subdiretório está no pathname
    daqui e o Next o junta ao caminho relativo. Por isso NUNCA se repete o
    BASE_PATH nos canonicals das páginas: sairia /blog/blog/slug/.
  */
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Valen Brasil — Blog',
    template: '%s — Valen Brasil',
  },
  description: 'Avaliação de imóveis, direito e investimento imobiliário.',
  // Padrão herdado por toda página que não declarar o seu próprio openGraph /
  // twitter — atenção: quem declara SUBSTITUI o bloco inteiro, não mescla campo
  // a campo, então siteName e locale precisam ser repetidos lá.
  openGraph: {
    type: 'website',
    siteName: 'Valen Brasil',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={`${jost.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <OrganizationSchema />
      </body>
    </html>
  )
}
