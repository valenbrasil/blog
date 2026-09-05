import type { MetadataRoute } from 'next'
import { getAllCategories, getAllPosts } from '@/lib/queries'
import { SITE_URL } from '@/lib/site-config'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPosts(), getAllCategories()])

  return [
    { url: `${SITE_URL}/` },
    ...posts.map((post) => ({
      url: `${SITE_URL}/${post.slug}/`,
      lastModified: post.publishedAt,
    })),
    ...categories.map((category) => ({ url: `${SITE_URL}/categoria/${category.slug}/` })),
    { url: `${SITE_URL}/politica-de-privacidade/` },
    { url: `${SITE_URL}/termos-de-uso/` },
  ]
}
