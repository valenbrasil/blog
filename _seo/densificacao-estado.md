# Densificação de links externos — onde parou

Retrato de 05/09/2026 23:31 UTC. Gerado por
`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.

| Estado | Artigos | O que fazer |
|---|---:|---|
| aplicado | 69 | nada, já está no ar |
| aprovado | 4 | gravar com `aplica.py` |
| sem_revisao | 4 | **não gravar** — falta o cético |
| em_voo | 0 | reenfileirar: o lote rodou e não devolveu plano |
| na_fila | 129 | nunca entrou em lote |

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
| `app-area-de-preservacao-permanente` | aprovado | 16 | 11 | 2 |
| `isencao-itbi` | aprovado | 16 | 15 | 1 |
| `parque-turia` | aprovado | 13 | 13 | 0 |
| `sinduscon` | aprovado | 19 | 16 | 0 |
| `comodato` | sem_revisao | 13 | 10 | 0 |
| `direito-civil` | sem_revisao | 18 | 12 | 0 |
| `ranking-metro-quadrado-mais-caro-do-brasil` | sem_revisao | 18 | 13 | 0 |
| `valores-mobiliarios` | sem_revisao | 15 | 12 | 0 |

## Fila

Ordem: menos links primeiro, artigo maior primeiro dentro de cada faixa.

129 artigos. Slugs em `/tmp/dens/estado.json`.
