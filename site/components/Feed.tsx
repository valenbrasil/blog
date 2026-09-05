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

  return (
    <div className="mx-auto max-w-[1080px] px-6">
      {page === 1 && featured ? (
        <>
          <FeaturedPost post={featured} />
          <Separator />
        </>
      ) : null}

      <div className="mt-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl leading-snug tracking-tight text-neutral-900">
          {page === 1 ? 'Últimos artigos' : `Artigos — página ${page}`}
        </h2>
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
