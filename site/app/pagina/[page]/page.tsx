import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCategories, getAllPosts } from '@/lib/queries'
import { Feed, feedPageCount } from '@/components/Feed'

export const dynamicParams = false

/**
 * A primeira página do feed é a home, então aqui só existem da 2 em diante.
 */
export async function generateStaticParams() {
  const posts = await getAllPosts()
  const total = feedPageCount(posts.length)
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ page: String(i + 2) }))
}

export async function generateMetadata({
  params,
}: PageProps<'/pagina/[page]'>): Promise<Metadata> {
  const { page } = await params
  return {
    title: `Blog — página ${page}`,
    // Canonical aponta para a própria página: cada página do feed lista posts
    // diferentes, então nenhuma é cópia da home.
    alternates: { canonical: `/pagina/${page}/` },
    // Páginas de listagem não são conteúdo próprio: deixamos os artigos
    // competirem sozinhos na busca.
    robots: { index: false, follow: true },
  }
}

export default async function FeedPage({ params }: PageProps<'/pagina/[page]'>) {
  const { page } = await params
  const pageNumber = Number(page)
  const [posts, categories] = await Promise.all([getAllPosts(), getAllCategories()])

  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > feedPageCount(posts.length)) {
    notFound()
  }

  return <Feed posts={posts} categories={categories} page={pageNumber} />
}
