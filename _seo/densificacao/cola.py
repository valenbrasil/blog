# -*- coding: utf-8 -*-
"""Conserta as colagens que a densificacao deixou.

O aplicador antigo concatenava os spans do Portable Text sem separador. Quando
uma emenda comecava com maiuscula e o bloco terminava em ponto, a frase colava:
"Doacao).Os 27,5%". A causa ja esta corrigida em aplica.py; isto arruma o que
foi publicado antes.

METODO. Nao adivinha pelo texto: le os planos ja aplicados, que registram
exatamente qual bloco recebeu emenda e com que texto ela comecava. Assim so se
mexe em span que a densificacao criou -- nunca no do autor.

GARANTIA. Antes de gravar, confere que o texto novo do bloco e exatamente o
antigo com um espaco inserido na fronteira. Se sobrar ou faltar qualquer outro
caractere, nao grava nada do artigo.

Uso:  python3 /tmp/dens/cola.py [--seco]
"""
import glob, json, sys
sys.path.insert(0, '/tmp/dens')
import sanity

SECO = '--seco' in sys.argv


def emendas_aplicadas():
    """(slug, chave do bloco, texto do 1o segmento) de toda emenda gravada."""
    fora = set()
    try:
        fora = set()  # todos os planos em *.plano.json foram aplicados
    except Exception:
        pass
    vistos, saida = set(), []
    for f in sorted(glob.glob('/tmp/dens/*.plano.json')):
        try:
            d = json.load(open(f, encoding='utf-8'))
        except Exception:
            continue
        if not isinstance(d, list):
            continue
        for art in d:
            slug = art.get('slug')
            for op in (art.get('operacoes') or []):
                if op.get('op') != 'emendar':
                    continue
                segs = op.get('segmentos') or []
                if not segs:
                    continue
                t0 = segs[0].get('t', '')
                if not t0 or t0[0].isspace():
                    continue
                ch = (slug, op.get('chave'), t0)
                if ch in vistos:
                    continue
                vistos.add(ch)
                saida.append(ch)
    return saida


def conserta_bloco(bloco, inicio):
    """Poe o espaco no span que comeca com `inicio`, se ele estiver colado.

    Devolve (mudou, posicao) para a assercao do chamador.
    """
    filhos = bloco.get('children') or []
    for i, c in enumerate(filhos):
        if c.get('_type') != 'span':
            continue
        t = c.get('t') if 't' in c else c.get('text', '')
        if not t.startswith(inicio):
            continue
        if i == 0:
            return False, -1                      # nada antes: nao ha colagem
        ant = filhos[i - 1]
        ta = ant.get('t') if 't' in ant else ant.get('text', '')
        if not ta or ta[-1].isspace():
            return False, -1                      # ja tem separador
        pos = sum(len((x.get('t') if 't' in x else x.get('text', '')) or '')
                  for x in filhos[:i])
        if 'text' in c:
            c['text'] = ' ' + t
        else:
            c['t'] = ' ' + t
        return True, pos
    return False, -1


def main():
    alvos = {}
    for slug, chave, t0 in emendas_aplicadas():
        alvos.setdefault(slug, []).append((chave, t0))
    print(f'artigos com emenda registrada: {len(alvos)}')

    tot_art = tot_col = 0
    for slug in sorted(alvos):
        doc = sanity.q('*[_type=="post" && slug.current==$s][0]{_id,_rev,body}', s=slug)
        if not doc:
            print(f'  {slug}: NAO ENCONTRADO'); continue
        body = json.loads(json.dumps(doc['body']))          # copia
        antes = {b.get('_key'): sanity.texto_do_bloco(b)
                 for b in body if b.get('_type') == 'block'}
        n = 0
        for chave, t0 in alvos[slug]:
            bloco = next((b for b in body if b.get('_key') == chave), None)
            if bloco is None:
                continue
            mudou, pos = conserta_bloco(bloco, t0)
            if mudou:
                n += 1
                novo = sanity.texto_do_bloco(bloco)
                velho = antes[chave]
                esperado = velho[:pos] + ' ' + velho[pos:]
                assert novo == esperado, f'{slug}/{chave}: mudanca inesperada'
                antes[chave] = novo
        if not n:
            continue
        tot_art += 1; tot_col += n
        print(f'  {slug:52s} {n:3d} colagem(ns)')
        if not SECO:
            sanity.mutate([{'patch': {'id': doc['_id'], 'ifRevisionID': doc['_rev'],
                                      'set': {'body': body}}}])
    print(f'\n{"ENSAIO" if SECO else "GRAVADO"}: {tot_col} colagens em {tot_art} artigos')


if __name__ == '__main__':
    main()
