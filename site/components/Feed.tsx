import { FeaturedPost } from '@/components/FeaturedPost'
import { PostGrid } from '@/components/PostGrid'
import { CategoryNav } from '@/components/CategoryNav'
import { Separator } from '@/components/ui/Separator'
import { Pagination } from '@/components/ui/Pagination'
import { POSTS_PER_PAGE } from '@/lib/site-config'
import type { Category, PostSummary } from '@/lib/types'

/** Endereço de cada página do feed. A primeira é a home, sem sufixo. */
export function feedHref(page: number): string {
  return page <= 1 ? '/' : `/pagina/${page}`
}

/**
 * O feed inteiro. A primeira página abre com o post mais recente em destaque e
 * mostra os 12 seguintes em grid; as demais mostram 12 cards cada.
 */
export function feedPageCount(total: number): number {
  return Math.max(1, Math.ceil(Math.max(0, total - 1) / POSTS_PER_PAGE))
}

export function Feed({
  posts,
  categories,
  page,
}: {
  posts: PostSummary[]
  categories: Category[]
  page: number
}) {
  const [featured, ...rest] = posts
  const totalPages = feedPageCount(posts.length)
  const start = (page - 1) * POSTS_PER_PAGE
  const pagePosts = rest.slice(start, start + POSTS_PER_PAGE)

  // Na home o destaque já traz o <h1>; nas outras páginas este cabeçalho é o
  // título principal e precisa ser <h1> para a página não ficar sem nenhum.
  const Titulo = page === 1 && featured ? 'h2' : 'h1'

  return (
    <div className="mx-auto max-w-[1080px] px-6">
      {page === 1 && featured ? (
        <>
          <FeaturedPost post={featured} />
          <Separator />
        </>
      ) : null}

      <div className="mt-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/*
          Na home o <h1> é o título do post em destaque, então este cabeçalho
          entra como <h2>. Da página 2 em diante não há destaque, e a página
          ficava sem <h1> nenhum -- a auditoria acusou isso em 17 páginas.
          O nível acompanha o contexto em vez de ser fixo.
        */}
        <Titulo className="font-display text-2xl leading-snug tracking-tight text-neutral-900">
          {page === 1 ? 'Últimos artigos' : `Artigos — página ${page}`}
        </Titulo>
        <CategoryNav categories={categories} />
      </div>

      {pagePosts.length === 0 ? (
        <p className="text-neutral-500">Nenhum post publicado ainda.</p>
      ) : (
        <PostGrid posts={pagePosts} />
      )}

      <div className="mt-10">
        <Pagination page={page} total={totalPages} hrefFor={feedHref} />
      </div>
    </div>
  )
}
