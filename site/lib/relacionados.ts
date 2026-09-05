import type { PostSummary } from './types'

/*
  Escolha dos artigos do bloco "Leia também".

  A versão anterior pedia ao Sanity os três mais recentes da mesma categoria.
  Funciona como interface e falha como arquitetura de links: como a ordem é por
  data, todo artigo de uma categoria recebe exatamente os mesmos três vizinhos.
  Medido no acervo antes da troca:

      618 links saíam desses blocos
       20 artigos distintos os recebiam
      186 dos 206 artigos não apareciam em lugar nenhum
       67 páginas apontavam para um mesmo artigo

  O Google enuncia uma única regra numérica sobre link interno — "every page you
  care about should have a link from at least one other page on your site" — e
  era justamente essa que o blog não cumpria.

  Aqui o grafo é montado de uma vez, para o acervo inteiro, por dois motivos que
  a consulta por página não conseguia atender:

  1. **Relevância no lugar de recência.** O vizinho é escolhido por assunto
     compartilhado, não por data de publicação.

  2. **Cobertura como garantia, não como consequência.** "Todo artigo recebe ao
     menos um link" é uma propriedade do grafo inteiro. Só dá para assegurá-la
     olhando todas as páginas juntas; nenhuma consulta que enxerga uma página
     por vez consegue prometer isso.

  Determinismo importa: o site é `output: 'export'`, reconstruído a cada deploy.
  Duas execuções sobre os mesmos dados têm de produzir o mesmo grafo, senão os
  vizinhos de cada artigo mudam sozinhos a cada build. Daí não haver nada de
  aleatório aqui e todo empate ser desempatado por slug.
*/

/** Quantos vizinhos o bloco mostra. O PostGrid do artigo comporta três. */
export const VIZINHOS = 3

/*
  Palavras que aparecem em quase todo título do acervo e por isso não dizem nada
  sobre parentesco entre dois artigos. Sem esta lista, "guia completo sobre
  imóveis" casaria com qualquer coisa.
*/
const VAZIAS = new Set([
  'para','como','pelo','pela','dos','das','com','sem','por','que','uma','uns','umas',
  'seu','sua','seus','suas','este','esta','isso','isto','ser','ter','mais','menos',
  'sobre','entre','ate','apos','antes','desde','cada','todo','toda','todos','todas',
  'outro','outra','outros','outras','muito','pouco','grande','pequeno','melhor',
  'guia','completo','completa','tudo','saiba','entenda','conheca','descubra','veja',
  'passo','dicas','principais','importante','importantes','voce','quais','qual',
  'onde','quando','porque','porque','sao','nao','dele','dela','deles','delas',
])

function tokens(texto: string | undefined): Set<string> {
  if (!texto) return new Set()
  const limpo = texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
  const out = new Set<string>()
  for (const t of limpo.split(' ')) {
    if (t.length >= 4 && !VAZIAS.has(t)) out.add(t)
  }
  return out
}

interface Perfil {
  slug: string
  categorias: Set<string>
  titulo: Set<string>
  resumo: Set<string>
}

function perfilar(post: PostSummary): Perfil {
  return {
    slug: post.slug,
    categorias: new Set((post.categories ?? []).map((c) => c.slug)),
    titulo: tokens(post.title),
    resumo: tokens(post.excerpt),
  }
}

function interseccao(a: Set<string>, b: Set<string>): number {
  let n = 0
  for (const x of a) if (b.has(x)) n++
  return n
}

/*
  Quanto `candidato` interessa a quem está lendo `origem`.

  Categoria pesa mais que palavra solta porque é classificação editorial, feita
  por uma pessoa. Palavra de título vale o dobro de palavra de resumo: o título
  declara o assunto, o resumo o contorna.
*/
function afinidade(origem: Perfil, candidato: Perfil): number {
  return (
    5 * interseccao(origem.categorias, candidato.categorias) +
    2 * interseccao(origem.titulo, candidato.titulo) +
    1 * interseccao(origem.resumo, candidato.titulo) +
    1 * interseccao(origem.titulo, candidato.resumo)
  )
}

