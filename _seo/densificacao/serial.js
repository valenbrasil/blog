export const meta = {
  name: 'densificar-lote',
  description: 'Densifica links externos: pesquisa, redige, verifica cada URL viva e refuta antes de aceitar',
  phases: [
    { title: 'Densificar', detail: 'um agente por artigo: pesquisa, redige e verifica cada URL' },
    { title: 'Refutar', detail: 'um cético por artigo tenta derrubar cada operação proposta' },
  ],
}

const SLUGS = args && args.length ? args : ['fotografia-imobiliaria']

const SEGMENTO = {
  type: 'object',
  properties: {
    t: { type: 'string', description: 'texto do trecho' },
    href: { type: 'string', description: 'URL, só quando este trecho é a âncora de um link' },
  },
  required: ['t'],
}

const PLANO = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    ancoras: {
      type: 'array',
      description: 'links sobre texto que JÁ existe, sem mudar uma letra',
      items: {
        type: 'object',
        properties: {
          chave: { type: 'string', description: 'chave do bloco, campo "chave" do JSON do artigo' },
          ancora: { type: 'string', description: 'trecho literal e único dentro do bloco' },
          href: { type: 'string' },
          sustentacao: { type: 'string', description: 'que frase da página de destino sustenta esta âncora' },
        },
        required: ['chave', 'ancora', 'href', 'sustentacao'],
      },
    },
    emendas: {
      type: 'array',
      description: 'frases acrescentadas ao FIM de um bloco existente',
      items: {
        type: 'object',
        properties: {
          chave: { type: 'string' },
          segmentos: { type: 'array', items: SEGMENTO },
          sustentacao: { type: 'string' },
        },
        required: ['chave', 'segmentos', 'sustentacao'],
      },
    },
    acrescimos: {
      type: 'array',
      description: 'blocos novos inseridos depois de um bloco existente',
      items: {
        type: 'object',
        properties: {
          depois_de: { type: 'string' },
          blocos: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                estilo: { type: 'string', description: 'normal, h2, h3' },
                lista: { type: 'boolean' },
                segmentos: { type: 'array', items: SEGMENTO },
              },
              required: ['estilo', 'segmentos'],
            },
          },
          sustentacao: { type: 'string' },
        },
        required: ['depois_de', 'blocos', 'sustentacao'],
      },
    },
    links_finais: { type: 'integer', description: 'quantos links externos o artigo terá depois disto' },
    urls_usadas: { type: 'array', items: { type: 'string' } },
    nao_alcancou: { type: 'string', description: 'se ficou abaixo de 10, por quê — vazio se alcançou' },
  },
  required: ['slug', 'ancoras', 'emendas', 'acrescimos', 'links_finais', 'urls_usadas', 'nao_alcancou'],
}

const VEREDITO = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    reprovadas: {
      type: 'array',
      description: 'operações que devem ser descartadas',
      items: {
        type: 'object',
        properties: {
          tipo: { type: 'string', description: 'ancora | emenda | acrescimo' },
          indice: { type: 'integer', description: 'posição no array correspondente, base 0' },
          motivo: { type: 'string' },
        },
        required: ['tipo', 'indice', 'motivo'],
      },
    },
    parecer: { type: 'string' },
  },
  required: ['slug', 'reprovadas', 'parecer'],
}

const REGRAS = `
O blog é o https://blog.valenbrasil.com, da Valen Brasil, sobre avaliação de
imóveis, direito imobiliário, imposto, investimento e arquitetura. Português do
Brasil.

FERRAMENTAS, use-as:
- O artigo está em /tmp/dens/artigos/<slug>.json — leia o arquivo inteiro. Cada
  bloco traz "chave" (é o que a aplicação usa), "estilo", "texto" e os links que
  já existem.
- Verificação de URL, OBRIGATÓRIA antes de propor qualquer link:
      python3 /tmp/dens/verificar.py "<url>" "termo que a página deve conter"
  Responde JSON com status, título e se cada termo aparece no texto da página.
  Só serve URL com "viva": true. O Planalto recusa o User-Agent do curl — use
  este script, não curl.

REGRAS QUE NÃO SE NEGOCIAM:
1. Nenhum fato entra sem fonte que você mesmo buscou e leu. Se você não
   conseguiu abrir a página, o fato não entra. Inventar número, artigo de lei,
   data ou precedente é o pior resultado possível — pior que ficar abaixo da
   meta.
2. Só operação aditiva. Você não reescreve nem apaga nada do autor. Ou põe link
   sobre texto que já existe (ancoras), ou acrescenta frases ao fim de um bloco
   (emendas), ou insere blocos novos (acrescimos).
3. A âncora tem de ser honesta: quem lê a âncora fora de contexto tem de saber
   aonde ela leva. "Lei 8.245/1991", "Código Tributário Nacional", "IBGE" são
   boas; "clique aqui", "saiba mais", "este site" não são.
4. Uma URL por artigo, no máximo. Nada de repetir o mesmo destino.
5. Fórmulas proibidas, nem no texto novo nem em lugar nenhum: "vale ressaltar",
   "é importante destacar", "é importante ressaltar", "em resumo", "em suma",
   "vamos explorar", "neste artigo vamos", "por fim, mas não menos importante",
   "não é apenas X, mas Y", e superlativo sem sustentação ("incrível",
   "revolucionário", "extraordinário") quando a própria frase não sustenta.
6. Escreva na voz do artigo: frase direta, sem locutor, sem tom de manual. Leia
   os blocos ao redor antes de escrever e case o registro.
7. Não prometa e não aconselhe em nome da empresa. Texto informativo.

O QUE FAZER, nesta ordem:
a) Leia o artigo inteiro e liste o que ele afirma de específico — norma, órgão,
   índice, número, data, prazo. Cada um desses é candidato a "ancora": o texto
   já está lá, só falta o link.
b) Liste o que o artigo afirma de VAGO — "a lei determina", "conforme a
   legislação", "os prazos legais", "estudos mostram", uma porcentagem sem
   fonte. Cada um desses é candidato a expansão: pesquise o dado real,
   verifique, e acrescente a frase que nomeia a norma, o artigo, o prazo ou o
   número, com o link. É aqui que a densificação acontece de verdade.
c) Onde faltar assunto, insira um bloco novo (um h3 e um ou dois parágrafos) que
   trate de algo que o artigo deveria cobrir e não cobre, sempre com fonte.
   Ponha o bloco onde ele faz sentido na leitura, não no fim por comodidade.
d) A meta é 10 a 20 links externos no artigo, contando os que já existem. Se o
   assunto não comportar 10 fontes de verdade, PARE onde a honestidade mandar e
   explique em "nao_alcancou" quantas você conseguiu e por quê. Link decorativo
   é falha, não meta cumprida.

FONTES QUE COSTUMAM SERVIR (confira cada uma antes):
Planalto (leis), Receita Federal, IBGE, Banco Central, CNJ, COFECI, CONFEA,
CAU/BR, IBAPE, ABNT, ONR/registrodeimoveis.org.br, INCRA, SUSEP, Procon,
ABECIP, CBIC, FGV/IBRE, SECOVI, prefeituras e diários oficiais, universidades,
museus e fundações para arquitetura, Pritzker Prize, UNESCO.
Evite blog concorrente, portal de notícia de segunda mão e agregador.
STJ e portalibre.fgv.br respondem 403/vazio pelo proxy — não use.
`

