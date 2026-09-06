# Linkagem interna — as regras

Link interno é link de um artigo do blog para outro artigo do mesmo blog,
dentro do corpo do texto. O objetivo é que **toda página receba pelo menos
dois**, vindos de artigos diferentes.

Estado medido em 06/09/2026, nas 206 páginas no ar: 629 pares origem→destino,
68 artigos recebendo zero, 44 recebendo um, 94 já com dois ou mais. Faltam
cerca de 180 links para o piso de dois.

---

## 1. A regra que governa todas as outras

**O link se descobre, não se inventa.**

Trabalha-se a partir do destino: para cada artigo órfão, procura-se nos outros
206 uma frase que **já fala** daquele assunto. O link nasce dessa frase. Onde
não houver frase assim, não há link — procura-se outra origem.

Isso inverte o instinto natural, que é "abrir o artigo A e ver o que dá para
linkar". Feito assim, os órfãos continuam órfãos: eles são órfãos justamente
porque ninguém pensa neles.

---

## 2. O que pode ser feito com o texto

Só operação **aditiva**, como na densificação de links externos:

- `ancorar` — pôr link sobre trecho que já existe, sem mudar uma letra.
- `emendar` — acrescentar frase ao fim de um bloco existente.
- `acrescentar` — inserir bloco novo entre blocos existentes.

Nunca reescrever, cortar ou reordenar o que o autor escreveu.

**Preferência forte pelo `ancorar`.** Um link interno que exige frase nova é
suspeito: se o artigo de origem não falava do assunto, provavelmente não é
origem legítima. `emendar` e `acrescentar` só quando a frase nova se sustentar
sozinha, como informação que o leitor ganha — não como pretexto para o link.

---

## 3. A âncora

**Existe literalmente.** O trecho tem de estar no bloco, palavra por palavra,
e ser único ali. Chave do bloco lida do JSON do artigo, nunca escrita de
memória.

**Nomeia o destino.** Quem lê a âncora fora de contexto sabe aonde vai.
Proibido: "clique aqui", "saiba mais", "neste artigo", "veja também".

**Não é frase-tema genérica.** Um cético desta série reprovou a âncora
"Regularização de imóveis" porque, solta, ela não anuncia destino nenhum —
poderia levar a qualquer coisa. Âncora boa nomeia o assunto: "método
evolutivo", "certidão de matrícula", "hipoteca reversa".

**Não cai sobre link existente.** O aplicador barra, mas o plano não deve
propor: link dentro de link não existe em HTML e destruiria o link de origem.

**Varia.** Um destino que recebe vinte links não pode receber vinte âncoras
idênticas. A âncora sai do que cada artigo de origem realmente diz. Vinte
repetições da mesma expressão exata é padrão de manipulação, não de referência.

---

## 4. O destino

**O artigo de destino tem de ser sobre aquilo.** Não basta mencionar. Se a
âncora diz "método da capitalização da renda", o destino explica o método —
não é um artigo que cita o termo de passagem.

**Um link por destino, por artigo.** O mesmo artigo não aponta duas vezes para
o mesmo lugar.

**Nunca para si mesmo.**

**O destino existe.** Slug conferido contra o sitemap; nada de link para página
que não responde 200.

---

## 5. Onde o link entra

**No corpo, onde o assunto aparece.** Não em bloco de "leia também" no fim: ali
o link é rodapé, lido como boilerplate, e vale menos.

**Não sequestra parágrafo alheio.** Bloco novo com `h3` colocado no meio de uma
seção faz os parágrafos seguintes do autor passarem a viver sob um título que
não é deles. Já aconteceu quatro vezes nesta série. Bloco novo entra em fim de
seção, antes do próximo título — nunca no meio.

**Respeita numeração.** Artigo que numera seções (2.1, 2.2) não recebe `h3` sem
número entre dois numerados.

**Sem anáfora órfã.** Frase nova não começa com "esse prazo", "essa restrição",
"esses ônus" se o antecedente estiver em outro bloco. O leitor não tem o
referente.

---

## 6. O que a frase nova pode dizer

Quando houver frase nova, ela obedece às mesmas regras da densificação externa:

- **Nada de exclusividade inventada.** "Somente X pode", "a lei reserva a X",
  "atividade com titular definido" — quatro reprovações num único lote foram
  disso. Norma que lista atribuição não cria reserva de atividade.
- **Nada de generalização a partir de um caso.** "Esses ônus dependem do
  registro para existir" era verdade para a alienação fiduciária e falso para
  penhora, indisponibilidade e usufruto.
- **Nada de fato histórico sem fonte.** "Lei editada depois do incêndio da
  boate Kiss" — todo mundo "sabe", a página do Planalto não diz.
- **Nada de contradizer o autor.** Se a frase nova brigar com o que o artigo já
  afirma, reformula-se para conviver, ou não entra. Só se pode somar.
- **Sem fórmula batida**, sem superlativo sem lastro, sem promessa ou conselho
  em nome da empresa.

---

