export const meta = {
  name: 'linkagem-entrada',
  description: 'Regra 1: da a cada artigo orfao pelo menos 1 link interno de entrada, vindo de outro artigo, com contexto',
  phases: [
    { title: 'Propor', detail: 'um agente por orfao: acha origem honesta em qualquer lugar do blog' },
    { title: 'Refutar', detail: 'um cetico por orfao confere ancora, destino e colocacao' },
  ],
}

const ORFAOS = args && args.length ? args : []

const SEGMENTO = {
  type: 'object',
  properties: {
    t: { type: 'string', description: 'texto do trecho' },
    href: { type: 'string', description: 'caminho relativo, só quando este trecho é a âncora' },
  },
  required: ['t'],
}

const BLOCO_NOVO = {
  type: 'object',
  properties: {
    estilo: { type: 'string', description: 'normal, na quase totalidade dos casos' },
    segmentos: { type: 'array', items: SEGMENTO, description: 'o parágrafo inteiro, do zero — não é anexo a nada existente' },
  },
  required: ['segmentos'],
}

const PLANO = {
  type: 'object',
  properties: {
    orfao: { type: 'string' },
    resolvido: { type: 'boolean', description: 'true só se achou origem honesta' },
    fonte: { type: 'string', description: 'slug do artigo de origem (onde o link vai morar), só quando resolvido' },
    operacao: {
      type: 'object',
      description: 'só quando resolvido',
      properties: {
        op: { type: 'string', enum: ['ancorar', 'emendar', 'acrescentar'] },
        chave: { type: 'string', description: 'chave do bloco, copiada do JSON do artigo fonte (ancorar/emendar)' },
        ancora: { type: 'string', description: 'só para ancorar: trecho literal e único no bloco' },
        href: { type: 'string', description: 'só para ancorar: caminho relativo /slug-do-orfao/' },
        segmentos: {
          type: 'array',
          items: SEGMENTO,
          description: 'só para emendar: SOMENTE o texto novo, ANEXADO ao fim do bloco. Não repita nada do que já está lá.',
        },
        depois_de: { type: 'string', description: 'só para acrescentar: chave do bloco existente depois do qual o parágrafo novo entra' },
        blocos: { type: 'array', items: BLOCO_NOVO, description: 'só para acrescentar: um ou mais parágrafos novos, inseridos como blocos próprios' },
      },
      required: ['op'],
    },
    sustentacao: { type: 'string', description: 'frase do artigo ÓRFÃO (o destino) que mostra que ele trata mesmo deste assunto' },
    justificativa: { type: 'string' },
    nao_resolvido_motivo: { type: 'string', description: 'vazio se resolvido; senão, o que foi tentado e por que não fechou' },
  },
  required: ['orfao', 'resolvido', 'justificativa'],
}

const VEREDITO = {
  type: 'object',
  properties: {
    orfao: { type: 'string' },
    reprovado: { type: 'boolean' },
    motivo: { type: 'string' },
  },
  required: ['orfao', 'reprovado', 'motivo'],
}

