import type { Metadata } from 'next'
import { getAllCategories, getAllPosts } from '@/lib/queries'
import { Feed } from '@/components/Feed'

export const dynamicParams = false

// Relativo ao metadataBase do layout: vira a raiz do domínio (ou do
// subdiretório, quando o site roda sob basePath).
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getAllCategories()])
  return <Feed posts={posts} categories={categories} page={1} />
}
