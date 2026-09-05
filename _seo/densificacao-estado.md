# Densificação de links externos — onde parou

Retrato de 05/09/2026 16:01 UTC. Gerado por
`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.

| Estado | Artigos | O que fazer |
|---|---:|---|
| aplicado | 7 | nada, já está no ar |
| aprovado | 6 | gravar com `aplica.py` |
| sem_revisao | 14 | **não gravar** — falta o cético |
| em_voo | 0 | reenfileirar: o lote rodou e não devolveu plano |
| na_fila | 179 | nunca entrou em lote |

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
| `arquitetura-e-igreja` | aprovado | 19 | 8 | 2 |
| `cisao-empresarial` | aprovado | 16 | 10 | 0 |
| `concursos-academicos-de-arquitetura` | aprovado | 14 | 14 | 1 |
| `consorcio-financiamento` | aprovado | 14 | 8 | 2 |
| `juros-de-financiamento-imobiliario` | aprovado | 18 | 12 | 2 |
| `refinanciamento-imobiliario` | aprovado | 14 | 11 | 0 |
| `art-deco-nouveau-crafts-diferencas` | sem_revisao | 13 | 18 | 0 |
| `avaliacao-de-marcas` | sem_revisao | 13 | 12 | 0 |
| `brava-home-resort` | sem_revisao | 14 | 9 | 0 |
| `cidade-das-artes-e-das-ciencias-cultura-e-inovacao` | sem_revisao | 17 | 15 | 0 |
| `construtora-incorporadora` | sem_revisao | 14 | 10 | 0 |
| `escritura-publica` | sem_revisao | 13 | 11 | 0 |
| `fotografia-imobiliaria` | sem_revisao | 12 | 8 | 0 |
| `investimento-liquidez` | sem_revisao | 14 | 10 | 0 |
| `itajai` | sem_revisao | 14 | 13 | 0 |
| `o-impacto-da-arquitetura-imobiliaria-no-mercado-contemporaneo` | sem_revisao | 16 | 13 | 0 |
| `predios-mais-altos-brasil` | sem_revisao | 14 | 14 | 0 |
| `teorias-restauracao-patrimonio-arquitetonico` | sem_revisao | 13 | 6 | 0 |
| `usucapiao` | sem_revisao | 13 | 15 | 0 |
| `viaje-na-arquitetura-de-viena-na-austria` | sem_revisao | 15 | 15 | 0 |

## Fila

Ordem: menos links primeiro, artigo maior primeiro dentro de cada faixa.

179 artigos. Slugs em `/tmp/dens/estado.json`.
