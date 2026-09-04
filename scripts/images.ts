import fs from 'node:fs'
import pLimit from 'p-limit'
import { client } from './sanityClient'

const CACHE_FILE = './.cache/assets.json'
fs.mkdirSync('./.cache', { recursive: true })

const cache: Record<string, string> = fs.existsSync(CACHE_FILE)
  ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
  : {}

const limit = pLimit(3) // acima de ~4 o Sanity começa a retornar 429

function persist() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
}

export async function uploadAsset(url: string): Promise<string | null> {
  if (cache[url]) return cache[url]

  return limit(async () => {
    if (cache[url]) return cache[url] // recheca dentro da fila

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
  return cache[url] ?? null
}

/** Extrai todas as URLs de imagem de um HTML. */
export function extractImageUrls(html: string): string[] {
  const urls: string[] = []
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) urls.push(m[1])
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0]
      if (u) urls.push(u)
    }
  }
  return urls
}
