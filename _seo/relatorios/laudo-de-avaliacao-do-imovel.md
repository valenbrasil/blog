# Avaliação de Imóveis: a relevância do Laudo de Avaliação

Documento: `post` no Sanity · slug `laudo-de-avaliacao-do-imovel` (intocado)
URL: <https://blog.valenbrasil.com/laudo-de-avaliacao-do-imovel/>
Palavra-chave principal: **laudo de avaliação de imóvel** (inferida do título, H1, slug e corpo)
Intenção de busca: informacional com forte intenção comercial — quem busca isto costuma precisar contratar
Palavras: 2.435 → **2.984** (+549)

Primeiro artigo densificado. Escolhido por ser a página de maior intenção
comercial do acervo para uma empresa de avaliação.

## Conformidade obrigatória

```
URLs alteradas ............... 0
Links externos ............... 4 → 11        (meta: 10 a 20)  ✓ dentro da faixa
URLs duplicadas .............. 2 → 0                          ✓
Links externos sem rel ....... 0                              ✓
Blocos originais preservados . 89 / 89                        ✓
Saltos de hierarquia H2→H4 ... 0                              ✓
markDefs órfãos .............. 0                              ✓
Chaves de span duplicadas .... 0                              ✓
```

Nenhum trecho do texto original foi alterado ou removido: os 89 blocos que
existiam continuam idênticos, e os 16 novos foram inseridos entre eles.

## O que faltava, e por quê

O artigo estava correto, mas genérico. Citava a NBR 14653 sem dizer o que ela
exige; afirmava que "engenheiros e arquitetos" podem assinar sem apontar a base
legal; e **não mencionava ART nem RRT em ponto algum** — o registro sem o qual
ninguém responde tecnicamente pelo documento.

Era o caso clássico descrito em `lacuna-de-fontes.md`: não havia onde ancorar
fonte porque o texto não afirmava nada específico o bastante para precisar de
uma. Com a expansão, a densidade de fonte veio junto.

## O que foi acrescentado

**H3 "A base legal de quem assina o laudo"** (2 blocos)
- Lei 5.194/1966, art. 7º, "c" — avaliações, vistorias e perícias são atribuição
  legal, não serviço acessório
- Lei 12.378/2010 — organização da profissão de arquiteto sob o CAU
- Lei 6.530/1978, art. 3º — o corretor "pode opinar quanto à comercialização
  imobiliária". É essa a distinção que sustenta a diferença entre parecer e
  laudo, que o artigo antes afirmava sem fundamentar.

**H3 "ART e RRT: o registro sem o qual ninguém responde pelo laudo"** (3 blocos)
- Lei 6.496/1977, art. 1º, citada literalmente
- Lei 12.378/2010, art. 45 — RRT
- Consequência prática: banco, juízo e a outra parte costumam recusar laudo sem
  o registro

**H2 "O que o Código de Processo Civil exige de um laudo usado em processo"** (11 blocos)
- Art. 156 — perito nomeado entre habilitados **inscritos em cadastro do
  tribunal**; ser engenheiro não basta
- Art. 473, incisos I a IV, em lista
- §1º (linguagem simples, coerência lógica) e §2º (vedado ultrapassar a
  designação)
- Fecho conectando o inciso III à NBR 14653: exigir método reconhecido pela área
  transforma a conformidade com a norma em requisito processual

## Verificação das fontes

Cada norma citada foi lida no texto oficial do Planalto antes de entrar no
artigo — não de memória. O `curl` com user-agent de navegador funciona onde o
WebFetch recebe 503.

| Norma | O que foi conferido |
|---|---|
| Lei 6.496/1977 | art. 1º, texto literal |
| Lei 12.378/2010 | art. 45, texto literal |
| Lei 5.194/1966 | art. 7º, alínea "c", lista de atribuições |
| Lei 6.530/1978 | art. 3º, texto literal |
| CPC (13.105/2015) | arts. 156 e 473, incisos e parágrafos |

## Pendências de verificação

- `[VERIFICAR: "A Caixa Econômica Federal paga entre R$ 1.000 e R$ 3.000 por
  laudo de avaliação de imóvel"]` — está na seção de Perguntas Frequentes, sem
  fonte nem data. É um valor concreto sobre um terceiro nomeado, do tipo que
  envelhece rápido e que um leitor pode usar para negociar honorários. **Não
  inseri o marcador no texto publicado** — poluir a página com anotação interna
  seria pior que o problema. Fica o registro: confirmar ou remover.

- `caixa.gov.br` responde 302 em cadeia e `caubr.gov.br` responde 403 a qualquer
  cliente que não seja navegador, então não linkei nem a Caixa na FAQ nem o CAU
  em "Como escolher um profissional", embora ambos fossem âncoras naturais.

## Recomendações que exigem decisão do autor

- **Um H2 genérico**: "Resumo". O plano proíbe heading genérico.

- **Bloco sem contexto**: há três parágrafos que são só legendas soltas de
  imagem no meio do texto ("Laudo de Avaliação do Imóvel", "A Relevância do
  Laudo de Avaliação do Imóvel", "Vistoria para realização do Laudo de Avaliação
  do Imóvel"). Vieram da migração do Ghost como parágrafo, não como legenda.
  Deveriam virar `caption` da imagem correspondente.

- **Lacuna que sobra**: a NBR 14653 é citada quatro vezes, mas o artigo nunca
  explica os **graus de fundamentação e de precisão** (I, II e III) — que é
  exatamente o que determina se um laudo é aceito por banco ou por juízo. É a
  expansão de maior valor ainda disponível aqui, e exige consultar o texto da
  norma, que é pago.
