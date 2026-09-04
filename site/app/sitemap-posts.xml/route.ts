import { getAllPosts } from '@/lib/queries'

const SITE_URL = 'https://bettinacesario.github.io/valen-blog'

export const dynamic = 'force-static'

/**
 * Sitemap dedicado só a posts, no mesmo nome de arquivo que o Ghost usava
 * (sitemap.xml + sitemap-posts.xml) — ajuda a manter continuidade de
 * indexação, já que o /sitemap.xml principal (app/sitemap.ts) também
 * lista tudo.
 */
export async function GET() {
  const posts = await getAllPosts()

  const urls = posts
    .map(
      (post) => `  <url>
    <loc>${SITE_URL}/${post.slug}/</loc>
    <lastmod>${post.publishedAt}</lastmod>
  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
