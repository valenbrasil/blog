/**
 * Endereço público do site, por variável de ambiente — o blog já mudou de
 * repositório uma vez e vai mudar de novo quando o domínio próprio entrar.
 * Sem isso, cada mudança de endereço exige editar next.config.ts, sitemap.ts,
 * sitemap-posts.xml e robots.ts.
 *
 * Num GitHub Pages de projeto o site é servido sob o nome do repositório
 * (`/blog`); num domínio próprio, sob a raiz — aí basta NEXT_PUBLIC_BASE_PATH=""
 * e NEXT_PUBLIC_SITE_URL=https://blog.valenbrasil.com no build.
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/blog'

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://valenbrasil.github.io/blog'
).replace(/\/$/, '')
