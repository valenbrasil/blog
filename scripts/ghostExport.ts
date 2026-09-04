import fs from 'node:fs'

/**
 * Fonte alternativa à Content API: lê o export JSON do Admin do Ghost
 * (`.cache/ghost-export.json`). Diferente do que MIGRACAOGHOSTSANITY.md §4
 * assume, este export inclui o campo `html` já renderizado (não só
 * `lexical`), então dá para reaproveitar htmlToPT.ts sem escrever um parser
 * de lexical. Usado aqui porque também traz páginas/rascunhos e não depende
 * de paginação contra o site no ar.
 */

const EXPORT_FILE = './.cache/ghost-export.json'
const GHOST_URL = (process.env.GHOST_URL ?? '').replace(/\/$/, '')

let _db: any = null
function loadDb() {
  if (_db) return _db
  const raw = JSON.parse(fs.readFileSync(EXPORT_FILE, 'utf8'))
  _db = Array.isArray(raw.db) ? raw.db[0] : raw.db
  return _db
}

/** Resolve o placeholder `__GHOST_URL__` usado no export para URLs locais. */
function resolveUrl<T extends string | null | undefined>(url: T): T {
  if (!url) return url
  return url.replace('__GHOST_URL__', GHOST_URL) as T
}

function resolveHtmlUrls(html: string): string {
  return html.replaceAll('__GHOST_URL__', GHOST_URL)
}

export function getAuthors() {
  const { users } = loadDb().data
  return users.map((u: any) => ({
    id: u.id,
    name: u.name,
    slug: u.slug,
    bio: u.bio,
    website: u.website,
    profile_image: resolveUrl(u.profile_image),
  }))
}

export function getTags() {
  const { tags } = loadDb().data
  return tags.map((t: any) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    visibility: t.visibility,
    feature_image: resolveUrl(t.feature_image),
  }))
}

function buildPosts(type: 'post' | 'page') {
  const { posts, posts_authors, posts_tags, users, tags } = loadDb().data

  const usersById = new Map(users.map((u: any) => [u.id, u]))
  const tagsById = new Map(tags.map((t: any) => [t.id, t]))

  const authorsByPost = new Map<string, any[]>()
  for (const pa of [...posts_authors].sort((a, b) => a.sort_order - b.sort_order)) {
    const list = authorsByPost.get(pa.post_id) ?? []
    const u = usersById.get(pa.author_id)
    if (u) list.push(u)
    authorsByPost.set(pa.post_id, list)
  }

  const tagsByPost = new Map<string, any[]>()
  for (const pt of [...posts_tags].sort((a, b) => a.sort_order - b.sort_order)) {
    const list = tagsByPost.get(pt.post_id) ?? []
    const t = tagsById.get(pt.tag_id)
    if (t) list.push(t)
    tagsByPost.set(pt.post_id, list)
  }

  return posts
    .filter((p: any) => p.type === type && p.status === 'published')
    .map((p: any) => {
      const authors = authorsByPost.get(p.id) ?? []
      const postTags = (tagsByPost.get(p.id) ?? []).map((t: any) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        visibility: t.visibility,
      }))

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        html: resolveHtmlUrls(p.html ?? ''),
        custom_excerpt: p.custom_excerpt,
        excerpt: p.plaintext ? p.plaintext.slice(0, 300).trim() : undefined,
        feature_image: resolveUrl(p.feature_image),
        published_at: p.published_at,
        url: `${GHOST_URL}/${p.slug}/`,
        primary_author: authors[0] ? { id: authors[0].id } : undefined,
        tags: postTags,
      }
    })
}

export const getPosts = () => buildPosts('post')
export const getPages = () => buildPosts('page')
