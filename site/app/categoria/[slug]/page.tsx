import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCategories, getCategoryBySlug, getPostsByCategory } from '@/lib/queries'
import { PostGrid } from '@/components/PostGrid'
import { CategoryNav } from '@/components/CategoryNav'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const dynamicParams = false

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/categoria/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  /*
    A `description` da categoria é o texto visível no topo da página, de 30 a 50
    palavras. O Google exibe a meta description até cerca de 155 caracteres, e
    usar a descrição inteira aqui a fazia aparecer cortada no meio de uma frase
    no resultado de busca. Daí o campo curto próprio, com a `description` como
    reserva para categoria que ainda não o tenha preenchido.
  */
  return {
    title: category.title,
    description: category.seoDescription || category.description,
    alternates: { canonical: `/categoria/${slug}/` },
  }
}

export default async function CategoryPage({ params }: PageProps<'/categoria/[slug]'>) {
  const { slug } = await params
  const [category, categories] = await Promise.all([getCategoryBySlug(slug), getAllCategories()])
  if (!category) notFound()

  const posts = await getPostsByCategory(slug)

  return (
    <div className="mx-auto max-w-[1080px] px-6 pt-8">
      <Breadcrumb items={[{ label: 'Blog', href: '/' }, { label: category.title }]} />

      <header className="mt-10">
        <span className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
          Categoria
        </span>
        <h1 className="mt-3 font-display text-4xl leading-tight font-light tracking-tight text-neutral-900">
          {category.title}
        </h1>
        {category.description ? (
          /*
            Abaixo do título, e não ao lado — a descrição pertence ao bloco de
            identificação da categoria e lê-se na sequência dele.

            A medida cresce pelo corpo da fonte, não pelo número de `ch`: a
            unidade `ch` mede o glifo "0", mais estreito que a média das letras
            desta fonte, então 76ch renderizavam cerca de 90 caracteres por
            linha — largo demais para o olho achar o começo da linha seguinte.
            Com `text-xl` e 66ch a linha fica em 68 caracteres, dentro da faixa
            legível, e o parágrafo ocupa 805 de 1032 px (78% do container,
            contra 68% da versão anterior).
          */
          <p className="mt-4 max-w-[66ch] text-xl leading-relaxed text-neutral-500">
            {category.description}
          </p>
        ) : null}
        <p className="mt-4 text-sm text-neutral-500">
          {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
        </p>
      </header>

      <div className="mt-8 mb-8">
        <CategoryNav categories={categories} active={slug} />
      </div>

      {posts.length === 0 ? (
        <p className="text-neutral-500">Nenhum post nesta categoria ainda.</p>
      ) : (
        <PostGrid posts={posts} />
      )}
    </div>
  )
}
