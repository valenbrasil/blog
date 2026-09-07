export const meta = {
  name: 'linkagem-interna',
  description: 'Poe o primeiro link interno no topo do artigo: propoe, e um cetico tenta derrubar antes de gravar',
  phases: [
    { title: 'Propor', detail: 'um agente por artigo: acha a ancora honesta na zona alvo' },
    { title: 'Refutar', detail: 'um cetico por artigo confere ancora, destino e colocacao' },
  ],
}

const SLUGS = args && args.length ? args : []

const SEGMENTO = {
  type: 'object',
  properties: {
    t: { type: 'string', description: 'texto do trecho' },
    href: { type: 'string', description: 'caminho relativo, só quando este trecho é a âncora' },
  },
  required: ['t'],
}

const PLANO = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    caminho: {
      type: 'string',
      enum: ['criar', 'excluir', 'nenhum'],
      description: 'criar = link novo na zona alvo; excluir = apagar os links que vêm antes do interno já existente; nenhum = não há saída honesta',
    },
    operacoes: {
      type: 'array',
      description: 'apenas para caminho "criar"',
      items: {
        type: 'object',
        properties: {
          op: { type: 'string', enum: ['ancorar', 'emendar'] },
          chave: { type: 'string', description: 'chave do bloco, copiada do dossiê' },
          ancora: { type: 'string', description: 'só para ancorar: trecho literal e único no bloco' },
          href: { type: 'string', description: 'só para ancorar: caminho relativo /slug-do-destino/' },
          segmentos: { type: 'array', items: SEGMENTO, description: 'só para emendar' },
          destino: { type: 'string', description: 'slug do artigo de destino' },
          sustentacao: { type: 'string', description: 'que frase do artigo de destino mostra que ele trata deste assunto' },
        },
        required: ['op', 'chave', 'destino', 'sustentacao'],
      },
    },
    exclusoes: {
      type: 'array',
      description: 'apenas para caminho "excluir": os links a apagar, na ordem em que aparecem',
      items: {
        type: 'object',
        properties: {
          chave: { type: 'string' },
          href: { type: 'string' },
          ancora: { type: 'string' },
          motivo: { type: 'string', description: 'por que este link pode sair sem prejuízo do texto' },
        },
        required: ['chave', 'href', 'motivo'],
      },
    },
    justificativa: { type: 'string', description: 'por que este caminho e não os outros' },
    nao_alcancou: { type: 'string', description: 'vazio se resolveu; senão, o motivo' },
  },
  required: ['slug', 'caminho', 'justificativa'],
}

const VEREDITO = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    reprovadas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tipo: { type: 'string', enum: ['operacao', 'exclusao'] },
          indice: { type: 'number', description: 'índice base 0 no array correspondente' },
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

O TRABALHO: linkagem interna, de artigo do blog para artigo do blog. Três regras
do autor governam tudo:

  REGRA 1  Todo artigo recebe pelo menos 1 link interno, COM CONTEXTO: no corpo
           do texto, sobre âncora que fala do assunto do destino. Nunca em bloco
           de "leia também", nunca em âncora genérica.
  REGRA 2  Em todo artigo, o PRIMEIRO link do texto é interno, para outro artigo
           do blog. Antes de qualquer link externo vem um interno.
  REGRA 3  Havendo outros links externos na página, pode-se apagar até 5 por
           página. É permissão, não meta: quem resolve criando não gasta nada.

FERRAMENTAS, use-as:
- O dossiê deste artigo, que traz a ZONA ALVO com as chaves dos blocos, o custo
  do caminho da exclusão e os destinos plausíveis:
      python3 /home/user/blog/_seo/linkagem-interna/candidatos.py --dossie <slug>
- O artigo inteiro, com todos os blocos e os links que já existem:
      /tmp/dens/artigos/<slug>.json
- O artigo de DESTINO, que você TEM de ler antes de apontar para ele:
      /tmp/dens/artigos/<destino>.json

