import { getPosts } from './ghost'
import fs from 'node:fs'

const posts = await getPosts()
const redirects = posts.map((p: any) => ({
  source: `/${p.slug}`,
  destination: `/blog/${p.slug}`,
  permanent: true,
}))

fs.writeFileSync('./redirects.json', JSON.stringify(redirects, null, 2))
console.log(`✓ ${redirects.length} redirects gerados em redirects.json`)
