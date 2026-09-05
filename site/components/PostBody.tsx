import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponent,
} from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { isInternalHref } from '@/lib/links'
import type { BodyBlock } from '@/lib/types'

/** markDef de link gravado no corpo — `nofollow` é o campo novo do schema. */
type LinkAnnotation = {
  _type: 'link'
  _key?: string
  href?: string
  nofollow?: boolean
}

/**
 * Link do corpo do artigo.
 *
 * A política é DOFOLLOW por padrão: o próprio Google trata link de saída para
 * fonte de autoridade como sinal de qualidade, e nofollow generalizado diz ao
 * buscador para não endossar nada — inclusive as fontes que sustentam o texto.
 * Nenhum link do acervo é pago ou de afiliado, então nada aqui recebe nofollow
 * automaticamente; ele é opt-in por link, via campo `nofollow` da anotação, para
 * o dia em que existir conteúdo patrocinado.
 *
 * `noopener`/`noreferrer` NÃO são sinal de SEO: são atributos de segurança
 * (tirar o acesso da aba nova a `window.opener`) e de privacidade (não vazar o
 * Referer). Não interferem na transmissão de autoridade.
 */
const LinkMark: PortableTextMarkComponent<LinkAnnotation> = ({ value, children }) => {
  const href = value?.href ?? ''

  // Link interno navega na mesma aba: abrir o próprio blog em aba nova quebra
  // o botão "voltar" do leitor.
  if (isInternalHref(href)) return <a href={href}>{children}</a>

  const rel = value?.nofollow === true ? 'noopener noreferrer nofollow' : 'noopener noreferrer'

  return (
    <a href={href} target="_blank" rel={rel}>
      {children}
    </a>
  )
}

const components: PortableTextComponents = {
  marks: {
    link: LinkMark,
  },
  types: {
    image: ({ value }) => {
      const url = urlFor(value).width(1200).fit('max').auto('format').url()
      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt || ''}
            width={1200}
            height={800}
            className="h-auto w-full rounded-card"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-neutral-500">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      )
    },
    codeBlock: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded-card bg-neutral-900 p-4 font-mono text-sm text-neutral-100">
        <code>{value.code}</code>
      </pre>
    ),
    embed: ({ value }) => (
      <div className="my-8 aspect-video">
        <iframe
          src={value.url}
          className="h-full w-full rounded-card"
          allowFullScreen
          loading="lazy"
        />
      </div>
    ),
  },
}

export function PostBody({ body }: { body: BodyBlock[] }) {
  if (!body || body.length === 0) return null
  return (
    <div className="prose prose-valen max-w-none">
      <PortableText value={body} components={components} />
    </div>
  )
}
