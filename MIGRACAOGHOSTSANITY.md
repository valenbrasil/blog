# Instrução: Migração de conteúdo Ghost CMS → Sanity

> **Como usar este arquivo:** coloque-o na raiz do projeto (ou em `/docs`) e referencie-o
> a partir do `CLAUDE.md` / `AGENTS.md` / `.cursorrules`. Ele é a fonte da verdade para
> qualquer script de migração deste repositório. Regras marcadas com **OBRIGATÓRIO**
> não devem ser violadas sem decisão explícita.

---

## 1. Princípios (leia antes de escrever código)

1. **Não espelhar o Ghost.** O schema do Sanity é modelado a partir do conteúdo desejado,
   não da estrutura do Ghost. O Ghost é apenas fonte de dados.
2. **OBRIGATÓRIO — IDs determinísticos.** Todo documento migrado recebe `_id` derivado do
   ID do Ghost (`post-${ghostId}`). Combinado com `createOrReplace`, a migração fica
   idempotente e pode ser reexecutada indefinidamente sem duplicar nada.
3. **OBRIGATÓRIO — `--dry-run` antes de qualquer escrita.** Todo script de migração
   aceita a flag e imprime os documentos gerados sem gravar.
4. **Cache local de tudo.** Fetch do Ghost e uploads de assets são cacheados em `.cache/`.
   A conversão será reexecutada dezenas de vezes enquanto as regras são ajustadas.
5. **Falha isolada, nunca abortiva.** Um post que falha na conversão é logado e pulado;
   o lote continua. Ao final, reprocessa-se apenas o que falhou.
6. **Assets primeiro, conversão depois.** Nenhuma imagem pode virar link externo no corpo.

---

## 2. Pré-requisitos

| Item | Onde obter |
|---|---|
| Ghost Content API Key + URL | Ghost Admin → Settings → Integrations → Add custom integration |
| Sanity token (role `Editor`) | sanity.io/manage → projeto → API → Tokens |
| Node | 18+ |

### Dependências

```bash
npm i @sanity/client @sanity/schema @portabletext/block-tools jsdom p-limit
npm i -D tsx dotenv @types/jsdom
```

### Variáveis de ambiente (`.env.local`)

```env
GHOST_URL=https://seusite.com
GHOST_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
SANITY_PROJECT_ID=xxxxxxxx
SANITY_DATASET=production
SANITY_TOKEN=sk...
```

**OBRIGATÓRIO:** `.env.local` e `.cache/` no `.gitignore`. O token do Sanity tem permissão
de escrita no dataset inteiro.

---

## 3. Estrutura de arquivos

```
/scripts
  ├─ ghost.ts          # cliente Ghost + fetch paginado + cache
  ├─ sanityClient.ts   # cliente Sanity com token de escrita
  ├─ images.ts         # download + upload + cache de assets
  ├─ htmlToPT.ts       # conversor HTML → Portable Text (regras do Ghost)
  ├─ 01-authors.ts
  ├─ 02-tags.ts
  └─ 03-posts.ts
/.cache                # gitignored
```

### Ordem de execução — OBRIGATÓRIA

```bash
npx tsx scripts/01-authors.ts
npx tsx scripts/02-tags.ts
npx tsx scripts/03-posts.ts --dry-run
npx tsx scripts/03-posts.ts
```

Posts referenciam autores e categorias por `_ref`. Se rodar fora de ordem, as referências
apontam para documentos inexistentes.

---

## 4. Extração do Ghost

**OBRIGATÓRIO: usar a Content API com `formats=html`.** Não usar o export JSON do Admin —
ele traz o corpo em `lexical` (Ghost 5.x+) ou `mobiledoc` (versões antigas), formatos
proprietários de parsing custoso. A Content API entrega HTML renderizado.

`scripts/ghost.ts`

```ts
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
```

### Campos relevantes do post no Ghost

