import { getAllPosts } from '@/lib/queries'
import { PostCard } from '@/components/PostCard'

export const dynamicParams = false

export default async function HomePage() {
  const posts = await getAllPosts()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-stone-500">Nenhum post publicado ainda.</p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