const REGRAS = `
O blog é o https://blog.valenbrasil.com, da Valen Brasil, sobre avaliação de
imóveis, direito imobiliário, imposto, investimento e arquitetura. Português do
Brasil.

O TRABALHO: Regra 1 da linkagem interna — ENTRADA. Um artigo do blog ("o
órfão") não recebe hoje NENHUM link interno de nenhum outro artigo. Sua tarefa
é achar, em QUALQUER outro artigo do blog, uma frase que já fala do assunto do
órfão (ou onde uma frase nova, informativa, caiba com naturalidade) e criar
ali um link para o órfão.

Isto é diferente da Regra 2 (que você talvez já tenha trabalhado antes): aqui
não há "zona alvo" nem topo do texto. O link pode entrar em qualquer bloco de
texto corrido de qualquer artigo do blog, contanto que a âncora seja honesta.

O PRINCÍPIO QUE GOVERNA TUDO: **o link se descobre, não se inventa.** Você
parte do órfão e pergunta: existe, em algum outro artigo do blog, uma frase
que já fala deste assunto? Se existe, o link nasce dela. Se não existe
nenhuma frase, avalie se um artigo AFIM comportaria uma frase nova, verdadeira
e informativa, que introduza o assunto — nunca uma frase que existe só como
pretexto para o link.

FERRAMENTAS, use-as:
- O dossiê deste órfão, com candidatos de âncora literal (se houver) ou
  artigos afins por assunto (se não houver nenhum candidato literal):
      python3 /home/user/blog/_seo/linkagem-interna/orfaos.py --dossie <slug-do-orfao>
- O artigo ÓRFÃO inteiro (você precisa confirmar do que ele trata de verdade):
      /tmp/dens/artigos/<slug-do-orfao>.json
- O artigo FONTE que você escolher, com todos os blocos e links que já existem:
      /tmp/dens/artigos/<fonte>.json

REGRAS QUE NÃO SE NEGOCIAM:
1. A ÂNCORA EXISTE LITERALMENTE (para "ancorar"). O trecho tem de estar
   naquele bloco do artigo FONTE, palavra por palavra, e ser único ali. Chave
   do bloco copiada do JSON, nunca escrita de memória.
2. A ÂNCORA NOMEIA O ÓRFÃO. Quem lê a âncora fora de contexto sabe aonde vai.
   Proibido: "clique aqui", "saiba mais", "neste artigo", "veja também", "esse
   processo". Âncora boa: "retrofit", "consórcio", "usucapião", "ITBI".
3. NUNCA um bloco de lista ("estilo" bullet, "leia também", navegação). Link
   de entrada tem de estar no CORPO do texto, com contexto ao redor — é
   literalmente a Regra 1, não um detalhe de implementação.
4. O ÓRFÃO É SOBRE AQUILO. Leia /tmp/dens/artigos/<slug-do-orfao>.json antes
   de apontar para ele. Cite em "sustentacao" a frase do órfão que mostra que
   ele trata do assunto que a âncora promete.
5. A ÂNCORA NÃO CAI SOBRE LINK EXISTENTE.
6. ORDEM DE PREFERÊNCIA: "ancorar" > "acrescentar" > "emendar".

   "ancorar" — a frase já existe, só recebe o link. É o caminho mais seguro,
   use sempre que houver âncora literal honesta.

   "acrescentar" — insere um PARÁGRAFO NOVO, inteiro, em qualquer ponto do
   artigo (depois de qualquer bloco existente, à sua escolha — "em qualquer
   posição do artigo"). Diferente de "emendar", não precisa encaixar no fim
   de uma frase alheia nem depender de anáfora: é um parágrafo autônomo, com
   começo, meio e fim próprios. Isso resolve o defeito mais comum desta
   ferramenta até aqui — frase emendada que discorda do que vem logo antes
   dela no mesmo bloco, ou que depende de um "esse"/"essa" sem antecedente.
   Ainda assim tem de ser informação VERDADEIRA e RELEVANTE onde entra — um
   parágrafo novo encostado num lugar aleatório do artigo só para caber o
   link continua sendo pretexto, e pretexto se reprova. O lugar certo é
   aquele em que, se o autor tivesse escrito sobre o assunto do órfão, teria
   escrito ali — geralmente como continuação natural do raciocínio do bloco
   anterior, ou como parágrafo novo numa seção cujo tema comporta o assunto.
   "depois_de" é a chave do bloco que vem ANTES do parágrafo novo (pode ser
   qualquer bloco do artigo, não só o último). "blocos" é a lista de
   parágrafos a inserir — quase sempre um só.

   "emendar" — só quando não houver âncora literal E o parágrafo novo de
   "acrescentar" não tiver lugar natural, mas existir um bloco cujo FIM real
   comporta uma frase adicional que continua o raciocínio dele. O aplicador
   **ANEXA** seus segmentos ao FIM do bloco. Ele não substitui o bloco. Então
   "segmentos" tem de trazer **só o texto novo**. Se você devolver o parágrafo
   inteiro com a frase nova no meio, o resultado publicado é o parágrafo DUAS
   vezes.

     bloco atual:  "...o proprietário pode buscar indenização."
     ERRADO:       [{t:"...o proprietário pode buscar indenização, valor
                      apurado a partir do "}, {t:"laudo", href:"/laudo/"} ...]
     CERTO:        [{t:"O valor é apurado em juízo a partir do "},
                    {t:"laudo de avaliação do imóvel", href:"/laudo-de-avaliacao-do-imovel/"},
                    {t:", documento técnico que fixa o valor de mercado."}]

   Como a emenda entra no fim do bloco, ela tem de fazer sentido ali: frase
   inteira, começando com maiúscula, sem anáfora cujo antecedente esteja em
   outro bloco. E como o texto do autor fica intocado, ela não pode
   contradizê-lo nem inventar fato que não é verdade sobre o assunto do órfão.

   Em qualquer um dos três, a informação nova (se houver) tem de ser
   VERIFICÁVEL a partir do que o órfão já diz sobre si mesmo — nunca um fato
   plausível mas não conferido (já aconteceu: "o vistoriador assina o
   documento" — plausível, mas nenhuma fonte dizia isso).
7. UM SÓ LINK, para o órfão desta tarefa, num só artigo fonte.
8. Se nenhuma origem honesta existir — nem âncora literal, nem lugar natural
   para frase nova verdadeira — "resolvido: false" e diga o motivo. Ficar sem
   link é resultado aceitável; link forçado ensina ao Google que este site
   fabrica links, e é pior que o artigo continuar órfão.
9. Sem fórmula batida ("vale ressaltar", "é importante destacar", "em
   resumo"), sem superlativo sem lastro, sem promessa em nome da empresa.
`

