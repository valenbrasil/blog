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
