# Datas de publicação reescritas

Pedido do autor: um artigo por quarta-feira, às 10h, sendo o mais recente na
quarta de 2 de setembro de 2026.

## O que foi feito

Os 206 artigos receberam `publishedAt` novo, um por quarta-feira consecutiva.

```
artigos ..................... 206
dia da semana ............... quarta-feira, 206 de 206
hora ........................ 10:00 em America/Sao_Paulo (13:00Z)
datas distintas ............. 206
intervalo ................... 2022-09-28 … 2026-09-02
intervalos fora dos 7 dias ..   0
datas no futuro .............   0
```

`13:00Z` e não `10:00Z`: o site formata data com `timeZone: 'America/Sao_Paulo'`
em `site/lib/date.ts`, então é esse o fuso em que "10h" tem de valer.

## A ordem foi preservada

A ordem cronológica anterior foi mantida — o artigo mais antigo continua o mais
antigo, o mais recente continua o mais recente. Onde vários artigos dividiam a
mesma data (a migração do Ghost trouxe lotes inteiros com `2023-04-01`), o slug
desempatou, para que o resultado seja reproduzível.

## O que isso custa, declarado antes de gravar

`publishedAt` alimenta o `datePublished` do JSON-LD e o `lastmod` dos dois
sitemaps. Três consequências:

1. **As datas deixam de bater com o que o Google já indexou.** O acervo real ia
   de `2023-04-01` a `2026-03-20`. O novo vai de `2022-09-28` a `2026-09-02`:
   os artigos mais antigos passam a declarar publicação meio ano antes de
   existirem, e os mais novos avançam cinco meses.

2. **A cadência é sintética.** Uma publicação por semana, sempre na quarta,
   sempre às 10h, por 206 semanas ininterruptas, é um padrão que nenhum blog
   real produz.

3. **Todo o sitemap muda de uma vez**, o que dispara recrawl do acervo inteiro.

O autor foi informado disso antes da gravação e manteve o pedido.

## Reversão

`_seo/backups/pre-datas/datas.json` guarda, para cada artigo, o `_id`, o `_rev`
anterior, a data antiga (`de`) e a nova (`para`). É o suficiente para reverter
artigo a artigo ou em lote.
