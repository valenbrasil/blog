# -*- coding: utf-8 -*-
"""Aplica a densificacao no Sanity. So faz operacao aditiva.

Tres operacoes, todas incapazes de apagar texto do autor:

  ancorar     poe link sobre um trecho que JA existe. Nada de texto muda:
              o span e partido em tres e o do meio recebe a marca de link.
  emendar     acrescenta frases ao FIM de um bloco existente. Os filhos
              originais ficam intactos; os novos entram depois.
  acrescentar insere blocos novos DEPOIS de um bloco existente.

Toda gravacao passa por asserção: o texto puro do artigo depois da operacao tem
de conter, na mesma ordem, todo o texto que havia antes. Se um caractere do
autor sumir, nada e gravado.

Uso:  python3 /tmp/dens/aplica.py plano.json [--seco]
"""
import copy, json, re, sys, uuid
sys.path.insert(0, '/tmp/dens')
import sanity


def nova_chave(prefixo='d'):
    return f'{prefixo}{uuid.uuid4().hex[:10]}'


def texto_puro(body):
    return '\n'.join(sanity.texto_do_bloco(b) for b in body if b.get('_type') == 'block')


def _spans_de(segmentos, mark_defs):
    """Constroi children a partir de [{'t': 'texto', 'href': opcional}]."""
    filhos = []
    for seg in segmentos:
        texto = seg['t']
        if not texto:
            continue
        marcas = list(seg.get('marks') or [])
        if seg.get('href'):
            k = nova_chave('L')
            mark_defs.append({'_type': 'link', '_key': k, 'href': seg['href']})
            marcas.append(k)
        filhos.append({'_type': 'span', '_key': nova_chave('s'), 'text': texto, 'marks': marcas})
    return filhos


def op_ancorar(body, op):
    """Poe link sobre trecho existente. O texto do bloco nao muda."""
    bloco = next((b for b in body if b.get('_key') == op['chave']), None)
    assert bloco is not None, f"bloco {op['chave']} nao existe"
    ancora, href = op['ancora'], op['href']
    antes = sanity.texto_do_bloco(bloco)
    assert antes.count(ancora) >= 1, f"ancora {ancora!r} nao esta no bloco"

    # a ancora tem de caber inteira dentro de UM span sem link
    alvo = None
    for idx, c in enumerate(bloco.get('children') or []):
        if c.get('_type') != 'span' or ancora not in c.get('text', ''):
            continue
        tem_link = any(
            md.get('_key') in (c.get('marks') or []) and md.get('_type') == 'link'
            for md in bloco.get('markDefs') or [])
        if tem_link:
            continue
        alvo = idx
        break
    assert alvo is not None, f"ancora {ancora!r} nao cabe num span livre de link"

    span = bloco['children'][alvo]
    i = span['text'].index(ancora)
    esq, meio, dir_ = span['text'][:i], ancora, span['text'][i + len(ancora):]
    marcas = list(span.get('marks') or [])
    k = nova_chave('L')
    bloco.setdefault('markDefs', []).append({'_type': 'link', '_key': k, 'href': href})

    novos = []
    if esq:
        novos.append({**copy.deepcopy(span), '_key': nova_chave('s'), 'text': esq})
    novos.append({**copy.deepcopy(span), '_key': nova_chave('s'), 'text': meio,
                  'marks': marcas + [k]})
    if dir_:
        novos.append({**copy.deepcopy(span), '_key': nova_chave('s'), 'text': dir_})
    bloco['children'][alvo:alvo + 1] = novos
    assert sanity.texto_do_bloco(bloco) == antes, 'ancorar mudou o texto do bloco'


def op_emendar(body, op):
    """Acrescenta segmentos ao fim de um bloco. Nada existente e tocado."""
    bloco = next((b for b in body if b.get('_key') == op['chave']), None)
    assert bloco is not None, f"bloco {op['chave']} nao existe"
    antes = sanity.texto_do_bloco(bloco)
    mds = bloco.setdefault('markDefs', [])
    bloco['children'] = (bloco.get('children') or []) + _spans_de(op['segmentos'], mds)
    depois = sanity.texto_do_bloco(bloco)
    assert depois.startswith(antes), 'emendar alterou o inicio do bloco'
    assert len(depois) > len(antes), 'emendar nao acrescentou nada'


