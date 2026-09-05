# Densificação de links externos — onde parou

Retrato de 05/09/2026 18:14 UTC. Gerado por
`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.

| Estado | Artigos | O que fazer |
|---|---:|---|
| aplicado | 45 | nada, já está no ar |
| aprovado | 6 | gravar com `aplica.py` |
| sem_revisao | 3 | **não gravar** — falta o cético |
| em_voo | 0 | reenfileirar: o lote rodou e não devolveu plano |
| na_fila | 152 | nunca entrou em lote |

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
| `art-deco-nouveau-crafts-diferencas` | aprovado | 13 | 18 | 1 |
| `biografia-kengo-kuma` | aprovado | 15 | 14 | 2 |
| `biografia-mackintosh` | aprovado | 14 | 15 | 1 |
| `novo-parque-de-valencia` | aprovado | 13 | 12 | 3 |
| `parklets` | aprovado | 13 | 9 | 4 |
| `teorias-restauracao-patrimonio-arquitetonico` | aprovado | 13 | 6 | 1 |
| `a-influencia-do-jardim-sensorial-na-experiencia-humana` | sem_revisao | 13 | 10 | 0 |
| `arquitetura-vitoriana-e-eduardiana` | sem_revisao | 14 | 13 | 0 |
| `biografia-lina-bo-bardi` | sem_revisao | 14 | 13 | 0 |

## Fila

Ordem: menos links primeiro, artigo maior primeiro dentro de cada faixa.

152 artigos. Slugs em `/tmp/dens/estado.json`.