O PRINCÍPIO QUE GOVERNA TUDO: **o link se descobre, não se inventa.** Você não
abre o artigo procurando onde enfiar um link. Você lê a zona alvo e pergunta:
sobre o que este texto já está falando? Existe no blog um artigo que é
exatamente sobre isso? Se existe, o link nasce dessa frase. Se não existe, não
há link — e dizer isso é resultado, não fracasso.

REGRAS QUE NÃO SE NEGOCIAM:
1. A ÂNCORA ESTÁ NA ZONA ALVO. O link novo só cumpre a Regra 2 se vier ANTES do
   primeiro link não interno. Âncora fora da zona não serve para nada.
2. A ÂNCORA EXISTE LITERALMENTE. O trecho tem de estar naquele bloco, palavra
   por palavra, e ser único ali. Chave do bloco copiada do dossiê, nunca escrita
   de memória. Se você escrever uma chave que não existe, o aplicador barra.
3. A ÂNCORA NOMEIA O DESTINO. Quem lê a âncora fora de contexto sabe aonde vai.
   Proibido: "clique aqui", "saiba mais", "neste artigo", "veja também", "esse
   processo", "essa questão". Âncora boa: "compra e venda", "escritura pública",
   "certidão de matrícula", "método evolutivo", "ITBI".
4. O DESTINO É SOBRE AQUILO. Não basta o destino mencionar o termo — ele tem de
   TRATAR do assunto. Leia o artigo de destino e cite, em "sustentacao", a frase
   dele que mostra isso. Sem ler o destino, não proponha.
5. A ÂNCORA NÃO CAI SOBRE LINK EXISTENTE. Link dentro de link não existe em
   HTML. O dossiê já descarta esses trechos, mas confira no JSON do artigo.
6. NUNCA para o próprio artigo, e um só link por destino.
7. PREFIRA "ancorar". Um link interno que exige frase nova é suspeito: se o
   artigo não falava do assunto, provavelmente não é origem legítima. Use
   "emendar" só quando a frase nova se sustentar sozinha, como informação que o
   leitor ganha — nunca como pretexto para o link.
8. PREFIRA DESTINO ÓRFÃO. O dossiê marca quem recebe zero. Apontar para um órfão
   resolve a Regra 1 dele de graça. Mas relevância vem primeiro: órfão forçado é
   pior que não-órfão honesto.
9. Sem fórmula batida ("vale ressaltar", "é importante destacar", "em resumo",
   "em suma", "neste artigo vamos"), sem superlativo sem lastro, sem promessa ou
   conselho em nome da empresa.

OS TRÊS CAMINHOS, nesta ordem de preferência:

  "criar"   — achou âncora honesta na zona alvo. É o caminho preferido: aditivo,
              não custa nenhum link externo, e se o destino for órfão resolve as
              duas regras de uma vez.

  "excluir" — NÃO achou âncora honesta na zona, o artigo já tem link interno mais
              abaixo, e o dossiê diz que a exclusão está disponível. Então liste
              os links a apagar. Só vale se o dossiê NÃO disser "indisponível".
              Para cada link, diga em "motivo" por que ele pode sair: link
              decorativo, fonte de segunda mão, domínio já linkado em outro
              ponto. **Nunca proponha apagar a fonte que sustenta a afirmação de
              abertura do artigo** — se o primeiro link é a lei que dá nome ao
              assunto, ele fica.

  "nenhum"  — nem uma coisa nem outra. Diga em "nao_alcancou" o que você tentou
              e por que não fecha. Link forçado é pior que artigo sem link: o
              artigo sem link não é encontrado; o link forçado ensina ao Google
              que este site fabrica links.
