# -*- coding: utf-8 -*-
"""Indice de ancoras possiveis para os artigos orfaos (Regra 1, entrada zero).

candidatos.py resolve a Regra 2 (saida): olha SO a zona alvo do proprio
artigo, antes do primeiro link externo. Este script resolve a Regra 1
(entrada): parte do ORFAO e varre o corpo INTEIRO dos outros 205 artigos --
zona alvo nao importa aqui, o link novo pode entrar em qualquer bloco de
texto corrido, contanto que a ancora seja honesta.

"O link se descobre, nao se inventa": para cada orfao, procura nos outros
artigos uma frase que JA fala daquele assunto. Onde nao houver, nao ha link.

Nao chama a API, nao gasta agente, roda em segundos.

Uso:  python3 _seo/linkagem-interna/orfaos.py [--dossie <slug>]
"""
import glob
import json
import re
import sys

sys.path.insert(0, '/home/user/blog/_seo/linkagem-interna')
from candidatos import (ARTIGOS, VAZIAS, sem_acento, termos_do_destino,
                        acha_palavra, faixas_com_link, palavras_uteis)

SAIDA = '/home/user/blog/_seo/linkagem-interna/orfaos.json'

# termos_do_destino exige 2+ palavras (pensado pra zona alvo, onde ha muito
# candidato e o risco e casar palavra comum). Aqui o problema e o oposto: boa
# parte dos 49 orfaos tem titulo de 1 palavra distintiva -- "Retrofit",
# "Parklets", "Dreamscapes" -- e essa palavra sozinha, se aparecer em outro
# artigo, e ancora honesta. So exclui o vocabulario generico do imobiliario,
# que apareceria em quase todo artigo e nao identifica nada.
DOMINIO_COMUM = {
    'terreno', 'terrenos', 'renda', 'valor', 'valores', 'valorizacao',
    'investimento', 'investimentos', 'contrato', 'contratos', 'compra',
    'venda', 'aposentadoria', 'vantagens', 'tendencia', 'importancia',
    'oportunidade', 'mercado', 'proprietario', 'proprietarios', 'entenda',
    'como', 'transformar', 'pequenos', 'grandes', 'impactos', 'realidade',
    'morada', 'futuro', 'investindo', 'guia',
}


def termos_amplos(art):
    """Palavras capitalizadas do titulo, com 6+ letras, fora do vocabulario comum."""
    titulo = art.get('titulo') or ''
    bons = set()
    for p in re.findall(r"[A-ZÀ-Ý][a-zà-ÿ]{5,}", titulo):
        base = sem_acento(p)
        if base not in DOMINIO_COMUM and base not in VAZIAS:
            bons.add(p)
    return bons