phase('Propor')

/*
  Cada orfao roda em paralelo; dentro de cada um o cetico so comeca quando o
  propositor termina. pipeline(), sem barreira entre etapas.

  Teto: min(16, CPUs - 2) agentes simultaneos POR CHAMADA, maquina de 4 CPUs
  -- 2 por chamada. Dezesseis agentes exigem oito chamadas em paralelo, cada
  uma com 2 slugs.
*/
const resultados = await pipeline(
  ORFAOS,
  (orfao) =>
    agent(
      `${REGRAS}\n\nÓRFÃO: ${orfao}\n\n` +
        `Comece rodando o dossiê:\n` +
        `    python3 /home/user/blog/_seo/linkagem-interna/orfaos.py --dossie ${orfao}\n\n` +
        `Depois leia /tmp/dens/artigos/${orfao}.json para confirmar do que ele trata. ` +
        `Escolha UM artigo fonte, leia o JSON dele inteiro, e produza o plano.`,
      { label: `propor:${orfao}`, phase: 'Propor', schema: PLANO },
    ),
  (plano, orfao) => {
    if (!plano) {
      log(`${orfao}: sem plano, pulando`)
      return null
    }
    if (!plano.resolvido) {
      return Promise.resolve({ orfao, reprovado: false, motivo: 'nao resolvido pelo proponente' })
        .then((v) => ({ plano, veredito: v }))
    }
    return agent(
      `${REGRAS}\n\nÓRFÃO: ${orfao}\n\n` +
        `Um agente propôs o plano abaixo para dar a este órfão seu primeiro link de entrada. ` +
        `Sua tarefa é REFUTAR o que não se sustenta.\n\n` +
        `PLANO:\n${JSON.stringify(plano, null, 1)}\n\n` +
        `Rode o dossiê você mesmo:\n` +
        `    python3 /home/user/blog/_seo/linkagem-interna/orfaos.py --dossie ${orfao}\n\n` +
        `Leia /tmp/dens/artigos/${plano.fonte || ''}.json (o artigo fonte, se houver) e ` +
        `/tmp/dens/artigos/${orfao}.json (o órfão).\n\n` +
        `Confira, uma por uma:\n` +
        `- A chave do bloco existe de fato no JSON do artigo fonte?\n` +
        `- O bloco é de lista ("leia também", navegação)? REPROVE — Regra 1 exige contexto no corpo do texto.\n` +
        `- A âncora existe literalmente naquele bloco, e uma vez só? (só para "ancorar")\n` +
        `- A âncora nomeia o órfão, ou é genérica a ponto de poder levar a qualquer coisa?\n` +
        `- O órfão TRATA mesmo do assunto que a âncora promete? Leia o JSON dele — "sustentacao" tem de ser uma frase real de lá.\n` +
        `- A âncora cai sobre trecho que já é link?\n` +
        `- Se houver "emendar": os segmentos trazem SÓ texto novo? O aplicador ANEXA ao fim do bloco — se repetirem qualquer frase que já está lá, o parágrafo sai publicado duas vezes. REPROVE se houver repetição.\n` +
        `- Ainda em "emendar": a frase nova se sustenta como informação verdadeira, ou é pretexto puro para o link? Contradiz o autor? Começa com anáfora sem antecedente no bloco?\n` +
        `- Se houver "acrescentar": a chave em "depois_de" existe de fato no JSON do artigo fonte? O parágrafo novo faz sentido como continuação do raciocínio do bloco anterior (ou da seção em que entra) — ou foi encostado num lugar aleatório só para caber o link? Ele tem começo/meio/fim próprios, sem depender de anáfora de outro bloco? A informação nele é verificável a partir do que o próprio órfão diz sobre si mesmo (confira "sustentacao" contra o JSON do órfão), não um fato plausível mas não conferido?\n` +
        `Na dúvida, REPROVE (reprovado: true). Ficar sem link é resultado aceitável; link forçado não é.`,
      { label: `refutar:${orfao}`, phase: 'Refutar', schema: VEREDITO },
    ).then((veredito) => ({ plano, veredito }))
  },
)

const bons = resultados.filter(Boolean).filter((r) => r && r.plano)
log(`${bons.length} orfaos processados`)

return bons.map(({ plano, veredito }) => ({
  orfao: plano.orfao,
  resolvido: plano.resolvido && !(veredito && veredito.reprovado),
  fonte: plano.fonte ?? null,
  operacao: plano.operacao ?? null,
  justificativa: plano.justificativa,
  nao_resolvido_motivo: plano.nao_resolvido_motivo ?? '',
  reprovado_motivo: veredito && veredito.reprovado ? veredito.motivo : '',
}))
