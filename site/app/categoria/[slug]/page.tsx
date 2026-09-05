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

      {/*
        Duas colunas a partir de md, como no FeaturedPost.

        A descrição da categoria cresceu para 30 a 50 palavras. Numa coluna só,
        presa a `max-w-[64ch]` dentro de um container de 1080px, ela ocupava
        pouco mais de 60% da largura e deixava um vazio grande à direita.
        Alargar a linha resolveria o vazio e estragaria a leitura: a 1080px o
        texto passaria de 100 caracteres por linha.

        Ao lado, a descrição fica com uma medida confortável e o espaço passa a
        ter uso. `items-end` alinha a base dos dois blocos.
      */}
      <header className="mt-10 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-12">
        <div>
          <span className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
            Categoria
          </span>
          <h1 className="mt-3 font-display text-4xl leading-tight font-light tracking-tight text-neutral-900">
            {category.title}
          </h1>
          <p className="mt-4 text-sm text-neutral-500">
            {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
          </p>
        </div>
        {category.description ? (
          <p className="text-lg leading-relaxed text-neutral-500">{category.description}</p>
        ) : null}
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