/**
 * Monta o grafo inteiro de "Leia também": slug de origem → slugs vizinhos.
 *
 * Garante que todo artigo com pelo menos um par no acervo apareça como vizinho
 * de alguém. Determinístico: mesma entrada, mesmo grafo.
 */
export function montarGrafo(posts: PostSummary[]): Map<string, string[]> {
  /*
    Ordem de processamento fixa e independente de data. Se fosse por
    publishedAt, publicar um artigo novo reembaralharia o grafo todo.
  */
  const ordenados = [...posts].sort((a, b) => a.slug.localeCompare(b.slug))
  const perfis = new Map(ordenados.map((p) => [p.slug, perfilar(p)]))
  const entrada = new Map(ordenados.map((p) => [p.slug, 0]))
  const grafo = new Map<string, string[]>()

  /*
    Penalidade por link já recebido. É o que impede a concentração que o modelo
    antigo produzia: sem ela, o artigo mais "central" de cada categoria viraria
    vizinho de todo mundo outra vez. O valor é menor que o peso de uma categoria
    compartilhada, então afinidade real ainda vence — a penalidade só desempata
    entre candidatos parecidos.
  */
  const PENALIDADE = 3

  for (const post of ordenados) {
    const origem = perfis.get(post.slug)!
    const escolhidos = ordenados
      .filter((c) => c.slug !== post.slug)
      .map((c) => {
        const cand = perfis.get(c.slug)!
        return {
          slug: c.slug,
          nota: afinidade(origem, cand) - PENALIDADE * entrada.get(c.slug)!,
        }
      })
      .sort((a, b) => b.nota - a.nota || a.slug.localeCompare(b.slug))
      .slice(0, VIZINHOS)

    grafo.set(post.slug, escolhidos.map((e) => e.slug))
    for (const e of escolhidos) entrada.set(e.slug, entrada.get(e.slug)! + 1)
  }

  /*
    Passada de reparo. A escolha gulosa acima já espalha muito, mas não é uma
    prova: um artigo sem nenhuma palavra em comum com o resto pode não ser
    escolhido por ninguém. Aqui a cobertura deixa de ser tendência e vira
    garantia.

    Para cada órfão, procura-se o melhor anfitrião possível e troca-se o vizinho
    de menor afinidade dele — mas só se esse vizinho sobrevive em outro lugar.
    Sem essa condição a troca resolveria um órfão criando outro.
  */
  const orfaos = ordenados
    .map((p) => p.slug)
    .filter((s) => entrada.get(s) === 0)

  for (const orfao of orfaos) {
    const perfilOrfao = perfis.get(orfao)!
    const anfitrioes = ordenados
      .map((p) => p.slug)
      .filter((s) => s !== orfao && !grafo.get(s)!.includes(orfao))
      .sort((a, b) => {
        const na = afinidade(perfis.get(a)!, perfilOrfao)
        const nb = afinidade(perfis.get(b)!, perfilOrfao)
        return nb - na || a.localeCompare(b)
      })

    let alocado = false
    for (const anfitriao of anfitrioes) {
      const atuais = grafo.get(anfitriao)!
      const perfilAnfitriao = perfis.get(anfitriao)!
      const descartavel = [...atuais]
        .sort((a, b) => {
          const na = afinidade(perfilAnfitriao, perfis.get(a)!)
          const nb = afinidade(perfilAnfitriao, perfis.get(b)!)
          return na - nb || a.localeCompare(b)
        })
        .find((v) => entrada.get(v)! > 1)

      if (!descartavel) continue

      grafo.set(
        anfitriao,
        atuais.map((v) => (v === descartavel ? orfao : v)),
      )
      entrada.set(descartavel, entrada.get(descartavel)! - 1)
      entrada.set(orfao, 1)
      alocado = true
      break
    }

    /*
      Último recurso: nenhum anfitrião tinha vizinho dispensável. Em vez de
      deixar o artigo órfão, o melhor anfitrião ganha um quarto vizinho. O
      PostGrid acomoda — é grade, não linha fixa.
    */
    if (!alocado && anfitrioes.length > 0) {
      const anfitriao = anfitrioes[0]
      grafo.set(anfitriao, [...grafo.get(anfitriao)!, orfao])
      entrada.set(orfao, 1)
    }
  }

  return grafo
}
