# Lacunas de schema e de renderização

Fase 0, item 3b. Levantado antes de tocar em conteúdo, porque **não adianta
preencher campo no Sanity que o schema não declara e o site não imprime.**

Fontes: `sanity/schemaTypes/post.ts`, `sanity/schemaTypes/blocks.ts`,
`site/components/PostBody.tsx`, `site/app/[slug]/page.tsx` e o HTML publicado de
`https://blog.valenbrasil.com/metodo-valenbrasil-o-arquiteto-digital/`.

---

## Resumo

| # | Lacuna | Schema | Front-end | Bloqueia |
|---|---|---|---|---|
| 1 | `nofollow`/`rel` em link | falta | falta | política de links externos |
| 2 | `alt` em imagem do corpo | não declarado | imprime | edição no Studio |
| 3 | `title` em imagem | falta | falta | política de imagens |
| 4 | descrição de imagem | só `caption` | imprime | — (atende, renomeando o conceito) |
| 5 | JSON-LD | — | falta | dados estruturados |
| 6 | canonical e Open Graph | — | falta | — (fora do escopo do documento, mas relevante) |

Nenhuma dessas mudanças altera URL. Todas são commit no GitHub, não patch no Sanity.

---

## 1. Link não tem como sair com `rel="nofollow"` — bloqueio

**Schema.** `body` usa `{ type: 'block' }` puro. A anotação de link é a padrão do
Sanity, que só tem `href`. Não existe campo `nofollow` nem `rel`.

**Front-end.** `PostBody.tsx` declara componentes só para `types` (image,
codeBlock, embed). Não há nada em `marks`, então o `@portabletext/react` usa o
renderizador padrão do link.

**Confirmado no HTML publicado:**

```html
<a href="https://suitebras.com/">
```

Sem `rel`, sem `target`. Os 199 links externos do dataset saem assim hoje.

**Correção necessária, nesta ordem:**

1. Declarar o bloco com uma anotação de link própria, acrescentando `nofollow`
   (booleano, padrão `true` para destino externo). Ao declarar `marks.annotations`
   é preciso redeclarar a anotação de link inteira — o Sanity substitui a lista
   padrão, não soma a ela.
2. Adicionar `marks: { link: ... }` no `PortableText`, emitindo
   `rel="nofollow noopener noreferrer"` e `target="_blank"` quando externo, e
   nada disso quando interno.
3. Só então marcar as anotações no conteúdo.

O passo 2 sozinho já resolveria 100% dos links externos existentes, se a regra
for "todo link para fora leva nofollow" — dá para derivar do próprio `href`, sem
campo novo. O campo no schema só é necessário se você quiser **exceções**
(um parceiro que mereça follow, por exemplo). Vale decidir isso antes: sem
exceções, a correção é uma só, no front-end, e vale para os 206 artigos de uma
vez, sem tocar em nenhum documento.

---

## 2. `alt` da imagem do corpo não existe no schema — bloqueio de edição

**Schema.** A imagem dentro de `body` é declarada como
`{ type: 'image', fields: [{ name: 'caption', type: 'string' }] }`. Só `caption`.

**Dados.** 288 das 304 imagens **têm** `alt` preenchido — a migração do Ghost
gravou o campo. Como o Sanity guarda campos não declarados, o valor está lá e o
site o imprime, mas **o Studio não mostra nem deixa editar**: para o editor, o
campo não existe.

**Correção:** declarar `alt` no objeto de imagem do corpo. É aditivo e não
altera nenhum dado existente — apenas torna visível o que já está gravado.

---

## 3. `title` de imagem não existe em lugar nenhum — bloqueio

Nem `mainImage` nem a imagem do corpo têm campo `title`, e o front-end não
imprime o atributo. O documento de auditoria exige `title` em 100% das imagens.

**Correção:** adicionar `title` aos dois objetos de imagem no schema e passar o
atributo no `next/image` do `PostBody.tsx` e da capa em `app/[slug]/page.tsx`.

---

## 4. Descrição da imagem — atendida por `caption`

O `caption` existe nos dois objetos, é renderizado como `<figcaption>` visível e
serve ao papel de "descrição completa" pedido pelo documento. Não precisa de
campo novo.

Estado atual: 102 das 304 imagens estão sem `caption`.

---

## 5. Nenhum dado estruturado — sem bloqueio de schema

O HTML publicado não tem nenhum `application/ld+json`. `BlogPosting` e
`BreadcrumbList` são geráveis inteiramente a partir de dados que já existem
(título, autor, datas, imagem, categoria), sem campo novo. `FAQPage` dependeria
de os artigos ganharem seção de FAQ, o que é trabalho de conteúdo.

---

## 6. Sem canonical e sem Open Graph — fora do escopo do documento

O `<head>` dos artigos tem apenas `<title>` e `<meta name="description">`. Não há
`<link rel="canonical">`, nem `og:title`, `og:description`, `og:image`, nem
`twitter:card`. Com o blog recém-migrado de domínio e o Ghost antigo ainda no ar
servindo o mesmo conteúdo, a ausência de canonical é o item mais urgente desta
lista fora dos que o documento pede.

Correção: `metadataBase`, `alternates.canonical` e `openGraph` no
`generateMetadata` — mudança pequena, sem tocar em conteúdo.

---

## Campos de SEO: existem e funcionam

`seo.metaTitle` (máx. 65) e `seo.metaDescription` (máx. 155) estão no schema, e
`generateMetadata` já os consome com fallback para `title` e `excerpt`. Nenhuma
mudança estrutural é necessária — só preenchimento:

- 56 artigos sem `metaTitle`
- 10 artigos sem `metaDescription`
- 0 artigos sem `excerpt`

Nenhum estoura o limite de caracteres.

---

## Ordem recomendada

1. **Commit 1 (front-end):** `rel="nofollow noopener noreferrer"` + `target` em
   link externo, derivado do `href`. Resolve os 199 links de uma vez.
2. **Commit 2 (front-end):** canonical, Open Graph e JSON-LD `BlogPosting` +
   `BreadcrumbList`.
3. **Commit 3 (schema + front-end):** `alt` e `title` nas imagens; atributo
   `title` impresso.
4. **Só então** começar a Fase 1, artigo por artigo.

Os três primeiros valem para os 206 artigos sem nenhum patch no Sanity.
