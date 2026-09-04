import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCategories, getCategoryBySlug, getPostsByCategory } from '@/lib/queries'
import { PostCard } from '@/components/PostCard'

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
  return { title: category.title, description: category.description }
}

export default async function CategoryPage({ params }: PageProps<'/categoria/[slug]'>) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const posts = await getPostsByCategory(slug)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-stone-900">{category.title}</h1>
      {category.description ? (
        <p className="mt-2 text-stone-600">{category.description}</p>
      ) : null}
      {posts.length === 0 ? (
        <p className="mt-8 text-stone-500">Nenhum post nesta categoria ainda.</p>
      ) : (
        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