| Ghost | Sanity | Observação |
|---|---|---|
| `id` | `ghostId` + base do `_id` | ObjectId hex, válido como ID do Sanity |
| `title` | `title` | |
| `slug` | `slug.current` | preservar para SEO |
| `html` | `body` | converter para Portable Text |
| `custom_excerpt` / `excerpt` | `excerpt` | `custom_excerpt` tem precedência |
| `feature_image` | `mainImage` | upload obrigatório |
| `published_at` | `publishedAt` | ISO 8601, compatível com `datetime` |
| `primary_author.id` | `author._ref` | |
| `tags[]` | `categories[]._ref` | filtrar `visibility === 'internal'` |
| `url` | `legacyUrl` | auditoria e redirects |

**Rascunhos:** a Content API só retorna posts publicados. Para rascunhos é necessária a
Admin API (autenticação JWT) ou o export JSON do Admin.

---

## 5. Cliente do Sanity

`scripts/sanityClient.ts`

```ts
import { createClient } from '@sanity/client'
import 'dotenv/config'

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-10-01',
  useCdn: false, // OBRIGATÓRIO em scripts de escrita
})
```

---

## 6. Schemas do Sanity

```ts
// sanity/schemaTypes/author.ts
import { defineType, defineField } from 'sanity'

export const author = defineType({
  name: 'author',
  type: 'document',
  title: 'Autor',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'bio', type: 'text' }),
    defineField({ name: 'image', type: 'image' }),
    defineField({ name: 'website', type: 'url' }),
  ],
})
```

```ts
// sanity/schemaTypes/category.ts  (tags do Ghost)
import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  type: 'document',
  title: 'Categoria',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', type: 'text' }),
  ],
})
```

```ts
// sanity/schemaTypes/blocks.ts
import { defineType, defineField } from 'sanity'

export const codeBlock = defineType({
  name: 'codeBlock',
  type: 'object',
  title: 'Código',
  fields: [
    defineField({ name: 'language', type: 'string' }),
    defineField({ name: 'code', type: 'text' }),
  ],
})

export const embed = defineType({
  name: 'embed',
  type: 'object',
  title: 'Embed',
  fields: [
    defineField({ name: 'url', type: 'url' }),
    defineField({ name: 'provider', type: 'string' }), // youtube | vimeo | twitter | other
  ],
})
```

```ts
// sanity/schemaTypes/post.ts
import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  type: 'document',
  title: 'Post',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'excerpt', type: 'text' }),
    defineField({ name: 'mainImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', fields: [{ name: 'caption', type: 'string' }] },
        { type: 'codeBlock' },
        { type: 'embed' },
      ],
    }),
    // metadados legados — auditoria, redirects e reexecução
    defineField({ name: 'ghostId', type: 'string', readOnly: true }),
    defineField({ name: 'legacyUrl', type: 'url', readOnly: true }),
  ],
})
```

---

## 7. Convenção de IDs — OBRIGATÓRIA

```ts
// scripts/ids.ts
export const authorId   = (g: { id: string }) => `author-${g.id}`
export const categoryId = (g: { id: string }) => `category-${g.id}`
export const postId     = (g: { id: string }) => `post-${g.id}`
```

Nunca deixar o Sanity gerar `_id` em scripts de migração. Sempre `createOrReplace`,
nunca `create`.

---

## 8. Assets (imagens)

Estratégia em duas fases: **upload de todos os assets primeiro, conversão do HTML depois**,
usando um mapa `URL → assetId`. Sem isso, imagens do corpo viram links externos que quebram
quando a instância do Ghost for desligada.

`scripts/images.ts`

```ts
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
```

**ATENÇÃO CRÍTICA:** se as imagens estão no `/content/images/` local do Ghost, elas deixam
de existir quando a instância for desligada. Rodar o upload **enquanto o Ghost ainda está
no ar**.

---

## 9. HTML → Portable Text

