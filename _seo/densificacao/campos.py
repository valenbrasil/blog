# -*- coding: utf-8 -*-
"""Troca campos do documento (title, excerpt, seo) com o valor atual conferido.

Titulo e resumo nao sao blocos do corpo, entao nem o aplica.py nem o
cirurgia.py os alcancam. Mesma regra dos dois: o plano carrega o valor atual e
a troca so acontece se ele bater -- se alguem editou no Sanity desde que o
plano foi feito, nada e gravado.
"""
import json, sys
sys.path.insert(0, '/tmp/dens')
import sanity

# seo.metaTitle e seo.metaDescription tem precedencia sobre title e excerpt no
# generateMetadata -- sao eles que viram <title> e <meta description>. Trocar so
# o title deixaria a mudanca invisivel para o Google.
CAMPOS = {'title', 'excerpt', 'seo.metaTitle', 'seo.metaDescription'}


def aplicar(plano, seco=False):
    slug = plano['slug']
    doc = sanity.q(
        '*[_type == "post" && slug.current == $slug][0]{_id, _rev, title, excerpt, seo}',
        slug=slug)
    assert doc, f'{slug}: nao encontrado'
    patch = {}
    for campo, valores in plano['campos'].items():
        assert campo in CAMPOS, f'campo nao permitido: {campo}'
        if '.' in campo:
            pai, filho = campo.split('.', 1)
            atual = ((doc.get(pai) or {}).get(filho) or '').strip()
        else:
            atual = (doc.get(campo) or '').strip()
        assert atual == valores['de'].strip(), (
            f'{slug}.{campo} mudou desde o plano:\n  no Sanity: {atual!r}\n  no plano : {valores["de"]!r}')
        patch[campo] = valores['para']
    assert patch, f'{slug}: nada a trocar'
    if seco:
        return {'slug': slug, 'seco': True, 'campos': list(patch)}
    sanity.mutate([{'patch': {'id': doc['_id'], 'ifRevisionID': doc['_rev'], 'set': patch}}])
    return {'slug': slug, 'campos': list(patch)}


if __name__ == '__main__':
    seco = '--seco' in sys.argv
    for p in json.load(open(sys.argv[1], encoding='utf-8')):
        try:
            print(json.dumps(aplicar(p, seco), ensure_ascii=False))
        except AssertionError as e:
            print(json.dumps({'slug': p.get('slug'), 'erro': str(e)}, ensure_ascii=False))
