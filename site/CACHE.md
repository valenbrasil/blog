# Por que `prebuild` apaga o cache de fetch

O `package.json` roda isto antes de todo build:

```json
"prebuild": "node -e \"require('fs').rmSync('.next/cache/fetch-cache',{recursive:true,force:true})\""
```

## O que ele evita

O site é `output: 'export'`: cada consulta ao Sanity roda uma vez, na geração, e
vira HTML estático. O Next guarda essas respostas em `.next/cache/fetch-cache` e
as reaproveita no build seguinte. Num site de CMS isso significa que **um build
disparado depois de publicar sai com o conteúdo anterior — sem erro nenhum**, que
é a pior forma de errar.

Aconteceu de verdade ao reescrever as datas de publicação dos 206 artigos. A
gravação no Sanity estava correta, e o build local continuou gerando as datas
antigas, inclusive no `lastmod` do sitemap. Só um `rm -rf .next/cache` revelava a
diferença — e sem isso a conferência antes de publicar teria dado tudo certo em
cima de dado velho.

## Por que não `cache: 'no-store'`

Foi a primeira tentativa, e o Next recusa:

```
Route /[slug] with `dynamic = "error"` couldn't be rendered statically
because it used `revalidate: 0 fetch https://…api.sanity.io/…`
```

Num export estático não existe consulta sem cache: a página precisa ser
renderizável na geração. O cache dentro de um build não é o problema — ele é o
que faz as 237 páginas não repetirem a mesma consulta. O problema é só a
sobrevivência dele **entre** builds.

## No CI isso já não acontecia

O `deploy.yml` cacheia apenas o npm (`cache: npm`), e cada execução parte de
checkout limpo, então lá o `fetch-cache` nunca existe. O `prebuild` alinha o
build local ao do CI, que é justamente onde se confere o resultado antes de
publicar.