`

phase('Propor')

/*
  Os artigos correm em paralelo; dentro de cada artigo o cetico so comeca quando
  o propositor termina. pipeline() e nao parallel(): sem barreira entre etapas,
  o cetico do primeiro artigo comeca assim que o proponente dele acaba.

  ATENCAO ao teto: min(16, CPUs - 2) agentes simultaneos POR CHAMADA, e esta
  maquina tem 4 CPUs -- 2 por chamada. Dezesseis agentes exigem oito chamadas em
  paralelo, cada uma com 2 slugs.
*/
const resultados = await pipeline(
  SLUGS,
  (slug) =>
    agent(
      `${REGRAS}\n\nARTIGO: ${slug}\n\n` +
        `Comece rodando o dossiê:\n` +
        `    python3 /home/user/blog/_seo/linkagem-interna/candidatos.py --dossie ${slug}\n\n` +
        `Depois leia /tmp/dens/artigos/${slug}.json para ver os blocos e os links que já existem, ` +
        `e leia o JSON de cada destino que você considerar. Produza o plano.`,
      { label: `propor:${slug}`, phase: 'Propor', schema: PLANO },
    ),
  (plano, slug) => {
    if (!plano) {
      log(`${slug}: sem plano, pulando`)
      return null
    }
    return agent(
      `${REGRAS}\n\nARTIGO: ${slug}\n\n` +
        `Um agente propôs o plano abaixo. Sua tarefa é REFUTAR o que não se sustenta.\n\n` +
        `PLANO:\n${JSON.stringify(plano, null, 1)}\n\n` +
        `Rode o dossiê você mesmo — não confie no que o plano diz que ele disse:\n` +
        `    python3 /home/user/blog/_seo/linkagem-interna/candidatos.py --dossie ${slug}\n\n` +
        `Confira, uma por uma:\n` +
        `- A chave do bloco existe em /tmp/dens/artigos/${slug}.json?\n` +
        `- O bloco está DENTRO da zona alvo? Âncora depois do primeiro link não interno não cumpre a Regra 2 — reprove.\n` +
        `- A âncora existe literalmente naquele bloco, e uma vez só?\n` +
        `- A âncora nomeia o destino, ou é genérica a ponto de poder levar a qualquer coisa?\n` +
        `- O artigo de destino TRATA mesmo do assunto? Leia /tmp/dens/artigos/<destino>.json. Mencionar de passagem não basta.\n` +
        `- A âncora cai sobre trecho que já é link?\n` +
        `- Se houver "emendar": a frase nova se sustenta como informação, ou é pretexto para o link? Contradiz o autor? Começa com anáfora sem antecedente ("esse prazo", "essa regra") no bloco?\n` +
        `- Se o caminho for "excluir": o dossiê autoriza (custo <= 5 e sem derrubar abaixo de 10 externos)? E o link que sai não é a fonte que sustenta a abertura do artigo?\n` +
        `Na dúvida, REPROVE. Ficar sem link é resultado aceitável; link forçado não é.\n` +
        `Liste em "reprovadas" o tipo ("operacao" ou "exclusao") e o índice base 0 no array correspondente.`,
      { label: `refutar:${slug}`, phase: 'Refutar', schema: VEREDITO },
    ).then((veredito) => ({ plano, veredito }))
  },
)

const bons = resultados.filter(Boolean).filter((r) => r && r.plano)
log(`${bons.length} artigos processados`)

return bons.map(({ plano, veredito }) => {
  const rep = veredito?.reprovadas ?? []
  const fora = (tipo) => new Set(rep.filter((r) => r.tipo === tipo).map((r) => r.indice))
  const foraOp = fora('operacao')
  const foraEx = fora('exclusao')
  return {
    slug: plano.slug,
    caminho: plano.caminho,
    justificativa: plano.justificativa,
    nao_alcancou: plano.nao_alcancou ?? '',
    operacoes: (plano.operacoes ?? []).filter((_, i) => !foraOp.has(i)),
    exclusoes: (plano.exclusoes ?? []).filter((_, i) => !foraEx.has(i)),
    reprovadas: rep,
    parecer: veredito?.parecer ?? '',
  }
})
