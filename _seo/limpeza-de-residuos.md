# Varredura de defeitos de conteúdo no acervo

Rodada sobre os 206 artigos, procurando os dois padrões encontrados em
`avaliacao-imobiliaria` e mais três da mesma família de defeito de migração.

## Resultado da varredura

| # | Padrão | Antes | Depois |
|---|---|---|---|
| 1 | Resíduo de edição publicado | 4 | **1** (falso positivo, ver abaixo) |
| 2 | Duplicação literal no mesmo artigo | 7 pares | **0** |
| 3 | Legenda de imagem como parágrafo | 794 em 82 artigos | **0** — ver abaixo |
| 4 | Padrões de escrita proibidos pelo plano | 59 em 54 artigos | 59 — não tratado |
| 5 | FAQ citando termo ausente do corpo | 0 | 0 |

## 1. Resíduo de edição — corrigido em 2 artigos

**`averbacao`** — o mesmo padrão A/B de `avaliacao-imobiliaria`: um bloco só com
"Antes:", a versão em prosa, um bloco só com "Depois:", e a versão em lista.
Removidos os dois rótulos e a prosa. Antes de remover, o script verificou que
cada item da prosa sobrevive na lista mantida: certidão negativa do INSS,
requerimento assinado, alvará e certificado de demolição, atualização do projeto
original e a frase de encerramento sobre o cartório.

**`compra-e-venda-de-imovel`** — mesmo padrão, com um agravante. Além da prosa
duplicada pela lista, havia um parágrafo órfão entre as duas versões:

> "Depois de analisar as opções disponíveis, decidimos que o investimento em um
> bem móvel seria a melhor escolha para diversificar nosso portfólio."

A frase não tem relação com o artigo, que trata de contrato de compra e venda de
imóvel — fala em bem **móvel** e em portfólio de investimentos, em primeira
pessoa do plural. É o lado "Depois:" da reescrita, substituído por um texto de
exemplo que ficou publicado. Removida.

**`dupla-titulacao-em-arquitetura` — falso positivo, não tocado.** O "Obs:" que
a varredura apontou é conteúdo legítimo: o artigo é um relato em primeira pessoa
sobre estudar arquitetura na Espanha, escrito em registro informal, e a
observação sobre formatos de entrega de trabalho é informação real da autora. O
padrão de superfície coincidia; o defeito, não.

## 2. Duplicação literal — corrigida em 3 artigos

Em todos os casos manteve-se a **primeira** ocorrência, preservando a ordem
original de leitura, e removeram-se as cópias exatas. O script comparou os textos
e abortaria se não fossem idênticos.

| Artigo | Bloco repetido | Cópias |
|---|---|---|
| `processo-de-desapropriacao-de-imoveis` | "Processo de Desapropriação de Imóveis Privados privadas para atender…" | 3 → 1 |
| `imposto-explicado-laudemio` | "Laudêmio \| Taxa de origem histórica que incide…" | 3 → 1 |
| `parklets` | "À medida que mais cidades abraçam a ideia dos parklets…" | 2 → 1 |

Os dois primeiros são, na origem, legendas de imagem que entraram como parágrafo
— e ainda concatenadas com um fragmento de outra frase, o que as deixa
agramaticais ("…de Imóveis Privados privadas para atender…"). Removeram-se as
cópias; a ocorrência restante permanece, porque corrigir o texto emendado é outro
problema, do item 3, e é decisão do autor.

## Custo total

10 blocos removidos em 5 artigos, −274 palavras. Nenhuma informação perdida: em
cada caso o conteúdo sobrevive na versão mantida, e cada remoção passou por
verificação específica antes de gravar.

## O que ficou de fora, e por quê

**Item 3 — resolvido, e o diagnóstico estava errado.** A correção prevista aqui
— "converter a legenda em `caption` da imagem vizinha" — era impossível como
escrita: não havia imagem vizinha em quase nenhum caso. O acervo tinha 98 blocos
de imagem para 794 legendas.

O site antigo do Ghost ainda responde, e a comparação explicou o descompasso:
ele tem 654 figuras com imagem, das quais 552 com `<figcaption>`. A migração
trouxe o texto da legenda como parágrafo e deixou a imagem para trás. As
"legendas soltas" eram o rastro visível de 556 imagens perdidas.

Corrigir a legenda de verdade era trazer a imagem de volta. Detalhado em
`_seo/imagens-restauradas.md`.

**Item 4 — 59 fórmulas proibidas em 54 artigos.** Cada uma exige reescrever a
frase preservando a voz do autor. É trabalho de redação, artigo a artigo, não
substituição mecânica: trocar "é importante destacar" por outra muleta não
resolve o que o plano quer evitar.
