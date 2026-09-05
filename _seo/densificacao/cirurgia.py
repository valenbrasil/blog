# -*- coding: utf-8 -*-
"""Remocao cirurgica: tira link morto, e so isso.

O aplica.py e aditivo por desenho -- ele se recusa a perder texto do autor.
Isto aqui e o oposto e por isso vem separado, com asserção propria em cada
operacao:

  destroca   tira o link de um trecho, mantendo o texto onde esta. Assere que
             o texto do bloco nao muda e que o markDef sai junto.
  troca_href troca o destino de um link. Assere que o texto nao muda.
  remove     apaga um bloco inteiro. So para bloco cujo conteudo E o endereco
             morto -- deixar o texto sem link ainda manda o leitor a um lugar
             que nao existe. Exige que o texto atual seja passado e confira.

Uso: python3 /tmp/dens/cirurgia.py plano.json [--seco]
"""
import copy, json, sys
sys.path.insert(0, '/tmp/dens')
import sanity


def texto_puro(body):
    return '\n'.join(sanity.texto_do_bloco(b) for b in body if b.get('_type') == 'block')


def op_destroca(body, op):
    b = next((x for x in body if x.get('_key') == op['chave']), None)
    assert b is not None, f"bloco {op['chave']} nao existe"
    antes = sanity.texto_do_bloco(b)
    alvo = [md for md in b.get('markDefs') or []
            if md.get('_type') == 'link' and md.get('href') == op['href']]
    assert alvo, f"nenhum link para {op['href']} no bloco"
    chaves = {md['_key'] for md in alvo}
    b['markDefs'] = [md for md in b['markDefs'] if md['_key'] not in chaves]
    for c in b.get('children') or []:
        c['marks'] = [m for m in (c.get('marks') or []) if m not in chaves]
    assert sanity.texto_do_bloco(b) == antes, 'destroca alterou o texto'


def op_troca_href(body, op):
    b = next((x for x in body if x.get('_key') == op['chave']), None)
    assert b is not None, f"bloco {op['chave']} nao existe"
    antes = sanity.texto_do_bloco(b)
    n = 0
    for md in b.get('markDefs') or []:
        if md.get('_type') == 'link' and md.get('href') == op['de']:
            md['href'] = op['para']
            n += 1
    assert n, f"nenhum link para {op['de']} no bloco"
    assert sanity.texto_do_bloco(b) == antes, 'troca_href alterou o texto'


def op_remove(body, op):
    i = next((k for k, x in enumerate(body) if x.get('_key') == op['chave']), None)
    assert i is not None, f"bloco {op['chave']} nao existe"
    atual = sanity.texto_do_bloco(body[i])
    assert atual.strip() == op['texto'].strip(), (
        f'texto do bloco mudou desde o plano:\n  no Sanity: {atual!r}\n  no plano : {op["texto"]!r}')
    body.pop(i)


OPS = {'destroca': op_destroca, 'troca_href': op_troca_href, 'remove': op_remove}


def aplicar(plano, seco=False):
    slug = plano['slug']
    doc = sanity.q('*[_type == "post" && slug.current == $slug][0]{_id, _rev, body}', slug=slug)
    assert doc, f'{slug}: nao encontrado'
    body = copy.deepcopy(doc['body'])
    antes = texto_puro(body)
    for op in plano['operacoes']:
        OPS[op['op']](body, op)
    depois = texto_puro(body)
    removidas = [l for l in antes.split('\n') if l not in depois.split('\n')]
    esperadas = [op['texto'].strip() for op in plano['operacoes'] if op['op'] == 'remove']
    assert sorted(x.strip() for x in removidas) == sorted(esperadas), (
        f'{slug}: sumiu texto que nao estava no plano -> {removidas}')
    if seco:
        return {'slug': slug, 'seco': True, 'blocos': f'{len(doc["body"])} -> {len(body)}',
                'linhas_removidas': removidas}
    sanity.mutate([{'patch': {'id': doc['_id'], 'ifRevisionID': doc['_rev'],
                              'set': {'body': body}}}])
    return {'slug': slug, 'blocos': f'{len(doc["body"])} -> {len(body)}',
            'linhas_removidas': removidas}


if __name__ == '__main__':
    seco = '--seco' in sys.argv
    for p in json.load(open(sys.argv[1], encoding='utf-8')):
        try:
            print(json.dumps(aplicar(p, seco), ensure_ascii=False))
        except AssertionError as e:
            print(json.dumps({'slug': p.get('slug'), 'erro': str(e)}, ensure_ascii=False))
