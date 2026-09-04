import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPostSlugs, getPostBySlug } from '@/lib/queries'
import { urlFor } from '@/lib/image'
import { formatDate } from '@/lib/date'
import { PostBody } from '@/components/PostBody'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  }
}

export default async function PostPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1600).fit('max').auto('format').url()
    : null

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900">{post.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-500">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        {post.author ? <span>· {post.author.name}</span> : null}
      </div>
      {post.categories && post.categories.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <Link
              key={category._id}
              href={`/categoria/${category.slug}`}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600 hover:bg-stone-200"
            >
              {category.title}
            </Link>
          ))}
        </div>
      ) : null}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={post.mainImage?.alt || ''}
          width={1600}
          height={900}
          className="mt-8 w-full rounded-lg"
          priority
        />
      ) : null}
      {post.mainImage?.caption ? (
        <p className="mt-2 text-center text-sm text-stone-500">{post.mainImage.caption}</p>
      ) : null}
      <div className="mt-8">
        <PostBody body={post.body} />
      </div>
    </article>
  )
}
