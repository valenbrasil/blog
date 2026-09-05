# -*- coding: utf-8 -*-
"""Grava a legenda de uma imagem, com o estado atual conferido.

Legenda vazia e o unico estado em que a gravacao e permitida: se a imagem ja
tem legenda, alguem a escreveu, e sobrescrever seria perder texto do autor.
"""
import json, sys
sys.path.insert(0, '/tmp/dens')
import sanity


def aplicar(plano, seco=False):
    slug = plano['slug']
    doc = sanity.q('*[_type == "post" && slug.current == $slug][0]{_id, _rev, body}', slug=slug)
    assert doc, f'{slug}: nao encontrado'
    body = doc['body']
    porchave = {b.get('_key'): b for b in body}
    patches = {}
    for op in plano['legendas']:
        b = porchave.get(op['key'])
        assert b is not None, f"{slug}: imagem {op['key']} nao existe"
        assert b.get('_type') == 'image', f"{slug}: {op['key']} nao e imagem"
        atual = (b.get('caption') or '').strip()
        assert not atual, f"{slug}: {op['key']} ja tem legenda -> {atual!r}"
        assert (b.get('alt') or '').strip() == op['alt'].strip(), (
            f"{slug}: o alt de {op['key']} mudou desde o plano")
        texto = op['legenda'].strip()
        assert 25 <= len(texto) <= 220, f'{slug}: legenda com {len(texto)} chars'
        i = body.index(b)
        patches[f'body[{i}].caption'] = texto
    assert patches, f'{slug}: nada a gravar'
    if seco:
        return {'slug': slug, 'seco': True, 'legendas': len(patches)}
    sanity.mutate([{'patch': {'id': doc['_id'], 'ifRevisionID': doc['_rev'], 'set': patches}}])
    return {'slug': slug, 'legendas': len(patches)}


if __name__ == '__main__':
    seco = '--seco' in sys.argv
    for p in json.load(open(sys.argv[1], encoding='utf-8')):
        try:
            print(json.dumps(aplicar(p, seco), ensure_ascii=False))
        except AssertionError as e:
            print(json.dumps({'slug': p.get('slug'), 'erro': str(e)}, ensure_ascii=False))
