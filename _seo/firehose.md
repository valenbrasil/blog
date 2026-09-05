# Firehose — monitoramento da web em tempo real

Configurado por API em 05/09/2026. Conta no plano **Free**.

A skill `@tysg/firehose-api` (v2.0.2) está instalada em
`.claude/skills/firehose-api/` — procedência e hashes em `PROVENANCE.md`.

## Credenciais

Vivem em `.env.local` (modo 600, no `.gitignore`). **Este repositório é público:**
nenhum valor de token pode entrar em arquivo versionado.

| variável | prefixo | serve para |
|---|---|---|
| `FIREHOSE_MANAGEMENT_KEY` | `fhm_` | criar, listar, renomear, pausar e apagar taps; e o URL Watch |
| `FIREHOSE_TAP_TOKEN` | `fh_` | regras do tap e o stream SSE |

Os nomes são os que a skill declara no frontmatter (`requires.env`), não escolha nossa.

## Tap

O plano Free permite **1 tap**. A tentativa de criar um segundo devolveu
`Tap limit reached. The Free plan allows up to 1 tap.` — então marca e setor
dividem o mesmo tap, separados por `tag`.

    Valen Brasil — marca e backlinks
    id 9f2248e2… · active   (id completo no painel da Firehose)

## Regras

Todas passaram por `POST /v1/validate` antes de serem gravadas, com
`quality: true` (descarta paginação, páginas de tag/categoria e conteúdo velho).

| tag | consulta |
|---|---|
| `marca-ancora` | `added_anchor:"Valen Brasil"` |
| `marca-mencao` | `"Valen Brasil" OR "valenbrasil.com" OR "blog.valenbrasil.com"` |
| `avaliacao-imobiliaria` | `("avaliação imobiliária" OR "laudo de avaliação" OR "valor de mercado do imóvel") AND language:pt` |
| `tributos-imovel` | `(ITBI OR ITCMD OR "valor venal") AND language:pt` |
| `norma-pericia` | `("NBR 14653" OR "perito avaliador" OR "engenharia de avaliações") AND language:pt` |

`marca-ancora` é a de maior valor para SEO: só dispara quando alguém publica um
link cujo texto-âncora é a marca — ou seja, backlink novo, no momento em que o
crawler encontra a página.

## URL Watch

O tap só vê uma página quando o crawler chega nela, na agenda dele. Para vigiar
páginas **específicas** a ferramenta certa é o URL Watch, que recrawleia numa
cadência fixa e guarda o diff.

O plano Free dá 5 URLs, 1.000 checks/mês e cadência mínima de 3 h.

| URL | cadência | por dia |
|---|---|---|
| `blog.valenbrasil.com/` | 180 min | 8 |
| `blog.valenbrasil.com/laudo-de-avaliacao-do-imovel/` | 360 min | 4 |
| `blog.valenbrasil.com/perito-imobiliario/` | 360 min | 4 |
| `blog.valenbrasil.com/avaliacao-imobiliaria/` | 360 min | 4 |
| `valenbrasil.com/` | 1440 min | 1 |

**630 checks/mês** dos 1.000 disponíveis.

A home do blog ficou na cadência mais rápida que o plano permite de propósito:
ela é o canário de deploy. Duas vezes nesta migração o build do Jekyll venceu a
corrida com o GitHub Actions e substituiu o site inteiro pelo README da raiz.
Um watch na home pega isso em até 3 h em vez de "quando alguém reparar".

`advocacia-imobiliaria` ficou de fora: o teto de 5 URLs já estava cheio.

## Custo

Três baldes independentes:

- **stream SSE** — US$ 0,005 por match entregue, debitado do crédito pré-pago
  (a conta nova ganha US$ 5, ou seja 1.000 matches). Zerou o saldo, `/v1/stream`
  passa a devolver 402.
- **feed do painel** — 200 matches revisáveis/mês, cota própria, não gasta crédito.
- **URL Watch** — 1.000 checks/mês, cota própria.

Criar regra não custa nada. O que consome crédito é deixar o stream aberto.

## Verificado

    GET  /v1/taps       200 · 1 tap                     (chave de gestão)
    GET  /v1/rules      200 · 5 regras                  (token do tap)
    POST /v1/validate   200 · valid=true nas 5          (token do tap)
    GET  /v1/url-watch  200 · 5 watches ativos          (chave de gestão)
    GET  /v1/stream     evento `connected` · 0 matches em 25 s · US$ 0,00

## Uma armadilha da API

`POST /v1/validate` recebe o campo **`query`**. A regra, em `POST /v1/rules`,
recebe **`value`**. Mandar `value` para o `/validate` devolve
`422 The query field is required.` — que é fácil de ler como "consulta inválida"
quando na verdade a consulta nunca chegou a ser avaliada.
