# Densificação de links externos — onde parou

Retrato de 07/09/2026 01:36 UTC. Gerado por
`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.

| Estado | Artigos | O que fazer |
|---|---:|---|
| aplicado | 206 | nada, já está no ar |
| aprovado | 0 | gravar com `aplica.py` |
| sem_revisao | 0 | **não gravar** — falta o cético |
| em_voo | 0 | reenfileirar: o lote rodou e não devolveu plano |
| na_fila | 0 | nunca entrou em lote |

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

0 artigos. Slugs em `/tmp/dens/estado.json`.

---

## Fila encerrada — 07/09/2026

Os **206 artigos** do blog passaram pela densificação. Nada em voo, nada
pendente de gravação, fila vazia.

```
acervo de links externos     490  ->  2.926
artigos aplicados            206 de 206
colagens                     0
```

### Os quatro que ficam abaixo de 10 links, de propósito

| Artigo | Links |
|---|---:|
| `parklets` | 6 |
| `biografia-fran-silvestre` | 8 |
| `novo-parque-de-valencia` | 8 |
| `renderizacao-de-projetos-de-arquitetura` | 9 |

São textos curtos sobre obra recente ou sobre ferramenta comercial, em que
os céticos preferiram o número menor a aprovar fonte que não sustentava a
frase. **Não é pendência**: completar esses quatro exige fonte que hoje não
existe, e link decorativo é pior do que link ausente.

### Ferramentas, como ficaram

- **`aplica.py`** garante o separador entre o texto do autor e a emenda.
- **`cola.py`** lê os planos das duas pastas (`/tmp/dens/` e `/tmp/dens/planos/`)
  e aceita tanto a lista dos lotes antigos quanto o dicionário dos novos.
  Antes varria só a raiz: conferia 73 de 203 artigos e devolvia "zero" como se
  fosse o acervo inteiro. Os **89** de agora são os artigos *em risco* — emenda
  cujo primeiro segmento não começa com espaço, a única que pode colar.
- **`estado.py`** fotografa o estado por artigo sem gastar agente.

### O que continua sem começar

**Linkagem interna.** Regra escrita em `_seo/linkagem-interna/REGRAS.md`, meta
fixada pelo autor: todo artigo recebe pelo menos 2 links internos, de artigos
diferentes. Medição de 06/09: 68 órfãos, 44 com um só, **180 links a criar**.
Nenhum link interno foi criado.
