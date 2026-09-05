# Densificação de links externos — onde parou

Retrato de 05/09/2026 16:26 UTC. Gerado por
`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.

| Estado | Artigos | O que fazer |
|---|---:|---|
| aplicado | 30 | nada, já está no ar |
| aprovado | 8 | gravar com `aplica.py` |
| sem_revisao | 11 | **não gravar** — falta o cético |
| em_voo | 0 | reenfileirar: o lote rodou e não devolveu plano |
| na_fila | 157 | nunca entrou em lote |

## Como retomar

Os planos redigidos estão em `/tmp/dens/planos/<slug>.json`, cada um com o
plano e o veredito do cético quando houve. O cache do workflow guarda os
agentes que **terminaram**; agente que morreu no limite não é cacheado e roda
de novo. Retomar um lote:

```
Workflow({scriptPath: ".../densificar-links-externos-wf_a0b9fc3c-37f.js",
          resumeFromRunId: "<run id do lote>", args: [<slugs do lote>]})
```

## Artigos com plano pronto

| Artigo | Estado | Links previstos | Operações | Reprovadas |
|---|---|---:|---:|---:|
| `avaliacao-de-marcas` | aprovado | 13 | 12 | 1 |
| `balneario-camboriu` | aprovado | 13 | 13 | 1 |
| `bravissima-private-residence` | aprovado | 14 | 9 | 2 |
| `construindo-com-steel-frame` | aprovado | 14 | 14 | 0 |
| `divorcio-com-partilha-de-bens` | aprovado | 12 | 11 | 0 |
| `especulacao-imobiliaria` | aprovado | 11 | 10 | 0 |
| `itajai` | aprovado | 14 | 13 | 1 |
| `leasing` | aprovado | 12 | 11 | 2 |
| `arquitetura-vernacular` | sem_revisao | 13 | 13 | 0 |
| `art-deco-nouveau-crafts-diferencas` | sem_revisao | 13 | 18 | 0 |
| `biografia-kengo-kuma` | sem_revisao | 15 | 14 | 0 |
| `biografia-mackintosh` | sem_revisao | 14 | 15 | 0 |
| `brava-home-resort` | sem_revisao | 14 | 9 | 0 |
| `golf-club-brasil` | sem_revisao | 16 | 11 | 0 |
| `investimento-liquidez` | sem_revisao | 14 | 10 | 0 |
| `novo-parque-de-valencia` | sem_revisao | 13 | 12 | 0 |
| `parklets` | sem_revisao | 13 | 9 | 0 |
| `teorias-restauracao-patrimonio-arquitetonico` | sem_revisao | 13 | 6 | 0 |
| `viaje-na-arquitetura-de-budapeste` | sem_revisao | 15 | 17 | 0 |

## Fila

Ordem: menos links primeiro, artigo maior primeiro dentro de cada faixa.

157 artigos. Slugs em `/tmp/dens/estado.json`.
