# Densificação de links externos — onde parou

Retrato de 06/09/2026 19:03 UTC. Gerado por
`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.

| Estado | Artigos | O que fazer |
|---|---:|---|
| aplicado | 101 | nada, já está no ar |
| aprovado | 0 | gravar com `aplica.py` |
| sem_revisao | 0 | **não gravar** — falta o cético |
| em_voo | 0 | reenfileirar: o lote rodou e não devolveu plano |
| na_fila | 105 | nunca entrou em lote |

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

## Fila

Ordem: menos links primeiro, artigo maior primeiro dentro de cada faixa.

105 artigos. Slugs em `/tmp/dens/estado.json`.
