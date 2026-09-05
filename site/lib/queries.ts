import { client } from './client'
import { montarGrafo } from './relacionados'
import type { Category, Post, PostSummary } from './types'

const postSummaryProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage,
  publishedAt,
  "author": author->{ name, "slug": slug.current },
  "categories": categories[]->{ _id, title, "slug": slug.current, description }
}`

export async function getAllPosts(): Promise<PostSummary[]> {
  return client.fetch(
    `*[_type == "post" && defined(slug.current) && slug.current != ""] | order(publishedAt desc) ${postSummaryProjection}`,
  )
}

export async function getAllPostSlugs(): Promise<string[]> {
  return client.fetch(
    `*[_type == "post" && defined(slug.current) && slug.current != ""].slug.current`,
  )
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      _updatedAt,
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      publishedAt,
      "author": author->{ name, "slug": slug.current },
      "categories": categories[]->{ _id, title, "slug": slug.current, description },
      body,
      seo
    }`,
    { slug },
  )
}

export async function getAllCategories(): Promise<Category[]> {
  return client.fetch(
    `*[_type == "category" && defined(slug.current) && slug.current != ""] | order(title asc) { _id, title, "slug": slug.current, description }`,
  )
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{ _id, title, "slug": slug.current, description }`,
    { slug },
  )
}

export async function getPostsByCategory(slug: string): Promise<PostSummary[]> {
  return client.fetch(
    `*[_type == "post" && defined(slug.current) && slug.current != "" && $slug in categories[]->slug.current] | order(publishedAt desc) ${postSummaryProjection}`,
    { slug },
  )
}

/*
  Grafo do "Leia também", montado uma vez por build e reaproveitado por todas as
  páginas. A promessa de que todo artigo recebe pelo menos um link interno é uma
  propriedade do acervo inteiro — ver `lib/relacionados.ts` para o porquê de ela
  não caber numa consulta por página.

  A memória fica no módulo, não num cache com expiração: o build de um
  `output: 'export'` roda num processo só e gera as 206 páginas em sequência.
  Uma promessa guardada, e não o resultado, para que 206 chamadas simultâneas
  não disparem 206 buscas.
*/
let grafoDeRelacionados: Promise<{
  grafo: Map<string, string[]>
  porSlug: Map<string, PostSummary>
}> | null = null

function carregarGrafo() {
  grafoDeRelacionados ??= (async () => {
    const posts = await getAllPosts()
    return {
      grafo: montarGrafo(posts),
      porSlug: new Map(posts.map((post) => [post.slug, post])),
    }
  })()
  return grafoDeRelacionados
}

/**
 * Sugestões de fim de artigo, escolhidas por assunto compartilhado.
 *
 * A versão anterior pedia os mais recentes da mesma categoria. Como a ordem era
 * por data, os 618 links desses blocos apontavam para apenas 20 artigos, e 186
 * dos 206 não apareciam em lugar nenhum.
 */
export async function getRelatedPosts(slug: string): Promise<PostSummary[]> {
  const { grafo, porSlug } = await carregarGrafo()
  return (grafo.get(slug) ?? [])
    .map((vizinho) => porSlug.get(vizinho))
    .filter((post): post is PostSummary => Boolean(post))
}