O Ghost gera markup próprio (cards `kg-*`) que o deserializador padrão não reconhece.
Regras customizadas são obrigatórias.

`scripts/htmlToPT.ts`

```ts
import { htmlToBlocks } from '@portabletext/block-tools'
import { Schema } from '@sanity/schema'
import { JSDOM } from 'jsdom'
import { getCachedAsset } from './images'
import { schemaTypes } from '../sanity/schemaTypes'

const compiled = Schema.compile({ name: 'default', types: schemaTypes })
const blockContentType = compiled
  .get('post')
  .fields.find((f: any) => f.name === 'body').type

/** Reescreve links internos do domínio antigo para a nova estrutura de rotas. */
function rewriteInternalLinks(html: string): string {
  const base = process.env.GHOST_URL!.replace(/\/$/, '')
  return html.replaceAll(
    new RegExp(`${base}/([a-z0-9-]+)/?`, 'g'),
    '/blog/$1'
  )
}

/** Remove parágrafos vazios gerados pelo editor do Ghost. */
function removeEmptyBlocks(blocks: any[]): any[] {
  return blocks.filter(
    (b) =>
      b._type !== 'block' ||
      (b.children ?? []).some((c: any) => (c.text ?? '').trim() !== '')
  )
}

export function convert(html: string) {
  const prepared = rewriteInternalLinks(html ?? '')

  const blocks = htmlToBlocks(prepared, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
    rules: [
      // ── 1. Card de imagem do Ghost (figure + figcaption) ───────────────
      {
        deserialize(el: any, _next: any, block: any) {
          if (el.tagName?.toLowerCase() !== 'figure') return undefined
          const img = el.querySelector('img')
          if (!img) return undefined

          const src = img.getAttribute('src')
          if (!src) return undefined

          const assetId = getCachedAsset(src)
          if (!assetId) return undefined // sem asset: descarta em vez de gravar link quebrado

          return block({
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId },
            alt: img.getAttribute('alt') || undefined,
            caption: el.querySelector('figcaption')?.textContent?.trim() || undefined,
          })
        },
      },

      // ── 2. Imagem solta (fora de figure) ──────────────────────────────
      {
        deserialize(el: any, _next: any, block: any) {
          if (el.tagName?.toLowerCase() !== 'img') return undefined
          const src = el.getAttribute('src')
          if (!src) return undefined

          const assetId = getCachedAsset(src)
          if (!assetId) return undefined

          return block({
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId },
            alt: el.getAttribute('alt') || undefined,
          })
        },
      },

      // ── 3. Embeds (YouTube, Vimeo, Twitter…) ──────────────────────────
      {
        deserialize(el: any, _next: any, block: any) {
          const iframe =
            el.tagName?.toLowerCase() === 'iframe' ? el : el.querySelector?.('iframe')
          if (!iframe) return undefined

          const src = iframe.getAttribute('src') || ''
          const provider = /youtu/.test(src)
            ? 'youtube'
            : /vimeo/.test(src)
            ? 'vimeo'
            : /twitter|x\.com/.test(src)
            ? 'twitter'
            : 'other'

          return block({ _type: 'embed', url: src, provider })
        },
      },

      // ── 4. Blocos de código ───────────────────────────────────────────
      {
        deserialize(el: any, _next: any, block: any) {
          if (el.tagName?.toLowerCase() !== 'pre') return undefined
          const code = el.querySelector('code')
          if (!code) return undefined

          const lang = (code.className?.match(/language-(\w+)/) || [])[1]
          return block({
            _type: 'codeBlock',
            language: lang || 'text',
            code: code.textContent ?? '',
          })
        },
      },

      // ── 5. Descarte de cards de UI do Ghost ───────────────────────────
      {
        deserialize(el: any) {
          const cls = typeof el.className === 'string' ? el.className : ''
          if (/kg-bookmark-card|kg-button-card|kg-cta-card|kg-header-card/.test(cls)) {
            return null // null = ignora o nó explicitamente
          }
          return undefined // undefined = passa para a próxima regra
        },
      },
    ],
  })

  return removeEmptyBlocks(blocks)
}
```