def main():
    arts = {}
    for f in sorted(glob.glob(ARTIGOS)):
        a = json.load(open(f, encoding='utf-8'))
        arts[a['slug']] = a
    assert arts, 'nenhum artigo em %s -- rode dump.py antes' % ARTIGOS

    entrada = {s: 0 for s in arts}
    for s, a in arts.items():
        vistos = set()
        for b in a['blocos']:
            for l in (b.get('links') or []):
                h = (l.get('href') or '').strip()
                if h.startswith('/'):
                    d = h.strip('/').split('/')[0]
                    if d in arts and d != s:
                        vistos.add(d)
        for d in vistos:
            entrada[d] += 1

    orfaos = sorted(s for s, n in entrada.items() if n == 0)
    faixa_bloco = {s: {b['chave']: faixas_com_link(b) for b in a['blocos']}
                   for s, a in arts.items()}

    saida = {}
    for orf in orfaos:
        art_orf = arts[orf]
        termos = set(termos_do_destino(art_orf)) | termos_amplos(art_orf)
        cats_orf = set(art_orf.get('categorias') or [])
        cand = []
        for fonte, a in arts.items():
            if fonte == orf:
                continue
            mesma_categoria = bool(cats_orf & set(a.get('categorias') or []))
            for b in a['blocos']:
                texto = b.get('texto') or ''
                if not texto or b.get('lista'):
                    # bloco de lista costuma ser "leia tambem" / navegacao --
                    # nao e corpo de texto corrido, nao serve de origem
                    continue
                base = sem_acento(texto)
                for t in termos:
                    p = acha_palavra(base, sem_acento(t))
                    if p < 0:
                        continue
                    literal = texto[p:p + len(t)]
                    if sem_acento(literal) != sem_acento(t):
                        continue
                    if any(ini <= p < fim or ini < p + len(t) <= fim
                           for ini, fim in faixa_bloco[fonte].get(b['chave'], [])):
                        continue
                    cand.append({
                        'fonte': fonte, 'chave': b['chave'], 'bloco': b['i'],
                        'estilo': b.get('estilo'), 'ancora': literal, 'pos': p,
                        'mesma_categoria': mesma_categoria,
                    })
        cand.sort(key=lambda c: (not c['mesma_categoria'], -len(c['ancora']),
                                 c['fonte'], c['bloco']))

        # Reserva, para quando nao ha ancora literal nenhuma: artigos afins por
        # assunto (titulo+resumo), mesmo sem casamento de palavra mecanico.
        # Serve so como ponto de partida pra emendar/acrescentar -- a frase
        # nova tem de se sustentar sozinha como informacao, nunca so pretexto.
        base_orf = palavras_uteis(art_orf.get('titulo'), art_orf.get('resumo'))
        afins = []
        for fonte, a in arts.items():
            if fonte == orf:
                continue
            alvo = palavras_uteis(a.get('titulo'), a.get('resumo'))
            n = len(base_orf & alvo)
            mesma_categoria = bool(cats_orf & set(a.get('categorias') or []))
            if n or mesma_categoria:
                afins.append((mesma_categoria, n, fonte, a.get('titulo')))
        afins.sort(key=lambda x: (-x[0], -x[1]))

        saida[orf] = {
            'titulo': art_orf.get('titulo'),
            'resumo': art_orf.get('resumo'),
            'categorias': art_orf.get('categorias'),
            'candidatos': cand[:15],
            'afins': [{'fonte': f, 'titulo': t, 'mesma_categoria': mc, 'palavras_em_comum': n}
                      for mc, n, f, t in afins[:10]],
        }

    json.dump(saida, open(SAIDA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    sem_candidato = [s for s, v in saida.items() if not v['candidatos']]
    print(json.dumps({
        'orfaos': len(orfaos),
        'com_candidato': len(orfaos) - len(sem_candidato),
        'sem_candidato_nenhum': len(sem_candidato),
    }, ensure_ascii=False))
    print('dossie -> %s' % SAIDA)
    if sem_candidato:
        print('SEM CANDIDATO (nenhuma mencao literal em nenhum outro artigo):')
        for s in sem_candidato:
            print('  ', s)


def dossie(slug):
    d = json.load(open(SAIDA, encoding='utf-8'))
    v = d[slug]
    print('ORFAO: %s' % slug)
    print('TITULO: %s' % v['titulo'])
    print('RESUMO: %s' % v['resumo'])
    print('CATEGORIAS: %s' % v['categorias'])
    print()
    if not v['candidatos']:
        print('NENHUM CANDIDATO LITERAL: nenhuma mencao a este assunto em outro artigo.')
        print('Caminho aqui e emendar/acrescentar -- frase nova, que se sustente sozinha')
        print('como informacao, num artigo afim. NUNCA fabricar pretexto para o link.')
        print()
        print('ARTIGOS AFINS (por assunto; escolha o mais proximo e LEIA o artigo antes):')
        for af in v['afins']:
            print('  /%s/  (%s%s palavra(s) em comum)'
                  % (af['fonte'], 'mesma categoria, ' if af['mesma_categoria'] else '',
                     af['palavras_em_comum']))
            print('      %s' % af['titulo'])
        if not v['afins']:
            print('  (nenhum -- nem categoria nem palavra em comum)')
        return
    print('CANDIDATOS (fonte onde a frase ja existe; mesma_categoria e pista, nao regra):')
    arts_cache = {}
    for c in v['candidatos']:
        fonte = c['fonte']
        if fonte not in arts_cache:
            arts_cache[fonte] = json.load(open('/tmp/dens/artigos/%s.json' % fonte, encoding='utf-8'))
        af = arts_cache[fonte]
        bloco = next(b for b in af['blocos'] if b['chave'] == c['chave'])
        print('  FONTE: /%s/  (categoria %s%s)' % (
            fonte, af.get('categorias'),
            ', mesma categoria' if c['mesma_categoria'] else ''))
        print('    bloco %s chave %s estilo %s' % (c['bloco'], c['chave'], c['estilo']))
        print('    ancora candidata: %r' % c['ancora'])
        print('    texto do bloco: %s' % bloco['texto'])
        print()


if __name__ == '__main__':
    if '--dossie' in sys.argv:
        dossie(sys.argv[sys.argv.index('--dossie') + 1])
    else:
        main()
