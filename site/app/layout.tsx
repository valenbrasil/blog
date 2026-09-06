import type { Metadata } from 'next'
import { Jost, Manrope, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { OrganizationSchema } from '@/components/OrganizationSchema'
import { BASE_PATH, GOOGLE_SITE_VERIFICATION, SITE_URL } from '@/lib/site-config'
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
  /*
    Sai como <meta name="google-site-verification" ...> no <head>. Pela API de
    metadata e nao como tag solta: assim o Next garante a tag unica na pagina,
    sem risco de duplicar se um dia outra rota declarar a sua.
  */
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={`${jost.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <AvisoDeCookies />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <OrganizationSchema />
      </body>
    </html>
  )
}

/**
 * Aviso de cookies, e o unico portao de medicao da pagina.
 *
 * Ate aqui o blog carregava GA, Ahrefs e Cloudflare direto no <head>, em toda
 * visita. Os tres sairam: enquanto eles estivessem ali, o aviso nao serviria
 * para nada -- a medicao ja teria comecado antes de a pessoa responder, que e
 * exatamente o que a LGPD nao permite. Quem os carrega agora e
 * `public/consentimento-valen.js`, com os mesmos identificadores, depois do
 * "Aceitar".
 *
 * O arquivo e mantido IDENTICO ao da homepage de proposito: a decisao vai num
 * cookie no dominio de topo (.valenbrasil.com), entao quem responde aqui nao
 * ve o aviso de novo la, e vice-versa. Ha um teste na homepage que compara os
 * dois e falha se o nome do cookie, a validade ou a versao da politica
 * divergirem -- por isso ele entra byte a byte como veio, e qualquer mudanca
 * comeca la, nao aqui.
 *
 * `defer` e nao script sincrono: o arquivo pede para vir "antes de qualquer
 * outro script", e vem -- com os tres medidores fora do HTML, nao existe mais
 * script de terceiro para correr na frente dele, e nenhum pode existir, ja que
 * agora todos nascem de dentro dele. `defer` mantem essa ordem sem bloquear a
 * renderizacao do artigo, que num projeto de SEO custa Core Web Vitals.
 *
 * Roda tambem em desenvolvimento, ao contrario dos medidores que substituiu:
 * um aviso de consentimento que so aparece em producao e um aviso que ninguem
 * testa. Ele nao mede nada por si.
 *
 * BASE_PATH porque `public/` e servido a partir da raiz do site: em producao a
 * raiz e o dominio e o prefixo e vazio; sob subdiretorio, sem ele o arquivo
 * daria 404 e a pagina ficaria sem aviso e sem medicao.
 */
function AvisoDeCookies() {
  return <script src={`${BASE_PATH}/consentimento-valen.js`} defer />
}