def op_acrescentar(body, op):
    """Insere blocos novos depois do bloco de referencia."""
    pos = next((i for i, b in enumerate(body) if b.get('_key') == op['depois_de']), None)
    assert pos is not None, f"bloco {op['depois_de']} nao existe"
    novos = []
    for nb in op['blocos']:
        mds = []
        filhos = _spans_de(nb['segmentos'], mds)
        assert filhos, 'bloco novo sem texto'
        b = {'_type': 'block', '_key': nova_chave('b'), 'style': nb.get('estilo', 'normal'),
             'markDefs': mds, 'children': filhos}
        if nb.get('lista'):
            b['listItem'] = 'bullet'
            b['level'] = 1
        novos.append(b)
    body[pos + 1:pos + 1] = novos


OPS = {'ancorar': op_ancorar, 'emendar': op_emendar, 'acrescentar': op_acrescentar}


def aplicar(plano, seco=False):
    slug = plano['slug']
    doc = sanity.q('*[_type == "post" && slug.current == $slug][0]{_id, _rev, body}', slug=slug)
    assert doc, f'{slug}: artigo nao encontrado'
    body = copy.deepcopy(doc['body'])
    antes = texto_puro(body)

    for op in plano['operacoes']:
        OPS[op['op']](body, op)

    depois = texto_puro(body)
    # nenhuma letra do autor pode ter sumido: o texto de antes tem de aparecer
    # inteiro, em ordem, dentro do de depois
    i = 0
    for linha in antes.split('\n'):
        j = depois.find(linha, i)
        assert j >= 0, f'{slug}: paragrafo perdido -> {linha[:70]!r}'
        i = j + len(linha)

    # chaves de span unicas dentro de cada bloco (a regra do Portable Text)
    for b in body:
        if b.get('_type') != 'block':
            continue
        ks = [c.get('_key') for c in b.get('children') or []]
        assert len(ks) == len(set(ks)), f'{slug}: chave de span repetida no bloco {b.get("_key")}'
        usados = {m for c in b.get('children') or [] for m in (c.get('marks') or [])}
        for md in b.get('markDefs') or []:
            assert md['_key'] in usados, f'{slug}: markDef orfao {md["_key"]}'

    novos_links = _conta_externos(body) - _conta_externos(doc['body'])
    if seco:
        return {'slug': slug, 'seco': True, 'novos_links': novos_links,
                'palavras_antes': len(antes.split()), 'palavras_depois': len(depois.split())}

    sanity.mutate([{'patch': {'id': doc['_id'], 'ifRevisionID': doc['_rev'],
                              'set': {'body': body}}}])
    # registra a gravacao. Inferir "aplicado" pela contagem de links mente sobre
    # o artigo que foi densificado e ficou abaixo de 10 por honestidade.
    reg = '/tmp/dens/aplicados.json'
    try:
        feitos = set(json.load(open(reg, encoding='utf-8')))
    except Exception:
        feitos = set()
    feitos.add(slug)
    json.dump(sorted(feitos), open(reg, 'w', encoding='utf-8'), ensure_ascii=False)
    return {'slug': slug, 'novos_links': novos_links,
            'palavras_antes': len(antes.split()), 'palavras_depois': len(depois.split())}


def _conta_externos(body):
    n = 0
    for b in body:
        for md in b.get('markDefs') or []:
            h = md.get('href') or ''
            if h.startswith('http') and 'valenbrasil.com' not in h and 'wa.me' not in h:
                n += 1
    return n


if __name__ == '__main__':
    seco = '--seco' in sys.argv
    planos = json.load(open(sys.argv[1], encoding='utf-8'))
    if isinstance(planos, dict):
        planos = [planos]
    for p in planos:
        try:
            print(json.dumps(aplicar(p, seco), ensure_ascii=False))
        except AssertionError as e:
            print(json.dumps({'slug': p.get('slug'), 'erro': str(e)}, ensure_ascii=False))
