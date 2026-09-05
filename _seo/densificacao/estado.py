# -*- coding: utf-8 -*-
"""Fotografa onde a densificacao parou, para retomar depois sem perder nada.

Le os diarios de todos os workflows, junta com o inventario do acervo e escreve:

  /tmp/dens/estado.json                 estado por artigo, para maquina
  /home/user/blog/_seo/densificacao-estado.md   o mesmo, legivel

Nao chama a API, nao gasta agente e pode rodar a qualquer momento, inclusive
com workflow no meio do caminho. Roda de novo depois e o retrato se atualiza.

Estados de um artigo:
  aplicado    ja gravado no Sanity (contado pelo inventario, atualizado por dump.py)
  aprovado    plano redigido E revisado pelo cetico -> pronto para gravar
  sem_revisao plano redigido, cetico nao rodou -> NAO gravar
  em_voo      esta num lote que rodou mas nao devolveu plano
  na_fila     nunca entrou em lote
"""
import glob, json, os, sys, time

WF = '/root/.claude/projects/-home-user-blog/ac83eda4-b0e1-54af-8989-1bf15598f7d8/subagents/workflows'
INV = '/tmp/dens/inventario.json'
PLANOS = '/tmp/dens/planos'


def varrer():
    """Junta o ultimo plano e o ultimo veredito de cada slug, de todos os lotes."""
    planos, vereditos, lotes = {}, {}, {}
    for j in sorted(glob.glob(f'{WF}/*/journal.jsonl'), key=os.path.getmtime):
        wf = j.split('/')[-2]
        for linha in open(j, errors='replace'):
            try:
                d = json.loads(linha)
            except Exception:
                continue
            r = d.get('result')
            if not isinstance(r, dict) or 'slug' not in r:
                continue
            slug = r['slug']
            lotes.setdefault(slug, wf)
            if 'ancoras' in r:
                planos[slug] = {'wf': wf, 'plano': r}
            elif 'reprovadas' in r:
                vereditos[slug] = {'wf': wf, 'veredito': r}
    return planos, vereditos, lotes


def main():
    planos, vereditos, lotes = varrer()
    # o que o aplica.py realmente gravou, anotado por ele a cada gravacao
    try:
        gravados = set(json.load(open('/tmp/dens/aplicados.json', encoding='utf-8')))
    except Exception:
        gravados = set()
    inv = {r['slug']: r for r in json.load(open(INV, encoding='utf-8'))}

    estado = {}
    for slug, r in inv.items():
        # 'aplicado' vem do registro do que o aplica.py gravou, nao da contagem
        # de links: um artigo densificado que ficou abaixo de 10 por honestidade
        # -- porque o assunto nao comportava dez fontes de verdade -- continua
        # aplicado, e inferir pelo numero o mostrava como pendente.
        # A contagem entra so para os que ja estavam na faixa antes disto tudo.
        if slug in gravados or r['ext'] >= 10:
            e = 'aplicado'
        elif slug in planos and slug in vereditos:
            e = 'aprovado'
        elif slug in planos:
            e = 'sem_revisao'
        elif slug in lotes:
            e = 'em_voo'
        else:
            e = 'na_fila'
        p = planos.get(slug, {}).get('plano')
        v = vereditos.get(slug, {}).get('veredito')
        estado[slug] = {
            'estado': e,
            'lote': lotes.get(slug),
            'ext_hoje': r['ext'],
            'palavras': r['palavras'],
            'categorias': r['categorias'],
            'links_previstos': (p or {}).get('links_finais'),
            'nao_alcancou': (p or {}).get('nao_alcancou') or '',
            'reprovadas': len((v or {}).get('reprovadas') or []),
            'operacoes': (len((p or {}).get('ancoras') or []) +
                          len((p or {}).get('emendas') or []) +
                          len((p or {}).get('acrescimos') or [])) if p else 0,
        }

    os.makedirs(PLANOS, exist_ok=True)
    for slug, d in planos.items():
        json.dump({'plano': d['plano'], 'veredito': vereditos.get(slug, {}).get('veredito')},
                  open(f'{PLANOS}/{slug}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    json.dump({'quando': time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime()),
               'artigos': estado}, open('/tmp/dens/estado.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)

    contagem = {}
    for d in estado.values():
        contagem[d['estado']] = contagem.get(d['estado'], 0) + 1

    linhas = ['# Densificação de links externos — onde parou', '',
              f'Retrato de {time.strftime("%d/%m/%Y %H:%M", time.gmtime())} UTC. Gerado por',
              '`/tmp/dens/estado.py`, que só lê arquivo — não chama a API nem gasta agente.', '',
              '| Estado | Artigos | O que fazer |', '|---|---:|---|',
              f'| aplicado | {contagem.get("aplicado",0)} | nada, já está no ar |',
              f'| aprovado | {contagem.get("aprovado",0)} | gravar com `aplica.py` |',
              f'| sem_revisao | {contagem.get("sem_revisao",0)} | **não gravar** — falta o cético |',
              f'| em_voo | {contagem.get("em_voo",0)} | reenfileirar: o lote rodou e não devolveu plano |',
              f'| na_fila | {contagem.get("na_fila",0)} | nunca entrou em lote |', '',
              '## Como retomar', '',
              'Os planos redigidos estão em `/tmp/dens/planos/<slug>.json`, cada um com o',
              'plano e o veredito do cético quando houve. O cache do workflow guarda os',
              'agentes que **terminaram**; agente que morreu no limite não é cacheado e roda',
              'de novo. Retomar um lote:', '',
              '```',
              'Workflow({scriptPath: ".../densificar-links-externos-wf_a0b9fc3c-37f.js",',
              '          resumeFromRunId: "<run id do lote>", args: [<slugs do lote>]})',
              '```', '',
              '## Artigos com plano pronto', '',
              '| Artigo | Estado | Links previstos | Operações | Reprovadas |',
              '|---|---|---:|---:|---:|']
    for slug, d in sorted(estado.items(), key=lambda kv: (kv[1]['estado'], kv[0])):
        if d['estado'] in ('aprovado', 'sem_revisao'):
            linhas.append(f'| `{slug}` | {d["estado"]} | {d["links_previstos"]} | '
                          f'{d["operacoes"]} | {d["reprovadas"]} |')
    linhas += ['', '## Fila', '',
               'Ordem: menos links primeiro, artigo maior primeiro dentro de cada faixa.', '']
    fila = [s for s, d in estado.items() if d['estado'] in ('na_fila', 'em_voo')]
    linhas.append(f'{len(fila)} artigos. Slugs em `/tmp/dens/estado.json`.')

    open('/home/user/blog/_seo/densificacao-estado.md', 'w', encoding='utf-8').write(
        '\n'.join(linhas) + '\n')

    print(json.dumps(contagem, ensure_ascii=False))
    print('estado  -> /tmp/dens/estado.json')
    print('planos  -> /tmp/dens/planos/  (%d arquivos)' % len(planos))
    print('legivel -> _seo/densificacao-estado.md')


if __name__ == '__main__':
    main()