### Contrato das regras — memorize

| Retorno | Significado |
|---|---|
| `block({...})` | produz um bloco customizado |
| `null` | descarta o nó |
| `undefined` | não se aplica; passa para a próxima regra / comportamento padrão |

---

## 10. Scripts de migração

### `scripts/01-authors.ts`

```ts
import { getAuthors } from './ghost'
import { client } from './sanityClient'
import { uploadImage } from './images'
import { authorId } from './ids'

const DRY_RUN = process.argv.includes('--dry-run')
const authors = await getAuthors()

const docs = []
for (const a of authors) {
  docs.push({
    _id: authorId(a),
    _type: 'author',
    name: a.name,
    slug: { _type: 'slug', current: a.slug },
    bio: a.bio ?? undefined,
    website: a.website ?? undefined,
    image: a.profile_image ? await uploadImage(a.profile_image) : undefined,
  })
}

if (DRY_RUN) {
  console.log(JSON.stringify(docs, null, 2))
  process.exit(0)
}

const tx = client.transaction()
docs.forEach((d) => tx.createOrReplace(d))
await tx.commit()
console.log(`✓ ${docs.length} autores`)
```

### `scripts/02-tags.ts`

```ts
import { getTags } from './ghost'
import { client } from './sanityClient'
import { categoryId } from './ids'

const DRY_RUN = process.argv.includes('--dry-run')
const tags = await getTags()

// OBRIGATÓRIO: tags internas do Ghost (prefixo "#") não viram categoria
const docs = tags
  .filter((t: any) => t.visibility !== 'internal')
  .map((t: any) => ({
    _id: categoryId(t),
    _type: 'category',
    title: t.name,
    slug: { _type: 'slug', current: t.slug },
    description: t.description ?? undefined,
  }))

if (DRY_RUN) {
  console.log(JSON.stringify(docs, null, 2))
  process.exit(0)
}

const tx = client.transaction()
docs.forEach((d) => tx.createOrReplace(d))
await tx.commit()
console.log(`✓ ${docs.length} categorias`)
```

### `scripts/03-posts.ts`

```ts
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
```

---

## 11. Redirects e SEO

Sem redirects 301, o ranking de todos os posts antigos é perdido.

```ts
// scripts/gen-redirects.ts → gera redirects.json
import { getPosts } from './ghost'
import fs from 'node:fs'

const posts = await getPosts()
const redirects = posts.map((p: any) => ({
  source: `/${p.slug}`,
  destination: `/blog/${p.slug}`,
  permanent: true,
}))

fs.writeFileSync('./redirects.json', JSON.stringify(redirects, null, 2))
```

```js
// next.config.js
const redirects = require('./redirects.json')
module.exports = {
  async redirects() {
    return redirects
  },
}
```

Para Astro/Netlify, gerar `_redirects` no formato `/{slug} /blog/{slug} 301`.
Para Vercel sem Next, usar o array `redirects` do `vercel.json`.

---

## 12. Verificação — checklist obrigatório

Executar no Vision (Sanity Studio → Vision) após a migração:

```groq
// 1. Contagem — deve bater com o total do Ghost
count(*[_type == "post"])

// 2. Referências órfãs — deve retornar vazio
*[_type == "post" && !defined(author->_id)]{ title, ghostId }

// 3. Corpos vazios — cada resultado é uma regra de conversão faltando
*[_type == "post" && count(body) == 0]{ title, ghostId, legacyUrl }

// 4. Posts sem imagem de capa que tinham feature_image no Ghost
*[_type == "post" && !defined(mainImage)]{ title, legacyUrl }

// 5. Slugs duplicados
*[_type == "post"]{ "s": slug.current } | { "dups": count(*) }
```

