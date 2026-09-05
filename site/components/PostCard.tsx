import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { formatDateShort } from '@/lib/date'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { PostSummary } from '@/lib/types'

export function PostCard({ post, priority = false }: { post: PostSummary; priority?: boolean }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(640).height(360).fit('crop').auto('format').url()
    : null
  const category = post.categories?.[0]

  return (
    <Card interactive padded={false} className="h-full">
      <Link href={`/${post.slug}`} className="flex h-full flex-col text-inherit">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || ''}
            width={640}
            height={360}
            priority={priority}
            className="h-40 w-full object-cover"
          />
        ) : (
          <div className="h-40 w-full bg-neutral-100" />
        )}
        <div className="flex flex-1 flex-col items-start gap-2 p-5">
          {category ? (
            <Badge tone="neutral" size="sm">
              {category.title}
            </Badge>
          ) : null}
          <h3 className="font-sans text-xl leading-snug font-medium text-neutral-900">
            {post.title}
          </h3>
          <span className="mt-auto pt-1 text-sm text-neutral-500">
            {post.author?.name ?? 'Valen Brasil'} • {formatDateShort(post.publishedAt)}
          </span>
        </div>
      </Link>
    </Card>
  )
}
