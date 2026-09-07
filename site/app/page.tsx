import type { Metadata } from 'next'
import { getAllCategories, getAllPosts } from '@/lib/queries'
import { Feed } from '@/components/Feed'

export const dynamicParams = false

// Relativo ao metadataBase do layout: vira a raiz do domínio (ou do
// subdiretório, quando o site roda sob basePath).
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  /*
    og:url faltava aqui, na home, nas categorias e nas páginas legais -- só os
    artigos o declaravam. É propriedade obrigatória do protocolo Open Graph, e a
    auditoria acusou o card incompleto.

    Declarar openGraph aqui descarta o bloco do layout inteiro, então type,
    siteName e locale precisam ser repetidos.

    Sem og:image de propósito: a home não tem imagem própria, e usar o logo ou a
    capa de um post qualquer seria inventar uma ilustração que não representa a
    página -- o mesmo critério que app/[slug]/page.tsx aplica a post sem capa.
  */
  openGraph: {
    type: 'website',
    siteName: 'Valen Brasil',
    locale: 'pt_BR',
    url: '/',
  },
}

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getAllCategories()])
  return <Feed posts={posts} categories={categories} page={1} />
}