## 7. Distribuição: quantos links, e para onde

Duas regras que trabalham juntas. Uma define **quanto cada artigo gasta**, a
outra define **onde esse gasto vai parar**. Nenhuma das duas funciona sozinha.

### 7.1 Orçamento de saída, pelo tamanho do artigo

| Artigo | Palavras | Links internos que dá |
|---|---|---|
| curto | até 1.500 | 2 a 4 |
| médio | 1.500 a 3.000 | 4 a 8 |
| longo | 3.000 ou mais | 8 a 12 |

Texto mais longo comporta mais referência sem ficar carregado: a densidade é
que importa, não o número absoluto. Doze links num artigo de 4.000 palavras dá
um a cada 330 palavras; doze num de 800 seria um a cada 66.

Medido no acervo (206 artigos, antes dos últimos lotes de densificação):

```
curto   37 artigos  ->   74 a  148 links
médio  119 artigos  ->  476 a  952
longo   50 artigos  ->  400 a  600
                        ───────────────
                        950 a 1.700 no total
```

Hoje há 629 links internos. Para levar todos ao **piso** da sua faixa faltam
**369 links**, distribuídos por 137 artigos — 69 já estão no piso.

A contagem de palavras muda conforme a densificação externa avança: vários
artigos cruzaram de médio para longo ao ganhar 600 ou 800 palavras. A faixa de
cada artigo se recalcula na hora de rodar, não agora.

### 7.2 Piso de entrada: dois, sempre

O orçamento de saída diz quanto gastar. Ele **não** diz para onde, e aí mora o
risco: 369 links novos podem cair todos em cima das páginas que já são fortes,
e os 68 órfãos continuarem órfãos. O artigo cumpre a cota e o problema não se
resolve.

Por isso a segunda regra: **nenhum artigo pode receber menos de dois links de
artigos diferentes.** Ela tem prioridade sobre a primeira na hora de escolher o
destino.

A ordem de gasto é:

1. **Primeiro os órfãos.** 68 artigos × 2 links = 136.
2. **Depois os de um só.** 44 artigos × 1 link = 44.
3. **O resto da cota, livre**, seguindo o que o texto pedir.

Sobra folga: são 369 links a criar contra 180 estritamente necessários na
entrada. Os 189 restantes se distribuem por relevância, sem meta.

### 7.3 Teto de entrada: nenhum

A forma saudável é pirâmide: poucas páginas muito citadas, muitas citadas o
suficiente. `avaliacao-imobiliaria` recebe 36 hoje, `laudo-de-avaliacao-do-imovel`
32, `heranca` 28 — e está certo, são o assunto do blog.

**Nivelar é o erro.** Levar as 206 páginas ao mesmo número apaga a hierarquia
que diz ao Google qual página é a principal sobre cada tema. O ganho está em
tirar 112 páginas do isolamento, não em igualar as 206.

Efeito esperado do modelo sobre a entrada: média de 3,1 para 4,8 links
recebidos por artigo, com o piso de zero subindo para dois e o topo intacto.

### 7.4 O limite que não se cruza

Somando aos links externos, um artigo médio ficaria com 4 a 8 internos mais os
11,5 externos de hoje: 16 a 20 links no corpo. Um artigo longo, 8 a 12 mais 15
a 20 externos: até 32.

**Acima de 30 links no corpo, o texto começa a ler como diretório.** Nos
artigos longos, portanto, fica-se na metade baixa da faixa — 8 ou 9, não 12 —
sempre que o artigo já for denso em links externos. O modelo é faixa, não cota
a cumprir.

## 8. O processo

Igual ao da densificação externa, porque funcionou: **redator propõe, cético
tenta derrubar, aplicador confere de novo antes de gravar.**

O cético refaz tudo: confere que a âncora existe no bloco, que o destino trata
mesmo do assunto, que a colocação não sequestra parágrafo, que a frase nova não
contradiz o autor. **Na dúvida, reprova.**

Nos 157 artigos da densificação externa o cético reprovou 96 de 790 operações —
12%. O que ele pegou não era lixo óbvio: era norma revogada citada como
vigente, redação antiga no lugar da vigente, artigo atribuído à lei errada,
exclusividade que a fonte não cria. Sem essa passada, tudo isso teria ido ao ar
com aparência de conferido.

**Ensaio a seco antes de gravar**, sempre. E gravação em lote, com o registro
do que entrou.

---

## 9. Quando parar

Se um artigo não alcançar dois links honestos, **fica com um, ou com zero, e
entra no relatório com o motivo**.

Há ilhas temáticas reais no acervo — `explorando-glasgow`, `explorando-belfast`,
`viaje-na-arquitetura-de-budapeste`, `descubra-bombinhas`, `golf-club-brasil`.
Ligá-las ao núcleo de avaliação e direito imobiliário exigiria frase forçada.
Entre elas há parentesco natural, e é por aí que se tenta.

**Link forçado é pior que artigo órfão.** O órfão não é encontrado; o link
forçado ensina ao Google que este site fabrica links.
