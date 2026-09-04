import 'dotenv/config'
import fs from 'node:fs'

const BASE = `${process.env.GHOST_URL}/ghost/api/content`

async function ghostFetch(resource: string, params: Record<string, string> = {}) {
  const cacheFile = `./.cache/ghost-${resource}.json`
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
  }

  const out: any[] = []
  let page = 1

  while (true) {
    const qs = new URLSearchParams({
      key: process.env.GHOST_KEY!,
      limit: '100',
      page: String(page),
      ...params,
    })

    const res = await fetch(`${BASE}/${resource}/?${qs}`, {
      headers: { 'Accept-Version': 'v5.0' },
    })
    if (!res.ok) throw new Error(`Ghost ${resource} ${res.status}: ${await res.text()}`)

    const json = await res.json()
    out.push(...json[resource])
    if (page >= json.meta.pagination.pages) break
    page++
  }

  fs.mkdirSync('./.cache', { recursive: true })
  fs.writeFileSync(cacheFile, JSON.stringify(out, null, 2))
  return out
}

export const getPosts = () =>
  ghostFetch('posts', { include: 'tags,authors', formats: 'html' })
export const getPages = () =>
  ghostFetch('pages', { include: 'tags,authors', formats: 'html' })
export const getAuthors = () => ghostFetch('authors', {})
export const getTags = () => ghostFetch('tags', {})
