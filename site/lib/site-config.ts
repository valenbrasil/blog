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

/**
 * Endereços da marca fora do blog. Ambos vêm do design system
 * (valenbrasil.github.io/design): o kit de blog liga o item "Home" ao site
 * institucional e o botão "Fale conosco" a este número de WhatsApp.
 */
export const INSTITUTIONAL_URL = 'https://valenbrasil.com'
export const WHATSAPP_URL = 'https://wa.me/554731701572'

/** Quantos cards o feed mostra por página. */
export const POSTS_PER_PAGE = 12

/**
 * Medição do Google Analytics 4. O ID é público — vai no HTML de toda página —,
 * então fica aqui e não em variável de ambiente: esconder não protegeria nada e
 * só criaria mais uma peça de configuração para o deploy carregar.
 */
export const GA_MEASUREMENT_ID = 'G-DP9C1G5246'
