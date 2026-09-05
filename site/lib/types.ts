export interface SanityImage {
  asset: { _ref: string; _type: 'reference' }
  alt?: string
  /* Texto do atributo `title` — o balão de hover, distinto do alt e da legenda. */
  title?: string
  caption?: string
  hotspot?: { x: number; y: number; height: number; width: number }
}

export interface Author {
  _id: string
  name: string
  slug: string
  bio?: string
  website?: string
  image?: SanityImage
}

export interface Category {
  _id: string
  title: string
  slug: string
  description?: string
}

export interface CodeBlock {
  _type: 'codeBlock'
  _key: string
  language?: string
  code: string
}

export interface Embed {
  _type: 'embed'
  _key: string
  url: string
  provider?: string
}

export interface BodyImage extends SanityImage {
  _type: 'image'
  _key: string
}

export type BodyBlock = { _type: 'block'; _key: string; [key: string]: unknown } | BodyImage | CodeBlock | Embed

export interface PostSummary {
  _id: string
  title: string
  slug: string
  excerpt?: string
  mainImage?: SanityImage
  publishedAt: string
  author?: { name: string; slug: string }
  categories?: Category[]
}

export interface Post extends PostSummary {
  body: BodyBlock[]
  seo?: { metaTitle?: string; metaDescription?: string }
  /*
    Carimbo de última edição mantido pelo próprio Sanity. Serve ao dateModified
    do JSON-LD: sem ele o Google só conhece a data de publicação e não percebe
    revisão de artigo antigo. Opcional porque só a query do artigo o projeta —
    as listagens não precisam dele.
  */
  _updatedAt?: string
}
