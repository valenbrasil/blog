import { client } from './client'
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
