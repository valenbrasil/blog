import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { urlFor } from '@/lib/image'
import { formatDateShort } from '@/lib/date'
import { Badge } from '@/components/ui/Badge'
import type { PostSummary } from '@/lib/types'

/** O post mais recente, em destaque no topo do feed. */
export function FeaturedPost({ post }: { post: PostSummary }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1000).height(750).fit('crop').auto('format').url()
    : null
  const category = post.categories?.[0]

  return (
    <article className="py-12 md:py-16">
      <Link
        href={`/${post.slug}`}
        className="group grid items-center gap-8 text-inherit md:grid-cols-[1.1fr_0.9fr] md:gap-10"
      >
        <div className="grid justify-items-start gap-4">
          {category ? <Badge tone="brand">{category.title}</Badge> : null}
          <h1 className="font-display text-4xl leading-tight font-light tracking-tight text-neutral-900 md:text-[2.6rem]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="max-w-[52ch] text-lg leading-relaxed text-neutral-500">{post.excerpt}</p>
          ) : null}
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span>{post.author?.name ?? 'Valen Brasil'}</span>
            <span>•</span>
            <span>{formatDateShort(post.publishedAt)}</span>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 group-hover:text-sage-700">
            Ler artigo
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </span>
        </div>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || ''}
            width={1000}
            height={750}
            priority
            className="aspect-[4/3] w-full rounded-[1.25rem] object-cover"
          />
        ) : null}
      </Link>
    </article>
  )
}
