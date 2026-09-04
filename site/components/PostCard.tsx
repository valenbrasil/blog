import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { formatDate } from '@/lib/date'
import type { PostSummary } from '@/lib/types'

export function PostCard({ post }: { post: PostSummary }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(800).height(450).fit('crop').auto('format').url()
    : null

  return (
    <article className="group">
      <Link href={`/${post.slug}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || ''}
            width={800}
            height={450}
            className="mb-4 aspect-video w-full rounded-lg object-cover"
          />
        ) : null}
        <h2 className="text-lg font-semibold text-stone-900 group-hover:underline">
          {post.title}
        </h2>
      </Link>
      {post.excerpt ? <p className="mt-2 text-sm text-stone-600">{post.excerpt}</p> : null}
      <p className="mt-2 text-xs text-stone-400">{formatDate(post.publishedAt)}</p>
    </article>
  )
}
