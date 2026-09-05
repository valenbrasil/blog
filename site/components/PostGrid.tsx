import { PostCard } from '@/components/PostCard'
import type { PostSummary } from '@/lib/types'

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <PostCard key={post._id} post={post} priority={i < 3} />
      ))}
    </div>
  )
}