phase('Densificar')

/*
  Os artigos do lote correm em paralelo; dentro de cada artigo, o cetico so
  comeca quando o redator termina.

  A versao anterior usava um laco `for`, estritamente um agente por vez, por
  exigencia do autor. Ele liberou oito agentes, mantida a regra de um lote por
  vez -- entao o paralelismo entra aqui dentro, e nao em lotes simultaneos.

  pipeline() e nao parallel(): nao ha barreira entre as duas etapas, entao o
  cetico do primeiro artigo comeca assim que o redator dele acaba, sem esperar
  os outros redatores. Com barreira, o lote inteiro andaria no ritmo do artigo
  mais lento de cada etapa, duas vezes.

  ATENCAO ao teto: o workflow limita a min(16, CPUs - 2) agentes simultaneos
  POR CHAMADA, e esta maquina tem 4 CPUs -- ou seja, 2 por chamada. Os oito
  agentes so acontecem com quatro chamadas em paralelo, cada uma com 2 artigos.
  Passar 8 slugs para uma chamada so nao acelera: seis ficam na fila.
*/
const resultados = await pipeline(
  SLUGS,
  (slug) =>
    agent(
      `${REGRAS}\n\nARTIGO: ${slug}\nLeia /tmp/dens/artigos/${slug}.json e produza o plano de densificação.\n` +
        `Em "urls_usadas" liste toda URL que você propôs, e confirme que cada uma passou pelo verificador.`,
      { label: `densificar:${slug}`, phase: 'Densificar', schema: PLANO },
    ),
  (plano, slug) => {
    if (!plano) {
      log(`${slug}: sem plano, pulando`)
      return null
    }
    return agent(
      `${REGRAS}\n\nARTIGO: ${slug}\n\nUm redator propôs o plano abaixo. Sua tarefa é REFUTAR o que não se sustenta.\n\n` +
        `PLANO:\n${JSON.stringify(plano, null, 1)}\n\n` +
        `Confira, uma por uma:\n` +
        `- Toda URL: rode o verificador de novo. Se não estiver viva, reprove.\n` +
        `- Todo fato acrescentado: a página de destino sustenta MESMO aquela frase? Rode o verificador com um termo do fato. Número, artigo de lei, prazo e data inventados são o alvo principal desta revisão.\n` +
        `- Toda âncora de "ancoras": o trecho existe literalmente naquele bloco do JSON do artigo? Confira em /tmp/dens/artigos/${slug}.json.\n` +
        `- O texto novo está na voz do artigo, sem fórmula proibida, sem promessa em nome da empresa?\n` +
        `- Há URL repetida?\n` +
        `Na dúvida, reprove. Liste em "reprovadas" o tipo (ancora/emenda/acrescimo) e o índice base 0 dentro do array correspondente.`,
      { label: `refutar:${slug}`, phase: 'Refutar', schema: VEREDITO },
    ).then((veredito) => ({ plano, veredito }))
  },
)

const bons = resultados.filter(Boolean).filter((r) => r && r.plano)
log(`${bons.length} artigos processados`)

return bons.map(({ plano, veredito }) => {
  const rep = veredito?.reprovadas ?? []
  const fora = (tipo) => new Set(rep.filter((r) => r.tipo === tipo).map((r) => r.indice))
  const a = fora('ancora'), e = fora('emenda'), c = fora('acrescimo')
  return {
    slug: plano.slug,
    nao_alcancou: plano.nao_alcancou,
    parecer: veredito?.parecer ?? '(sem revisão)',
    reprovadas: rep,
    operacoes: [
      ...plano.ancoras.filter((_, i) => !a.has(i)).map((o) => ({ op: 'ancorar', ...o })),
      ...plano.emendas.filter((_, i) => !e.has(i)).map((o) => ({ op: 'emendar', ...o })),
      ...plano.acrescimos.filter((_, i) => !c.has(i)).map((o) => ({ op: 'acrescentar', ...o })),
    ],
  }
})
