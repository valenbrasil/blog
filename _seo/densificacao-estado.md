# Densificação de links externos — onde parou

Retrato de 05/09/2026 20:28 UTC. Gerado por
`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.

| Estado | Artigos | O que fazer |
|---|---:|---|
| aplicado | 54 | nada, já está no ar |
| aprovado | 0 | gravar com `aplica.py` |
| sem_revisao | 0 | **não gravar** — falta o cético |
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

## Fila

Ordem: menos links primeiro, artigo maior primeiro dentro de cada faixa.

152 artigos. Slugs em `/tmp/dens/estado.json`.

## Links mortos — o que era e o que não era

A varredura das 605 URLs externas do HTML gerado devolveu 50 com problema.
Nenhuma delas veio da densificação: todas são de passadas anteriores. Mas a
maioria **não estava morta** — era o ambiente desta sessão que não as alcança.

| URL | Veredito | O que foi feito |
|---|---|---|
| `avaliador.caicba.com.br` | **morta**: o host não resolve em DNS, e o domínio `caicba.com.br` também não | bloco removido — o conteúdo dele *era* o endereço |
| `portalibre.fgv.br/igp` | **viva**: responde 200 no curl com User-Agent de navegador | nada. Eram 10 das 16 ocorrências, e removê-las teria sido o estrago |
| `adobe.com/pt/products/fresco.html#` | inalcançável daqui, mas a Adobe está no ar | `#` solto retirado e caminho corrigido para `/br/` |
| `ufrgs.br`, `ufsj.edu.br`, `siccau.caubr.org.br`, `jardindelturia.com`, `ricardobofill.com` | **não verificáveis daqui** | nada |

Os cinco últimos resolvem DNS e falham na conexão. O log do proxy registra
`connect_rejected` e `ws_closed_mid_exchange` para eles — falha do relay, não
prova de site fora do ar. `adobe.com`, que certamente está no ar, falha do mesmo
jeito. Remover link com base nisso apagaria destino vivo.

**Para fechar isto:** abra os cinco num navegador. O que estiver morto entra num
plano do `cirurgia.py`, que já sabe removê-lo.
