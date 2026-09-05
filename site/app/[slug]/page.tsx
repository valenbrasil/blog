import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/queries'
import { urlFor } from '@/lib/image'
import { formatDateShort } from '@/lib/date'
import { PostBody } from '@/components/PostBody'
import { PostGrid } from '@/components/PostGrid'
import { CtaCard } from '@/components/CtaCard'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Separator } from '@/components/ui/Separator'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
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

  const category = post.categories?.[0]
  const related = await getRelatedPosts(slug, category?.slug)
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1600).height(900).fit('crop').auto('format').url()
    : null

  const crumbs: Crumb[] = [
    { label: 'Blog', href: '/' },
    ...(category ? [{ label: category.title, href: `/categoria/${category.slug}` }] : []),
    { label: post.title },
  ]

  return (
    <>
      <div className="mx-auto max-w-[1080px] px-6 pt-8">
        <Breadcrumb items={crumbs} />
      </div>

      <article className="mx-auto max-w-[760px] px-6 pt-10">
        <header className="grid justify-items-start gap-5">
          {category ? <Badge tone="brand">{category.title}</Badge> : null}
          <h1 className="font-display text-4xl leading-tight font-light tracking-tight text-neutral-900 md:text-[2.75rem]">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
            <Avatar name={post.author?.name ?? 'Valen Brasil'} />
            <span className="text-sm text-neutral-500">
              {post.author?.name ?? 'Valen Brasil'} •{' '}
              <time dateTime={post.publishedAt}>{formatDateShort(post.publishedAt)}</time>
            </span>
          </div>
        </header>

        {imageUrl ? (
          <figure className="my-10">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || ''}
              width={1600}
              height={900}
              priority
              className="aspect-video w-full rounded-[1.25rem] object-cover"
            />
            {post.mainImage?.caption ? (
              <figcaption className="mt-2 text-center text-sm text-neutral-500">
                {post.mainImage.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <div className="mt-10" />
        )}

        {post.excerpt ? (
          <p className="mb-6 text-lg leading-relaxed text-neutral-900">{post.excerpt}</p>
        ) : null}

        <PostBody body={post.body} />

        <CtaCard />
      </article>

      {related.length > 0 ? (
        <div className="mx-auto mt-16 max-w-[1080px] px-6">
          <Separator label="Leia também" />
          <div className="mt-8">
            <PostGrid posts={related} />
          </div>
          <div className="mt-8">
            <Button href="/" variant="ghost" iconLeft="arrow-left">
              Voltar ao blog
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}
