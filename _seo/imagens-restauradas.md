# As 794 legendas soltas eram 556 imagens perdidas

## O diagnóstico que estava errado

A varredura de resíduos registrou "794 legendas de imagem publicadas como
parágrafo, em 82 artigos", e propôs convertê-las em `caption` da imagem vizinha.

A proposta não fechava com os dados. O acervo tinha **98 blocos de imagem** no
corpo, para 794 legendas. Só 10 dessas legendas ficavam ao lado de alguma
imagem. Não havia imagem vizinha para quase nenhuma.

O site antigo do Ghost ainda responde, e a comparação explicou o descompasso:

```
figuras com imagem no Ghost ....... 654
  delas, com <figcaption> ......... 552
blocos de imagem no Sanity ........  98
imagens perdidas na migração ...... 556
```

A migração trouxe o texto do `<figcaption>` como parágrafo e deixou o
`<figure><img>` para trás. As legendas soltas não eram defeito de formatação:
eram o rastro visível das imagens que sumiram.

Corrigir a legenda de verdade, portanto, era trazer a imagem de volta.

## Como a posição foi determinada

Cada legenda que casa **exatamente** com um parágrafo solto diz onde a imagem
estava. Antes de mexer em qualquer coisa, a taxa foi medida: **527 das 552
legendas, 95%**, casavam ao pé da letra.

O parágrafo é então substituído pelo bloco de imagem, no mesmo índice, com a
legenda em `caption` e em `alt`. O texto continua visível na página — agora como
`<figcaption>` e não como frase solta no meio da prosa.

## Três passadas, porque o dado tinha três formatos

| Passada | O que trata | Artigos | Imagens |
|---|---|---|---|
| 1 | legenda casa inteira com um parágrafo | 122 | 501 |
| 2 | legendas que a migração colou umas nas outras | 9 | 29 |
| 3 | parágrafo formado por prefixo + legenda(s) | 2 | 4 |

A passada 2 nasceu de um bug meu. A asserção de integridade comparava os
parágrafos removidos **pelo texto** da legenda; quando a mesma legenda aparecia
duas vezes no artigo — normal em galeria — ela descartava as duas da comparação
embora só uma tivesse virado imagem, e abortava achando que o texto havia
divergido. Cinco artigos foram barrados por isso. Nenhum chegou a gravar nada
errado: a checagem fez exatamente o que devia. Reescrita por índice.

A mesma passada resolveu um segundo defeito da migração, que só apareceu quando
fui investigar por que 25 legendas não casavam: **legendas consecutivas coladas
num parágrafo só**, sem separador.

```
Ghost, duas figuras seguidas:
   "Arquitetura Georgiana: Winfield House, … em Londres (1936)."
   "Casa Georgiana. Imagem: Christine Huckins Franck."

Sanity, um parágrafo só:
   "…em Londres (1936).Casa Georgiana. Imagem: Christine Huckins Franck."
```

Repare no `(1936).Casa`, sem espaço. A passada 3 estende isso para o caso em que
o parágrafo é um prefixo qualquer colado às legendas — "Link: https://…" seguido
da legenda, por exemplo. O prefixo continua como parágrafo; nada de texto sai.

## Resultado

```
                                  antes    depois
blocos de imagem no corpo ......    98  →    635
  com caption ..................     4  →    541
  com alt ......................    96  →    635   (100%)
legendas soltas como parágrafo .   794  →      0
capas sem alt ..................    14  →      0
```

No HTML gerado: **841 `<img>` dentro do artigo, 841 com `alt` preenchido**, 841
`<figure>` e 739 `<figcaption>`.

Integridade conferida contra os backups de 130 artigos: **zero blocos de texto
perdidos**. Cada gravação passou por asserção de que o texto restante é
exatamente o de antes menos as legendas que viraram `caption`.

## O que não foi restaurado, e por quê

Faltam 19 das 654 figuras do Ghost:

- **10 figuras sem `<figcaption>` no Ghost.** Sem legenda não há âncora que diga
  onde a imagem estava. Inserir por palpite poria a foto no lugar errado.
- **6 em `holding-patrimonial`.** A migração perdeu a imagem *e* a legenda: o
  texto da legenda não existe em lugar nenhum do artigo. Não há o que casar.
- **3 remanescentes** de casos de colagem que não fecham por igualdade exata.

## As 94 imagens sem `caption`

Não é lacuna a preencher. Nos 29 artigos onde elas estão, a contagem de figuras
do Ghost bate exatamente com a do Sanity e **não sobra nenhuma legenda sem uso**:
essas imagens nunca tiveram `<figcaption>` na origem. Escrever uma legenda seria
inventar texto, que o plano proíbe. Todas têm `alt`.

## Sobre o crédito de fonte

Houve um erro meu aqui, corrigido. Interpretei "as fotos não precisam ter fonte"
como instrução para remover créditos, e criei uma regra que os tirava. Ela rodou
em três artigos antes de o autor esclarecer que o ponto era outro: fonte não é
**obrigatória**, mas onde existe é legítima e fica. Conferindo o estrago, a regra
não havia removido nenhum crédito de verdade — cortou o ponto final de 11
legendas. O texto exato foi devolvido nas 11, e a regra saiu do script.
