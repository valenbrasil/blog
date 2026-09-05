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

/**
 * Ahrefs Web Analytics. A chave é pública — sai no HTML de toda página, como a
 * do GA — então fica junto do resto da configuração, não em variável de
 * ambiente.
 */
export const AHREFS_ANALYTICS_KEY = 'X2AoK5UaoY8tPMNmCRaBhA'

/**
 * Dados de registro da empresa, conferidos no rodapé do site institucional
 * (https://valenbrasil.com) em 5 de setembro de 2026 — a mesma fonte que o
 * blog cita como institucional, não uma transcrição de segunda mão.
 *
 * Servem a três lugares de uma vez: o rodapé de toda página, o JSON-LD de
 * Organization e as duas páginas legais. Ficam aqui porque um número de
 * registro repetido em três arquivos diverge no dia em que um deles mudar.
 *
 * CAU é o Conselho de Arquitetura e Urbanismo; CRECI, o Conselho Regional de
 * Corretores de Imóveis. Num blog que fala de avaliação de imóveis, o registro
 * profissional é o que separa quem pode assinar um laudo de quem não pode.
 */
export const EMPRESA = {
  razaoSocial: 'Valen Brasil Gestão Empresarial Ltda',
  nome: 'Valen Brasil',
  cnpj: '39.819.814/0001-98',
  cau: 'PJ69468-1',
  creci: '11689-J',
  fundacao: '2020',
  endereco: {
    logradouro: 'Rua Samuel Heusi, 463',
    cidade: 'Itajaí',
    estado: 'SC',
    estadoNome: 'Santa Catarina',
    pais: 'BR',
  },
  telefone: '+55 47 3170-1572',
  email: 'contato@valenbrasil.com',
  emailPrivacidade: 'privacidade@valenbrasil.com',
} as const
