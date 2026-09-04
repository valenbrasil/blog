import { getPosts } from './ghost'
import { client } from './sanityClient'
import { uploadAsset, uploadImage, extractImageUrls } from './images'
import { convert } from './htmlToPT'
import { postId, authorId, categoryId } from './ids'

const DRY_RUN = process.argv.includes('--dry-run')
const posts = await getPosts()

// ── FASE 1: upload de TODOS os assets ─────────────────────────────────
const urls = new Set<string>()
for (const p of posts) {
  if (p.feature_image) urls.add(p.feature_image)
  extractImageUrls(p.html ?? '').forEach((u) => urls.add(u))
}
console.log(`↑ subindo ${urls.size} assets…`)
await Promise.allSettled([...urls].map(uploadAsset))

// ── FASE 2: conversão ─────────────────────────────────────────────────
const docs: any[] = []
const failures: { id: string; title: string; error: unknown }[] = []

for (const p of posts) {
  try {
    docs.push({
      _id: postId(p),
      _type: 'post',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      excerpt: p.custom_excerpt || p.excerpt || undefined,
      publishedAt: p.published_at,
      mainImage: p.feature_image ? await uploadImage(p.feature_image) : undefined,
      author: p.primary_author
        ? { _type: 'reference', _ref: authorId(p.primary_author) }
        : undefined,
      categories: (p.tags ?? [])
        .filter((t: any) => t.visibility !== 'internal')
        .map((t: any) => ({
          _type: 'reference',
          _ref: categoryId(t),
          _key: t.id, // OBRIGATÓRIO: todo item de array precisa de _key
        })),
      body: convert(p.html ?? ''),
      ghostId: p.id,
      legacyUrl: p.url,
    })
  } catch (error) {
    failures.push({ id: p.id, title: p.title, error })
  }
}

if (failures.length) {
  console.warn(`⚠ ${failures.length} posts falharam na conversão:`)
  failures.forEach((f) => console.warn(`  - ${f.title} (${f.id})`, f.error))
}

if (DRY_RUN) {
  console.log(JSON.stringify(docs.slice(0, 2), null, 2))
  console.log(`\n${docs.length} posts prontos — dry run, nada foi gravado.`)
  process.exit(0)
}

// ── FASE 3: escrita em lotes ──────────────────────────────────────────
const BATCH = 10
for (let i = 0; i < docs.length; i += BATCH) {
  const batch = docs.slice(i, i + BATCH)
  const tx = client.transaction()
  batch.forEach((d) => tx.createOrReplace(d))

  try {
    await tx.commit()
    console.log(`✓ ${Math.min(i + BATCH, docs.length)}/${docs.length}`)
  } catch (e) {
    console.error(`✗ lote ${i}–${i + BATCH}:`, e) // não aborta o processo
  }
}
