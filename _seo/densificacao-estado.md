# Densificação de links externos — onde parou

Retrato de 06/09/2026 22:48 UTC. Gerado por
`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.

| Estado | Artigos | O que fazer |
|---|---:|---|
| aplicado | 179 | nada, já está no ar |
| aprovado | 2 | gravar com `aplica.py` |
| sem_revisao | 0 | **não gravar** — falta o cético |
| em_voo | 0 | reenfileirar: o lote rodou e não devolveu plano |
| na_fila | 25 | nunca entrou em lote |

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
| `financiamento-imobiliario` | aprovado | 16 | 10 | 3 |
| `propriedade-expropriada` | aprovado | 19 | 14 | 0 |

## Fila

Ordem: menos links primeiro, artigo maior primeiro dentro de cada faixa.

25 artigos. Slugs em `/tmp/dens/estado.json`.

---

## Parada de 06/09/2026 — crédito do autor

Parado no fim do lote V, a pedido. **Nada em voo**: nenhum agente rodando,
nenhum plano pendente de gravação.

### Onde retomar

Faltam **25 artigos**, nos lotes W, X, Y e Z. A fila está em
`_seo/densificacao/fila_serial.json`. Cada lote sai em quatro chamadas de dois
artigos — oito agentes ao todo, um lote por vez:

```
Workflow({scriptPath: "_seo/densificacao/serial.js", args: [<2 slugs>]})   × 4
```

Depois de cada lote: aplicar com `aplica.py`, rodar `estado.py`, commit, push e
`workflow_dispatch` do deploy.

### O que mudou nas ferramentas nesta sessão

- **`aplica.py`** passou a garantir o separador entre o texto do autor e a
  emenda. Sem isso, frase que começa com maiúscula colava no ponto final.
- **`cola.py`** (novo) conserta o que já tinha sido publicado com esse defeito.
  Rodou uma vez: 354 colagens em 65 artigos, todas corrigidas. Um segundo
  ensaio devolve zero. Não precisa rodar de novo, mas é idempotente.

### Pendente, sem nada iniciado

**Linkagem interna.** A regra está escrita em `_seo/linkagem-interna/REGRAS.md`,
com a meta fixada pelo autor: todo artigo recebe pelo menos 2 links internos, de
artigos diferentes. Medição de 06/09: 68 órfãos, 44 com um só, 180 links a
criar. **Nenhum link interno foi criado.**
