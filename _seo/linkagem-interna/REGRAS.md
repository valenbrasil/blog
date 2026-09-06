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

## 7. Distribuição

### 7.1 A meta

**Todo artigo recebe pelo menos 2 links internos, vindos de artigos diferentes.**

É uma frase só, e é o que manda. Recebidos, não dados: a página é apontada por
duas outras. Sem exceção e sem teto.

Custo medido no acervo de 206 artigos:

```
68 órfãos     × 2 links  =  136
44 com um só  × 1 link   =   44
                            ───
                            180 links a criar
```

Sai de 629 para 809 links internos. A saída média por artigo vai de 3,1 para
3,9 — bem dentro do que um texto suporta.

### 7.2 Referências de saída, para não sobrecarregar nenhum artigo

Não é meta, é limite superior. Ao escolher de onde sai cada um dos 180 links,
evita-se carregar demais um mesmo artigo:

| Artigo | Palavras | Links internos que dá |
|---|---|---|
| curto | até 1.500 | 2 a 4 |
| médio | 1.500 a 3.000 | 4 a 8 |
| longo | 3.000 ou mais | 8 a 12 |

Texto mais longo comporta mais referência sem ficar carregado — o que importa é
a densidade, não o número absoluto. Doze links num artigo de 4.000 palavras dá
um a cada 330 palavras; doze num de 800 seria um a cada 66.

Somando aos links externos que a densificação criou, **acima de 30 links no
corpo o texto lê como diretório**. Em artigo já denso de links externos,
fica-se na metade baixa da faixa.

### 7.3 Ordem de escolha do destino

1. **Órfãos primeiro.** 68 artigos, 2 links cada.
2. **Depois os de um só.** 44 artigos, 1 link cada.
3. Nada além disso é obrigatório.

### 7.4 Teto: nenhum

A forma saudável é pirâmide. `avaliacao-imobiliaria` recebe 36 hoje,
`laudo-de-avaliacao-do-imovel` 32, `heranca` 28 — e está certo, são o assunto
do blog.

**Nivelar é o erro.** Levar as 206 páginas ao mesmo número apagaria a
hierarquia que diz ao Google qual página é a principal sobre cada tema. E não
se corta link de pilar para "distribuir melhor": pilar recebe muito porque é
citado com naturalidade.

O ganho está em tirar 112 páginas do isolamento, não em igualar as 206.

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
