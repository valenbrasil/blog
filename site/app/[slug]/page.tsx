import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/queries'
import { urlFor } from '@/lib/image'
import { formatDateShort } from '@/lib/date'
import { PostBody } from '@/components/PostBody'
import { StructuredData } from '@/components/StructuredData'
import { PostGrid } from '@/components/PostGrid'
import { CtaCard } from '@/components/CtaCard'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Separator } from '@/components/ui/Separator'
import { SITE_URL } from '@/lib/site-config'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt

  /*
    1200×630 é o formato que Facebook, LinkedIn e WhatsApp recortam sem cortar
    o assunto da foto. Post sem mainImage fica sem imagem no card: uma capa
    inventada (logo, imagem de outro post) engana quem compartilha.
  */
  const ogImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').auto('format').url()
    : null
  const images = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: post.mainImage?.alt || post.title }]
    : undefined

  // Caminhos relativos de propósito: o metadataBase do layout já carrega o
  // domínio e, se houver, o subdiretório. Barra final para bater com o
  // trailingSlash do export e com as URLs do sitemap.
  const path = `/${slug}/`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      // Declarar openGraph aqui descarta o do layout inteiro — daí siteName e
      // locale repetidos.
      type: 'article',
      siteName: 'Valen Brasil',
      locale: 'pt_BR',
      title,
      description,
      url: path,
      publishedTime: post.publishedAt,
      authors: [post.author?.name ?? 'Valen Brasil'],
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}

export default async function PostPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const category = post.categories?.[0]
  const related = await getRelatedPosts(slug, category?.slug)
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1600).height(900).fit('crop').auto('format').url()
    : null

  const crumbs: Crumb[] = [
    { label: 'Blog', href: '/' },
    ...(category ? [{ label: category.title, href: `/categoria/${category.slug}` }] : []),
    { label: post.title },
  ]

  /*
    URLs absolutas para o JSON-LD. O metadataBase só resolve caminho relativo
    nas tags de metadata; dentro do JSON o schema.org exige o endereço completo.
    Barra final para bater com o canonical e com o sitemap — variação de barra
    faz o Google tratar como duas páginas.
  */
  const postUrl = `${SITE_URL}/${slug}/`
  const authorName = post.author?.name ?? 'Valen Brasil'
  const description = post.seo?.metaDescription || post.excerpt

  /*
    Mesmo recorte 1200×630 do og:image: é o que o Google pede para o campo image
    de artigo e evita servir duas derivações diferentes da mesma foto.
  */
  const schemaImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').auto('format').url()
    : null

  const blogPosting: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    ...(description ? { description } : {}),
    datePublished: post.publishedAt,
    /*
      _updatedAt é o carimbo que o Sanity mantém sozinho. Quando a projeção não
      o traz (post antigo em cache de build, por exemplo), cai para a data de
      publicação: repetir a data conhecida é honesto; inventar "hoje" seria
      dizer ao Google que o artigo foi revisado quando não foi.
    */
    dateModified: post._updatedAt ?? post.publishedAt,
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: 'Valen Brasil' },
    ...(schemaImage ? { image: schemaImage } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    ...(category ? { articleSection: category.title } : {}),
  }

  const breadcrumbList: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { name: 'Blog', item: `${SITE_URL}/` },
      ...(category
        ? [{ name: category.title, item: `${SITE_URL}/categoria/${category.slug}/` }]
        : []),
      // O último degrau é a própria página: fica sem `item`, como o schema.org
      // recomenda, já que não é um link para outro lugar.
      { name: post.title },
    ].map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })),
  }

  return (
    <>
      <StructuredData data={blogPosting} />
      <StructuredData data={breadcrumbList} />

      <div className="mx-auto max-w-[1080px] px-6 pt-8">
        <Breadcrumb items={crumbs} />
      </div>

      <article className="mx-auto max-w-[760px] px-6 pt-10">
        <header className="grid justify-items-start gap-5">
          {category ? <Badge tone="brand">{category.title}</Badge> : null}
          <h1 className="font-display text-4xl leading-tight font-light tracking-tight text-neutral-900 md:text-[2.75rem]">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
            <Avatar name={post.author?.name ?? 'Valen Brasil'} />
            <span className="text-sm text-neutral-500">
              {post.author?.name ?? 'Valen Brasil'} •{' '}
              <time dateTime={post.publishedAt}>{formatDateShort(post.publishedAt)}</time>
            </span>
          </div>
        </header>

        {imageUrl ? (
          <figure className="my-10">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || ''}
              // Sem valor gravado o atributo não é emitido: title="" só entrega
              // ao leitor um balão de hover vazio.
              title={post.mainImage?.title || undefined}
              width={1600}
              height={900}
              priority
              className="aspect-video w-full rounded-[1.25rem] object-cover"
            />
            {post.mainImage?.caption ? (
              <figcaption className="mt-2 text-center text-sm text-neutral-500">
                {post.mainImage.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <div className="mt-10" />
        )}

        {post.excerpt ? (
          <p className="mb-6 text-lg leading-relaxed text-neutral-900">{post.excerpt}</p>
        ) : null}

        <PostBody body={post.body} />

        <CtaCard />
      </article>

      {related.length > 0 ? (
        <div className="mx-auto mt-16 max-w-[1080px] px-6">
          <Separator label="Leia também" />
          <div className="mt-8">
            <PostGrid posts={related} />
          </div>
          <div className="mt-8">
            <Button href="/" variant="ghost" iconLeft="arrow-left">
              Voltar ao blog
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}
