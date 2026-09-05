# Linkagem interna

## O que o Google de fato recomenda

Fonte: [Links best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable),
Search Central, atualizado em 10/12/2025.

A única regra numérica que o documento enuncia é sobre **entrada**, não sobre
saída:

> Every page you care about should have a link from at least one other page on
> your site.

E logo em seguida desautoriza qualquer meta por página:

> There's no magical ideal number of links a given page should contain. However,
> if you think it's too much, then it probably is.

Sobre a âncora: *"descriptive, reasonably concise, and relevant to the page that
it's on and to the page it links to"*, com um teste prático — ler a âncora **fora
de contexto** e ver se ainda se sabe do que trata o destino. "ITBI", "usucapião",
"IGP-M", "Oscar Niemeyer" passam. "imóvel", "avaliação", "clique aqui" não.

Duas advertências viraram regra no script:

- *"resist the urge to cram every keyword that's related to the page that you're
  linking to (remember, keyword stuffing is a violation of our spam policies)"*
- *"Don't chain up links next to each other"* — daí no máximo um link novo por
  bloco, e nada em bloco vizinho de um já linkado.

## O estado antes

Duas medições que corrigem números que eu mesmo havia reportado a menos:

**Link de blog para blog eram 202, não 372.** Os outros 170 apontam para
`valenbrasil.com`, que é o site institucional — outro site, portanto link
externo, não interno.

**Os 202 estavam todos sem a barra final.** O build usa `trailingSlash: true`,
então cada um custava um salto 301 antes de chegar à página.

## O que foi feito

### 1. Âncoras por termo do próprio acervo

Dicionário curado à mão: a forma como o texto realmente se refere a cada
assunto — `ITBI`, `NBR 14653`, `holding familiar`, `Oscar Niemeyer`,
`Balneário Camboriú` —, com flexão de plural do português (foi ela que revelou
que "fundo imobiliário" não aparece em lugar nenhum, mas "fundos imobiliários"
aparece em quatro artigos).

Regras aplicadas a cada âncora: existe literalmente no texto, está em parágrafo
comum e nunca em heading, não encosta na borda do span, um destino no máximo uma
vez por artigo, nada em bloco vizinho de outro link.

### 2. Âncoras genéricas, a pedido do autor

Para os artigos que continuavam sem nenhum link interno, o autor pediu
explicitamente as palavras `arquitetura`, `imóvel`, `imóveis`, `avaliação` e
`investimento` como âncora. Fica registrado que eu havia levantado que essas
palavras isoladas falham no teste de leitura fora de contexto do Google; o autor
manteve o pedido, com a informação na mão.

Onde o texto oferecia a frase mais longa que contém a palavra — "avaliação de
imóveis", "investimento imobiliário", "mercado imobiliário" — foi ela que virou
âncora: atende ao pedido e ainda passa no teste.

Nove artigos não continham nenhuma das cinco palavras em posição usável. Para
eles, o mapa foi estendido com os termos que esses textos de fato usam
(`projeto`, `obra`, `construção`, `patrimônio`, `design`, `arquitetos`).

O último a resistir foi `resenha`, uma resenha de filosofia ambiental sobre *O
Contrato Natural*, de Michel Serres, sem nenhuma palavra do vocabulário
imobiliário ou arquitetônico. Recebeu `problemas ambientais` →
`/areas-de-protecao-ambiental/`. É a ponte mais fraca do conjunto e está
registrada como tal.

### 3. Bloco "Leia também"

Tratado em `site/lib/relacionados.ts`. Não conta como linkagem contextual — é
navegação —, mas estava pior que ausente: seus 618 links apontavam para 20
artigos, três deles recebendo 67 cada, porque a ordem era por data. Agora são os
mesmos 618 distribuídos por 206 artigos, mínimo 2 e máximo 4 cada.

### 4. Âncoras editoriais, artigo a artigo

