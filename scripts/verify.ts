import fs from 'node:fs'
import { client } from './sanityClient'

const raw = JSON.parse(fs.readFileSync('./.cache/ghost-export.json', 'utf8'))
const db = Array.isArray(raw.db) ? raw.db[0] : raw.db
const sourcePosts = db.data.posts.filter((p: any) => p.type === 'post' && p.status === 'published')
const sourceTags = db.data.tags.filter((t: any) => t.visibility !== 'internal')
const sourceUsers = db.data.users

console.log('── Contagens: Ghost export vs Sanity ──')
const [postCount, authorCount, categoryCount] = await Promise.all([
  client.fetch('count(*[_type == "post"])'),
  client.fetch('count(*[_type == "author"])'),
  client.fetch('count(*[_type == "category"])'),
])
console.log(`posts:      export=${sourcePosts.length}  sanity=${postCount}  ${sourcePosts.length === postCount ? '✓' : '✗'}`)
console.log(`authors:    export=${sourceUsers.length}  sanity=${authorCount}  ${sourceUsers.length === authorCount ? '✓' : '✗'}`)
console.log(`categories: export=${sourceTags.length}  sanity=${categoryCount}  ${sourceTags.length === categoryCount ? '✓' : '✗'}`)

console.log('\n── Referências órfãs (author sem match) ──')
const orphanAuthors = await client.fetch('*[_type == "post" && !defined(author->_id)]{ title, ghostId }')
console.log(orphanAuthors.length === 0 ? '✓ nenhuma' : orphanAuthors)

console.log('\n── Corpos vazios ──')
const emptyBodies = await client.fetch('*[_type == "post" && count(body) == 0]{ title, ghostId, legacyUrl }')
console.log(emptyBodies.length === 0 ? '✓ nenhum' : emptyBodies)

console.log('\n── Posts sem mainImage (mas tinham feature_image no Ghost) ──')
const noImage = await client.fetch('*[_type == "post" && !defined(mainImage)]{ title, legacyUrl, ghostId }')
const sourceById = new Map<string, any>(sourcePosts.map((p: any) => [p.id, p]))
const realMisses = noImage.filter((p: any) => sourceById.get(p.ghostId)?.feature_image)
console.log(realMisses.length === 0 ? `✓ nenhum (${noImage.length} sem feature_image no Ghost mesmo)` : realMisses)

console.log('\n── Slugs duplicados ──')
const dupSlugs = await client.fetch(
  `*[_type == "post"]{ "s": slug.current } | order(s) | { "slug": s }`
)
const seen = new Set<string>()
const dups = new Set<string>()
for (const { slug } of dupSlugs) {
  if (seen.has(slug)) dups.add(slug)
  seen.add(slug)
}
console.log(dups.size === 0 ? '✓ nenhum' : [...dups])

console.log('\n── Assets ──')
const assetCache = JSON.parse(fs.readFileSync('./.cache/assets.json', 'utf8'))
const assetCount = await client.fetch('count(*[_type == "sanity.imageAsset"])')
console.log(`URLs no cache local: ${Object.keys(assetCache).length}`)
console.log(`assets no Sanity: ${assetCount}`)

console.log('\n── ghostId cobre todos os posts publicados do export? ──')
const sanityGhostIds = new Set(await client.fetch('*[_type == "post"].ghostId'))
const missing = sourcePosts.filter((p: any) => !sanityGhostIds.has(p.id))
console.log(missing.length === 0 ? '✓ todos presentes' : missing.map((p: any) => p.title))
