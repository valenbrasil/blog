import type { Metadata } from 'next'
import { Jost, Manrope, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { OrganizationSchema } from '@/components/OrganizationSchema'
import { AHREFS_ANALYTICS_KEY, GA_MEASUREMENT_ID } from '@/lib/site-config'
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
      {/*
        Os dois medidores ficam num <head> explícito porque quem verifica a
        instalação — o Search Console no caso do GA, o painel do Ahrefs no
        caso do outro — lê o HTML CRU da página: nenhum dos dois executa
        JavaScript. Ver o comentário de Analytics() para o que isso quebrava.
      */}
      <head>
        <Analytics />
        <AhrefsAnalytics />
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
 * Ahrefs Web Analytics.
 *
 * Mede as mesmas visitas que o GA, por outro ângulo: o Ahrefs cruza o tráfego
 * com os dados de backlink e de posição na busca que já mantém. Rodar os dois
 * em paralelo é deliberado, não duplicação por descuido.
 *
 * Só em produção, para que `next dev` não entre no relatório como visita real.
 *
 * Tag <script> literal no <head>, e não `next/script`, pelo mesmo motivo que
 * levou o GA a mudar — ver o comentário de Analytics(). Com
 * `strategy="afterInteractive"` o Next não emite a tag no HTML: sai só um
 * <link rel="preload"> no <head> e o <script> de verdade é injetado na
 * hidratação. Medido no HTML servido antes da troca:
 *
 *     <head>   preload=1   <script src=ahrefs>=0
 *     <body>   src e data-key só dentro do payload de hidratação
 *
 * Para o navegador dá no mesmo: o script sobe e mede. Mas o verificador de
 * instalação do Ahrefs lê o HTML cru à procura do snippet no <head>, e é esse
 * o snippet que o painel manda colar. `async` preserva o que o
 * `afterInteractive` garantia: a tag está no <head> e não bloqueia a
 * renderização do artigo.
 */
function AhrefsAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null

  return (
    <script src="https://analytics.ahrefs.com/analytics.js" data-key={AHREFS_ANALYTICS_KEY} async />
  )
}

/**
 * Google Analytics 4.
 *
 * `afterInteractive` porque medir audiência não pode competir com a renderização
 * do artigo: o script sobe depois que a página está utilizável.
 *
 * Só em produção. O valor é decidido no build, então `next dev` sai sem o
 * script — sem isso, cada sessão de desenvolvimento entraria no relatório como
 * visita real e sujaria justamente a métrica que o GA existe para dar.
 */
function Analytics() {
  if (process.env.NODE_ENV !== 'production') return null

  /*
    Tag <script> literal, e não `next/script`, de propósito.

    Com `strategy="afterInteractive"` o Next não emite a tag no HTML: ele emite
    apenas um <link rel="preload"> e injeta o <script> de verdade na hidratação.
    Medido no HTML servido antes da troca:

        <head>   preload=1  <script src=gtag>=0  gtag()=0
        <body>   preload=0  <script src=gtag>=0  gtag()=3

    Para o navegador dá no mesmo — o GA carrega e mede. Mas o Search Console
    verifica a propriedade lendo o HTML cru da home, sem executar JavaScript, e
    por isso recusava com "o código de acompanhamento está no local incorreto da
    página; verifique com o snippet na seção <head>".

    `async` preserva o motivo pelo qual `afterInteractive` estava ali: a tag
    está no <head>, mas não bloqueia a renderização do artigo.
  */
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`,
        }}
      />
    </>
  )
}