Os 40 artigos que estavam sem nenhum link passaram por 14 agentes: sete leram o
texto integral e o catálogo dos 206 destinos e propuseram âncoras; outros sete,
céticos, reprovaram o que não se sustentava. Saíram 44 aprovadas, das quais 30
sobreviveram às travas do aplicador.

As reprovações mostram o critério funcionando. Uma delas recusou `ABNT` →
`nbr-14653` porque a sigla nomeia a associação inteira, com milhares de normas
de todos os setores, e não a norma de avaliação de imóveis — o destino não trata
do que a âncora nomeia. Outra recusou `Cidade das Artes` porque o "parágrafo"
era, na verdade, uma legenda de imagem publicada como parágrafo: o defeito 3 do
acervo aparecendo de novo, agora atrapalhando a linkagem.

## Seis erros meus, encontrados conferindo o HTML gerado

Ao ler as âncoras renderizadas, encontrei `arquitetura moderna` apontando para
`/arquitetura-modular/`. Modernismo e construção modular não são a mesma coisa —
quem clicasse não acharia o que a âncora prometeu. Puxando o fio, apareceram
mais cinco do mesmo tipo:

| âncora | o que o texto diz | destino que eu havia posto |
|---|---|---|
| `arquitetura moderna` | Niemeyer, ícone do modernismo | construção modular |
| `arquitetura moderna` | Calatrava | construção modular |
| `patrimônio` | "patrimônio **natural**" das APAs | restauração de patrimônio histórico |
| `design` | "design **de campo**" de golfe | renderização de projetos |
| `design` | "design **interior**" no co-living | renderização de projetos |
| `design` | escolhas de design de **jardim** | renderização de projetos |

Todos removidos. Dois artigos voltaram a zero e receberam âncora honesta:
`a-influencia-do-jardim-sensorial` fala em "parques públicos", que é o assunto do
artigo do Parque Turia; e `golf-club-brasil` traz "proteja seu **patrimônio**",
que é exatamente o que uma holding patrimonial faz.

Esse último exigiu relaxar uma regra: o span estava em negrito, e eu pulava
qualquer span já marcado. No Portable Text link e negrito convivem no mesmo
span — o que não pode conviver é um segundo link.

## Resultado

```
                              antes    depois
links internos (corpo) ......   202  →    634
média por artigo ............   1,0  →    3,1
artigos com 5 ou mais .......    14  →     67
artigos com zero ............    47  →      0
sem barra final .............   202  →      0
links internos quebrados ....     0  →      0
```

## Erros encontrados na varredura e corrigidos

```
                                              antes  depois
saltos de heading (h2 → h4) .................    5  →   0
imagens sem alt .............................    2  →   0
artigos sem categoria .......................    2  →   0
href repetido no mesmo artigo ...............   62  →  42
links internos sem barra final ..............  202  →   0
```

Os 42 hrefs repetidos que sobraram são todos `https://valenbrasil.com/`, o
caminho de conversão do site. Repetir o link institucional dentro de um artigo é
decisão comercial do autor, não defeito, então ficaram intocados.

As duas imagens sem `alt` foram descritas depois de abertas — nada afirmado além
do que se vê. No campus da biografia do Norman Foster, por exemplo, o texto não
diz que é Yale, porque a foto não permite afirmar.

As duas categorias faltantes saíram do padrão dos artigos irmãos: todo texto de
praça e mercado do litoral catarinense — Itajaí, Itapema, Bombinhas, Blumenau,
Brava Home Resort — está em "Investimento Imobiliário", e `balneario-camboriu` e
`golf-club-brasil` passaram a estar também.

Nada disso alterou uma vírgula do texto dos artigos: toda a linkagem é `markDef`
acrescentado e span partido nos limites da âncora, com asserção de texto
idêntico antes e depois em cada gravação.

## O que continua em aberto

- **94 imagens sem `caption`**, das 98 do corpo. É o outro lado das 794 legendas
  que a migração do Ghost publicou como parágrafo solto: a legenda existe, está
  no lugar errado. Exige migração de dados, não edição de texto.
- **42 repetições do link institucional**, para o autor decidir.
