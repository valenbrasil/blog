/**
 * Classificação de link do corpo do artigo: interno (deixa passar cru) ou
 * externo (ganha target/rel no PostBody).
 *
 * O acervo veio do Ghost e mistura três formatos de href para o mesmo destino:
 * relativo ("/slug"), absoluto no domínio próprio ("https://blog.valenbrasil.com/slug")
 * e absoluto em outro domínio da marca. Sem normalizar host, link nosso sairia
 * com target="_blank" e o leitor perderia o histórico de navegação dentro do blog.
 */

/**
 * Domínios da marca. Tudo aqui — e qualquer subdomínio — conta como interno,
 * mesmo que a rota final esteja fora deste repositório.
 */
const OWN_DOMAINS = [
  'valenbrasil.com',
  'blog.valenbrasil.com',
  'valenbrasil.com.br',
  'valenbrasil.github.io',
] as const

/**
 * Confere o host de um href absoluto contra os domínios da marca.
 * href malformado devolve `false` (externo): errar para o lado de aplicar
 * rel="noopener noreferrer" é mais seguro do que deixar um destino desconhecido
 * com acesso a `window.opener`.
 */
function isOwnHost(absoluteHref: string): boolean {
  try {
    // `www.` é só apresentação: www.valenbrasil.com e valenbrasil.com são o mesmo site.
    const host = new URL(absoluteHref).hostname.toLowerCase().replace(/^www\./, '')
    return OWN_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`))
  } catch {
    return false
  }
}

export function isInternalHref(href: string): boolean {
  // Anotação sem href acontece quando o editor cria o link e não preenche a URL.
  // Nada a marcar: o <a> sai como está.
  if (!href) return true

  const value = href.trim()
  if (!value) return true

  // "//exemplo.com" também começa com barra, então precisa ser testado ANTES da
  // rota relativa — herda o protocolo da página, mas aponta para outro host.
  if (value.startsWith('//')) return isOwnHost(`http:${value}`)

  // Rota do próprio site ou âncora na mesma página.
  if (value.startsWith('/') || value.startsWith('#')) return true

  const scheme = value.toLowerCase()

  // mailto:/tel: não são navegação web: não abrem aba nova nem dão acesso a
  // `window.opener`, então target/rel não teriam efeito algum. Retornam
  // "interno" para que o link saia limpo, sem atributos inúteis.
  if (scheme.startsWith('mailto:') || scheme.startsWith('tel:')) return true

  if (scheme.startsWith('http://') || scheme.startsWith('https://')) return isOwnHost(value)

  // Qualquer outro esquema (ftp:, javascript:, href quebrado) é tratado como externo.
  return false
}
