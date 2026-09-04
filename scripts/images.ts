import fs from 'node:fs'
import pLimit from 'p-limit'
import { client } from './sanityClient'

const CACHE_FILE = './.cache/assets.json'
fs.mkdirSync('./.cache', { recursive: true })

const cache: Record<string, string> = fs.existsSync(CACHE_FILE)
  ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
  : {}

// OBRIGATÓRIO (MIGRACAOGHOSTSANITY.md §1.3): --dry-run nunca grava. Em modo
// dry-run o upload real é pulado; só se confirma que a URL responde e se
// devolve um _ref sintético (nunca persistido no cache real).
const DRY_RUN = process.argv.includes('--dry-run')
const dryRunCache = new Map<string, string | null>()

const limit = pLimit(3) // acima de ~4 o Sanity começa a retornar 429

function persist() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
}

export async function uploadAsset(url: string): Promise<string | null> {
  if (cache[url]) return cache[url]
  if (DRY_RUN && dryRunCache.has(url)) return dryRunCache.get(url)!

  return limit(async () => {
    if (cache[url]) return cache[url] // recheca dentro da fila

    if (DRY_RUN) {
      if (dryRunCache.has(url)) return dryRunCache.get(url)!
      try {
        const res = await fetch(url, { method: 'HEAD' })
        const id = res.ok ? `image-DRYRUN-${Buffer.from(url).toString('base64url').slice(0, 24)}` : null
        if (!res.ok) console.warn(`⚠ imagem indisponível (${res.status}): ${url}`)
        dryRunCache.set(url, id)
        return id
      } catch (err) {
        console.warn(`⚠ falha ao checar imagem: ${url}`, err)
        dryRunCache.set(url, null)
        return null
      }
    }

    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.warn(`⚠ imagem indisponível (${res.status}): ${url}`)
        return null
      }

      const buffer = Buffer.from(await res.arrayBuffer())
      const filename = decodeURIComponent(
        new URL(url).pathname.split('/').pop() || 'image'
      )

      const asset = await client.assets.upload('image', buffer, { filename })
      cache[url] = asset._id
      persist()
      return asset._id
    } catch (err) {
      console.warn(`⚠ falha no upload: ${url}`, err)
      return null
    }
  })
}

/** Referência de imagem pronta para um campo `image` do Sanity. */
export async function uploadImage(url: string) {
  const id = await uploadAsset(url)
  return id
    ? { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: id } }
    : undefined
}

/** Consulta síncrona do cache — usada dentro das regras de conversão. */
export function getCachedAsset(url: string): string | null {
  if (cache[url]) return cache[url]
  if (DRY_RUN) return dryRunCache.get(url) ?? null
  return null
}

/**
 * Variante redimensionada gerada pelo Ghost para o `srcset` responsivo
 * (`/content/images/size/w600/...`). O `src` do `<img>` aponta sempre para
 * o arquivo original — é o único que interessa aqui: subir as variantes
 * seria desperdiçar upload com versões cortadas/reduzidas que o corpo do
 * post nunca referencia.
 */
function isResizedVariant(url: string): boolean {
  return /\/content\/images\/size\/w\d+\//.test(url)
}

/** Extrai as URLs de imagem originais (não redimensionadas) de um HTML. */
export function extractImageUrls(html: string): string[] {
  const urls: string[] = []
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) urls.push(m[1])
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0]
      if (u) urls.push(u)
    }
  }
  return urls.filter((u) => !isResizedVariant(u))
}
