# Densificação de links externos — onde parou

Retrato de 05/09/2026 16:12 UTC. Gerado por
`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.

| Estado | Artigos | O que fazer |
|---|---:|---|
| aplicado | 15 | nada, já está no ar |
| aprovado | 3 | gravar com `aplica.py` |
| sem_revisao | 26 | **não gravar** — falta o cético |
| em_voo | 0 | reenfileirar: o lote rodou e não devolveu plano |
| na_fila | 162 | nunca entrou em lote |

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
| `o-impacto-da-arquitetura-imobiliaria-no-mercado-contemporaneo` | aprovado | 16 | 13 | 0 |
| `usucapiao` | aprovado | 13 | 15 | 2 |
| `viaje-na-arquitetura-de-viena-na-austria` | aprovado | 15 | 15 | 4 |
| `arquitetura-vernacular` | sem_revisao | 13 | 13 | 0 |
| `art-deco-nouveau-crafts-diferencas` | sem_revisao | 13 | 18 | 0 |
| `avaliacao-de-empresa-guia-completo` | sem_revisao | 14 | 14 | 0 |
| `avaliacao-de-marcas` | sem_revisao | 13 | 12 | 0 |
| `bens-intangivel-definicao` | sem_revisao | 12 | 10 | 0 |
| `biografia-kengo-kuma` | sem_revisao | 15 | 14 | 0 |
| `biografia-mackintosh` | sem_revisao | 14 | 15 | 0 |
| `blumenau-e-mercado-imobiliario` | sem_revisao | 16 | 13 | 0 |
| `brava-home-resort` | sem_revisao | 14 | 9 | 0 |
| `construindo-com-steel-frame` | sem_revisao | 14 | 14 | 0 |
| `descubra-bombinhas` | sem_revisao | 17 | 19 | 0 |
| `escritura-publica` | sem_revisao | 13 | 11 | 0 |
| `especulacao-imobiliaria` | sem_revisao | 11 | 10 | 0 |
| `fotografia-imobiliaria` | sem_revisao | 12 | 8 | 0 |
| `golf-club-brasil` | sem_revisao | 16 | 11 | 0 |
| `heranca` | sem_revisao | 17 | 13 | 0 |
| `investimento-liquidez` | sem_revisao | 14 | 10 | 0 |
| `itajai` | sem_revisao | 14 | 13 | 0 |
| `leasing` | sem_revisao | 12 | 11 | 0 |
| `novo-parque-de-valencia` | sem_revisao | 13 | 12 | 0 |
| `parklets` | sem_revisao | 13 | 9 | 0 |
| `predios-mais-altos-brasil` | sem_revisao | 14 | 14 | 0 |
| `processo-de-desapropriacao-de-imoveis` | sem_revisao | 13 | 8 | 0 |
| `teorias-restauracao-patrimonio-arquitetonico` | sem_revisao | 13 | 6 | 0 |
| `viaje-na-arquitetura-de-budapeste` | sem_revisao | 15 | 17 | 0 |
| `wood-frame` | sem_revisao | 16 | 9 | 0 |

## Fila

Ordem: menos links primeiro, artigo maior primeiro dentro de cada faixa.

162 artigos. Slugs em `/tmp/dens/estado.json`.

## Lotes E e F, pausados em 05/09/2026 16:09 UTC

Pausados a pedido, com `TaskStop`. Onze planos ficaram em cache e voltam de
graça no `resume`; nenhum passou pelo cético, então **nenhum deles pode ser
gravado como está**.

| Lote | Run ID | Em cache | Falta |
|---|---|---|---|
| E | `wf_d6e7fbaf-92e` | 6 planos, 0 vereditos | 2 planos + 8 céticos |
| F | `wf_8d304b83-4de` | 5 planos, 0 vereditos | 3 planos + 8 céticos |

Retomar exatamente como estavam:

```
Workflow({scriptPath: "/root/.claude/projects/-home-user-blog/ac83eda4-b0e1-54af-8989-1bf15598f7d8/workflows/scripts/densificar-links-externos-wf_a0b9fc3c-37f.js",
          resumeFromRunId: "wf_d6e7fbaf-92e",
          args: ["brava-home-resort","investimento-liquidez","golf-club-brasil","novo-parque-de-valencia","viaje-na-arquitetura-de-budapeste","arquitetura-vernacular","arquitetura-sustentavel-na-pratica","explorando-belfast"]})

Workflow({scriptPath: "/root/.claude/projects/-home-user-blog/ac83eda4-b0e1-54af-8989-1bf15598f7d8/workflows/scripts/densificar-links-externos-wf_a0b9fc3c-37f.js",
          resumeFromRunId: "wf_8d304b83-4de",
          args: ["teorias-restauracao-patrimonio-arquitetonico","art-deco-nouveau-crafts-diferencas","biografia-mackintosh","parklets","biografia-kengo-kuma","biografia-lina-bo-bardi","arquitetura-vitoriana-e-eduardiana","a-influencia-do-jardim-sensorial-na-experiencia-humana"]})
```

O `args` tem de ser idêntico: o cache casa pelo par (prompt, opções), e o prompt
carrega o slug. Lista diferente, cache perdido.
