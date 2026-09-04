import fs from 'node:fs'
import { client } from './sanityClient'
import { postId } from './ids'

/**
 * A primeira migração (03-posts.ts) não trouxe `posts_meta` do export do Ghost
 * (meta_title, meta_description, feature_image_alt, feature_image_caption) —
 * esse dado já existe em .cache/ghost-export.json e nunca foi escrito no
 * Sanity. Backfill idempotente via patch().set(), sem tocar no resto do
 * documento.
 */

const DRY_RUN = process.argv.includes('--dry-run')

const raw = JSON.parse(fs.readFileSync('./.cache/ghost-export.json', 'utf8'))
const db = Array.isArray(raw.db) ? raw.db[0] : raw.db
const posts = db.data.posts.filter((p: any) => p.type === 'post' && p.status === 'published')
const metaByPost = new Map<string, any>(db.data.posts_meta.map((m: any) => [m.post_id, m]))

function stripHtml(html: string | null | undefined): string | undefined {
  if (!html) return undefined
  const text = html.replace(/<[^>]+>/g, '').trim()
  return text || undefined
}

let patched = 0
let skipped = 0

for (const p of posts) {
  const meta = metaByPost.get(p.id)
  const patch: Record<string, unknown> = {}

  const metaTitle = meta?.meta_title || undefined
  const metaDescription = meta?.meta_description || undefined
  if (metaTitle) patch['seo.metaTitle'] = metaTitle
  if (metaDescription) patch['seo.metaDescription'] = metaDescription

  const alt = meta?.feature_image_alt || undefined
  const caption = stripHtml(meta?.feature_image_caption)
  if (alt) patch['mainImage.alt'] = alt
  if (caption) patch['mainImage.caption'] = caption

  if (Object.keys(patch).length === 0) {
    skipped++
    continue
  }

  if (DRY_RUN) {
    console.log(postId(p), patch)
  } else {
    await client.patch(postId(p)).set(patch).commit()
  }
  patched++
}

console.log(`${DRY_RUN ? '(dry-run) ' : ''}✓ ${patched} posts com patch de SEO/alt, ${skipped} sem metadado no Ghost`)