Além das queries:

- [ ] Comparar total de URLs coletadas com o número de entradas em `.cache/assets.json`
- [ ] Abrir no Studio os **10 posts mais longos** e ler de ponta a ponta
- [ ] Abrir os **5 posts com mais mídia** e conferir imagens, embeds e código
- [ ] Testar 5 redirects em produção com `curl -I`
- [ ] Conferir que nenhum link no corpo aponta para o domínio antigo

---

## 13. Alternativa simplificada: NDJSON + `sanity dataset import`

Para volumes pequenos (< 200 posts) e conteúdo sem cards exóticos, é possível dispensar
todo o código de upload de assets. Gerar um `.ndjson` (um documento JSON por linha) usando
o campo mágico `_sanityAsset`:

```json
{"_id":"post-abc123","_type":"post","title":"Olá mundo","slug":{"_type":"slug","current":"ola-mundo"},"mainImage":{"_sanityAsset":"image@https://seusite.com/content/images/foto.jpg"}}
```

```bash
npx sanity dataset import posts.ndjson production --replace
```

O CLI baixa e sobe cada imagem automaticamente, deduplicando por hash.
A conversão HTML → Portable Text (seção 9) continua necessária.

---

## 14. Armadilhas conhecidas

| Problema | Causa | Solução |
|---|---|---|
| Erro silencioso no Studio ao abrir um post | item de array sem `_key` | todo item de `categories` e `body` precisa de `_key` único |
| Imagens quebradas após desligar o Ghost | assets nunca foram baixados | rodar a Fase 1 com o Ghost **no ar** |
| HTTP 429 do Sanity | concorrência alta de upload | manter `pLimit(3)` |
| Rascunhos ausentes | Content API só retorna publicados | usar Admin API (JWT) ou export do Admin |
| Documentos duplicados a cada execução | `_id` gerado pelo Sanity | usar IDs determinísticos + `createOrReplace` |
| Blocos de código viram parágrafo | regra de `<pre>` ausente | ver seção 9, regra 4 |
| `Schema.compile` falha | tipos usando funções/JSX | garantir que `schemaTypes` são objetos serializáveis do `defineType` |

### Fora do escopo do Sanity — decidir ANTES de migrar

O Sanity é **apenas conteúdo**. Não existe equivalente para:

- **Membros e assinaturas** do Ghost (paywall, tiers, Stripe)
- **Newsletter e envio de e-mail**
- **Comentários nativos**

Se o site usa essas funcionalidades, é preciso uma solução paralela
(Resend, Buttondown, Beehiiv, Memberstack, Outseta). Em alguns casos isso muda a decisão
de migrar — avaliar antes de escrever qualquer script.

---

## 15. Fontes

- [How to migrate from Ghost to Sanity CMS — Roboto Studio](https://robotostudio.com/blog/migrating-from-ghost-to-sanity)
- [Converting HTML to Portable Text — Sanity Learn](https://www.sanity.io/learn/course/migrating-content-from-wordpress-to-sanity/converting-html-to-portable-text)
- [Migrating content from WordPress to Sanity (curso completo) — Sanity Learn](https://www.sanity.io/learn/course/migrating-content-from-wordpress-to-sanity)
- [Migrating from Ghost to Sanity — Sanity Answers](https://www.sanity.io/answers/migrating-from-ghost-to-sanity-requires-scripting-or-manual-effort--)
- [`@sanity/block-tools` — npm](https://www.npmjs.com/package/@sanity/block-tools)
- [Presenting Portable Text — Sanity Docs](https://www.sanity.io/docs/developer-guides/presenting-block-text)
- [Ghost Content API — documentação oficial](https://ghost.org/docs/content-api/)
- [Sanity CMS Migration: Step-by-Step Guide — Webstacks](https://www.webstacks.com/blog/sanity-cms-migration)
