import { getAllCategories, getAllPosts } from '@/lib/queries'
import { Feed } from '@/components/Feed'

export const dynamicParams = false

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getAllCategories()])
  return <Feed posts={posts} categories={categories} page={1} />
}
