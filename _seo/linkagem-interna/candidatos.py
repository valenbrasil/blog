# -*- coding: utf-8 -*-
"""Indice de ancoras possiveis para linkagem interna.

Le os 206 artigos despejados por dump.py e responde, para cada artigo, duas
perguntas que decidem o trabalho dos agentes:

  1. O primeiro link do texto ja e interno?  (Regra 2)
  2. Se nao e, existe na ZONA ALVO -- o texto que vem ANTES do primeiro link
     externo -- alguma mencao literal ao assunto de outro artigo do blog?

O valor disto e saber, ANTES de gastar agente, quais artigos nao tem ancora
possivel no topo. Esses vao direto para o caminho da exclusao (Regra 3), sem
tentativa de fabricar frase -- que e exatamente o que a Regra 1 proibe em
espirito.

Nao chama a API, nao gasta agente, roda em segundos.

Uso:  python3 _seo/linkagem-interna/candidatos.py [--relatorio]
"""
import glob
import json
import os
import re
import sys
import unicodedata

ARTIGOS = '/tmp/dens/artigos/*.json'
SAIDA = '/home/user/blog/_seo/linkagem-interna/candidatos.json'

# Palavras que sozinhas nao identificam destino nenhum: "imovel" casa com o blog
# inteiro. Termo candidato precisa ter conteudo alem destas.
VAZIAS = {
    'a', 'ao', 'aos', 'as', 'com', 'da', 'das', 'de', 'do', 'dos', 'e', 'em',
    'na', 'nas', 'no', 'nos', 'o', 'os', 'para', 'por', 'que', 'sem', 'sobre',
    'um', 'uma', 'guia', 'completo', 'pratica', 'tudo', 'saber', 'explicado',
    'imovel', 'imoveis', 'brasil', 'brasileiro', 'arquitetura', 'arquiteto',
    'blog', 'artigo', 'como', 'qual', 'quais', 'seu', 'sua', 'novo', 'nova',
}


def sem_acento(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                   if unicodedata.category(c) != 'Mn').lower()


def termos_do_destino(art):
    """Expressoes que, achadas num texto, apontam para este artigo.

    Sai do slug e do titulo. Termo so entra se for ESPECIFICO: duas ou mais
    palavras fora de VAZIAS, ou sigla de verdade.

    Sigla sai SO do titulo, onde a maiuscula e do autor. Tirar sigla do slug
    em maiuscula transforma toda palavra em sigla -- "novas-casas-..." virava
    NOVAS, CASAS, BRASIL, e o indice inteiro apontava para lugar nenhum.
    """
    brutos = set()

    brutos.add(art['slug'].replace('-', ' '))

    titulo = art.get('titulo') or ''
    brutos.add(titulo)
    # "Imposto Explicado: ITBI" -> tambem "ITBI"
    if ':' in titulo:
        brutos.add(titulo.split(':', 1)[1].strip())

    siglas = {s for s in re.findall(r'\b[A-Z]{3,6}\b', titulo)}

    bons = set()
    for t in brutos:
        t = t.strip()
        if len(t) < 6:
            continue
        pal = [p for p in re.split(r'\W+', sem_acento(t)) if p]
        uteis = [p for p in pal if p not in VAZIAS and len(p) > 2]
        if len(uteis) < 2:
            continue
        bons.add(t)
    bons |= siglas
    return sorted(bons, key=len, reverse=True)


def acha_palavra(base, termo):
    """Posicao de `termo` em `base`, so em fronteira de palavra.

    Sem isso "ARQUITETO" casa dentro de "arquitetonico" e a ancora sai cortada
    no meio da palavra.
    """
    m = re.search(r'(?<![0-9A-Za-z])%s(?![0-9A-Za-z])' % re.escape(termo), base)
    return m.start() if m else -1


def sequencia_de_links(art):
    """Links do artigo na ordem do documento: (tipo, href, chave, i, pos)."""
    seq = []
    for b in art['blocos']:
        texto = b.get('texto') or ''
        for l in (b.get('links') or []):
            href = (l.get('href') or '').strip()
            anc = l.get('ancora') or ''
            pos = texto.find(anc) if anc else 0
            if pos < 0:
                pos = 0
            # Tres categorias, nao duas. valenbrasil.com e a home institucional
            # -- outro site, e nao um artigo do blog: nao cumpre a Regra 2. Mas
            # tambem nao e "pagina externa" de terceiro, entao nao entra no
            # orcamento da Regra 3 nem na conta dos 10 links externos.
            if href.startswith('/'):
                tipo = 'int'
            elif 'valenbrasil.com' in href:
                tipo = 'home'
            else:
                tipo = 'ext'
            seq.append((tipo, href, b['chave'], b['i'], pos, anc))
    seq.sort(key=lambda x: (x[3], x[4]))
    return seq


def zona_alvo(art, seq):
    """Blocos (ou pedaco de bloco) que vem ANTES do primeiro link NAO interno.

    Para no primeiro 'ext' OU 'home': a Regra 2 pede que o primeiro link do
    texto seja para outro artigo do blog, e a home institucional nao e isso.
    Ancora colocada depois dela nao cumpriria a regra.

    Devolve lista de (chave, i, texto_disponivel, seguro_emendar).

    seguro_emendar distingue dois casos que PARECEM iguais na prévia de texto
    mas nao sao. op_emendar ANEXA ao fim REAL do bloco -- nao ao ponto onde a
    previa foi cortada. Um cetico pegou isso ao vivo: o bloco que contem o
    primeiro link nao-interno tem, depois desse link, mais texto e ate outros
    links (no caso, dois). "ancorar" ali e seguro, porque so poe link sobre um
    trecho que ja existe, sem mover nada. "emendar" ali NAO E seguro: o texto
    novo cairia depois de tudo que vem depois do corte, inclusive do link
    externo que a operacao deveria preceder. Por isso so os blocos ESTRITAMENTE
    antes do bloco de corte sao seguros para emendar; o proprio bloco de corte
    so serve para ancorar.
    """
    primeiro_ext = next((x for x in seq if x[0] != 'int'), None)
    zona = []
    for b in art['blocos']:
        texto = b.get('texto') or ''
        if not texto:
            continue
        if primeiro_ext is None:
            zona.append((b['chave'], b['i'], texto, True))
            continue
        if b['i'] < primeiro_ext[3]:
            zona.append((b['chave'], b['i'], texto, True))
        elif b['i'] == primeiro_ext[3]:
            corte = primeiro_ext[4]
            if corte > 0:
                zona.append((b['chave'], b['i'], texto[:corte], False))
            break
        else:
            break
    return zona


def faixas_com_link(b):
    """(inicio, fim) de cada ancora ja linkada no bloco, para nao pisar nelas."""
    texto = b.get('texto') or ''
    faixas = []
    for l in (b.get('links') or []):
        anc = l.get('ancora') or ''
        p = texto.find(anc)
        if p >= 0:
            faixas.append((p, p + len(anc)))
    return faixas


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

    termos = {s: termos_do_destino(a) for s, a in arts.items()}
    faixa_bloco = {s: {b['chave']: faixas_com_link(b) for b in a['blocos']}
                   for s, a in arts.items()}

    saida = {}
    for s, a in arts.items():
        seq = sequencia_de_links(a)
        ja_cumpre = bool(seq) and seq[0][0] == 'int'
        zona = zona_alvo(a, seq)
        # Links que precedem o primeiro interno. Separados por tipo porque so
        # os 'ext' entram no orcamento da Regra 3.
        idx_1o_int = next((i for i, y in enumerate(seq) if y[0] == 'int'), None)
        antes = seq[:idx_1o_int if idx_1o_int is not None else len(seq)]
        n_ext_antes = sum(1 for x in antes if x[0] == 'ext')
        n_home_antes = sum(1 for x in antes if x[0] == 'home')
        # A identidade do link que sobra, nao so a contagem. Um cetico pegou
        # um agente que escolheu um link interno DIFERENTE do que a exclusao
        # de fato promove -- ele leu "custo 2" e foi procurar por conta
        # propria um link interno em outro lugar do artigo, ignorando que
        # dentro do MESMO bloco podia haver um externo entre o inicio da
        # zona e esse interno. Contagem sem identidade convida a adivinhar.
        interno_promovido = (
            {'chave': seq[idx_1o_int][2], 'ancora': seq[idx_1o_int][5],
             'bloco': seq[idx_1o_int][3]}
            if idx_1o_int is not None else None)
        links_a_excluir = [{'chave': x[2], 'href': x[1], 'ancora': x[5],
                            'tipo': x[0]} for x in antes if x[0] != 'int']
        cand = []
        if not ja_cumpre:
            for chave, i, texto, _seguro_emendar in zona:
                base = sem_acento(texto)
                for d, ts in termos.items():
                    if d == s:
                        continue
                    for t in ts:
                        p = acha_palavra(base, sem_acento(t))
                        if p < 0:
                            continue
                        literal = texto[p:p + len(t)]
                        # sem_acento preserva o comprimento caractere a
                        # caractere; se nao preservou, a fatia esta torta e o
                        # candidato nao presta.
                        if sem_acento(literal) != sem_acento(t):
                            continue
                        # nao pisar em ancora que ja e link
                        if any(ini <= p < fim or ini < p + len(t) <= fim
                               for ini, fim in faixa_bloco[s].get(chave, [])):
                            break
                        cand.append({
                            'destino': d, 'chave': chave, 'bloco': i,
                            'ancora': literal, 'pos': p,
                            'entrada_destino': entrada[d],
                            'orfao': entrada[d] == 0,
                        })
                        break
        # orfao primeiro, depois menos entrada, depois mais acima no texto
        cand.sort(key=lambda c: (not c['orfao'], c['entrada_destino'],
                                 c['bloco'], c['pos']))
        saida[s] = {
            'titulo': a.get('titulo'),
            'palavras': a.get('palavras'),
            'links_externos': a.get('links_externos'),
            'entrada': entrada[s],
            'regra1_ok': entrada[s] >= 1,
            'regra2_ok': ja_cumpre,
            'externos_antes_do_1o_interno': n_ext_antes,
            'tem_interno_no_texto': any(x[0] == 'int' for x in seq),
            # A zona vai INTEIRA, com chave de bloco, porque e nela que o
            # agente procura ancora. Mediana de 94 palavras -- cabe.
            'zona': [{'chave': c, 'bloco': i, 'texto': t, 'seguro_emendar': se}
                     for c, i, t, se in zona],
            # Custo da Regra 3 neste artigo: quantos externos apagar para o
            # interno que ja existe passar a ser o primeiro.
            'home_antes_do_1o_interno': n_home_antes,
            'exclusao_custa': (n_ext_antes + n_home_antes
                               if any(x[0] == 'int' for x in seq) else None),
            'externos_depois_da_exclusao': (a.get('links_externos') or 0) - n_ext_antes,
            # A resposta pronta, nao so o numero: qual link fica em primeiro
            # e exatamente o que precisa sair. Sem isso o agente adivinha.
            'interno_promovido_pela_exclusao': interno_promovido,
            'links_a_excluir': links_a_excluir,
            'primeiro_link': ({'tipo': seq[0][0], 'href': seq[0][1],
                               'chave': seq[0][2], 'ancora': seq[0][5]}
                              if seq else None),
            # Pistas, nao respostas: casamento literal de titulo raramente
            # acontece na introducao. Quem decide a ancora e o agente.
            'pistas': cand[:8],
        }

    catalogo = {s: {'titulo': a.get('titulo'), 'resumo': a.get('resumo'),
                    'categorias': a.get('categorias'), 'entrada': entrada[s],
                    'palavras': a.get('palavras')}
                for s, a in arts.items()}
    json.dump({'catalogo': catalogo, 'artigos': saida},
              open(SAIDA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    falham2 = [s for s, v in saida.items() if not v['regra2_ok']]
    orfaos = [s for s, v in saida.items() if not v['regra1_ok']]
    sem_saida = [s for s in falham2
                 if not saida[s]['tem_interno_no_texto']]
    caro = [s for s in falham2
            if saida[s]['exclusao_custa'] is not None
            and saida[s]['exclusao_custa'] > 5]
    trava = [s for s in falham2
             if saida[s]['exclusao_custa'] is not None
             and saida[s]['exclusao_custa'] <= 5
             and saida[s]['externos_depois_da_exclusao'] < 10]
    print(json.dumps({
        'artigos': len(arts),
        'regra1_orfaos': len(orfaos),
        'regra2_ja_cumprem': len(arts) - len(falham2),
        'regra2_falham': len(falham2),
        'exclusao_acima_do_teto_de_5': len(caro),
        'exclusao_derrubaria_abaixo_de_10_externos': len(trava),
        'sem_link_interno_nenhum': len(sem_saida),
    }, ensure_ascii=False))
    print('dossie -> %s' % SAIDA)

    if '--relatorio' in sys.argv:
        print('\nSO A CRIACAO RESOLVE (exclusao passa de 5 ou derrubaria o piso):')
        for s in sorted(set(caro) | set(trava) | set(sem_saida)):
            v = saida[s]
            print('  %-58s custo %s | ficaria com %2d externos'
                  % (s,
                     'sem interno' if v['exclusao_custa'] is None
                     else '%2d' % v['exclusao_custa'],
                     v['externos_depois_da_exclusao']))


def palavras_uteis(*textos):
    saco = set()
    for t in textos:
        for p in re.split(r'\W+', sem_acento(t or '')):
            if len(p) > 3 and p not in VAZIAS:
                saco.add(p)
    return saco


def dossie(slug):
    """Imprime, para UM artigo, o que o agente precisa e nada mais.

    O candidatos.json inteiro passa de 400 KB -- nao cabe num prompt, e o
    agente nao precisa dele: precisa da zona alvo deste artigo e de uma lista
    curta de destinos plausiveis.
    """
    d = json.load(open(SAIDA, encoding='utf-8'))
    cat, arts = d['catalogo'], d['artigos']
    v = arts[slug]

    print('ARTIGO: %s' % slug)
    print('TITULO: %s' % v['titulo'])
    print('PALAVRAS: %s | LINKS EXTERNOS: %s | RECEBE HOJE: %d link(s) interno(s)'
          % (v['palavras'], v['links_externos'], v['entrada']))
    print('REGRA 1 (recebe >=1): %s' % ('OK' if v['regra1_ok'] else 'FALHA'))
    print('REGRA 2 (1o link e interno): %s' % ('OK' if v['regra2_ok'] else 'FALHA'))
    if v['primeiro_link']:
        pl = v['primeiro_link']
        print('PRIMEIRO LINK HOJE: [%s] %s  (ancora %r, bloco %s)'
              % (pl['tipo'], pl['href'], pl['ancora'], pl['chave']))
    print()
    print('ZONA ALVO -- o link novo TEM de entrar aqui, antes do primeiro link nao interno:')
    if not v['zona']:
        print('  (vazia: o primeiro link esta no primeiro bloco de texto)')
    for z in v['zona']:
        aviso = '' if z['seguro_emendar'] else '  [SO ANCORAR -- emendar aqui cairia depois do link nao interno]'
        print('  [bloco %s chave %s]%s' % (z['bloco'], z['chave'], aviso))
        print('    %s' % z['texto'])
    print()
    if v['exclusao_custa'] is None:
        print('CAMINHO EXCLUSAO: indisponivel -- o artigo nao tem link interno nenhum.')
    else:
        ip = v['interno_promovido_pela_exclusao']
        print('CAMINHO EXCLUSAO: apagar estes %d link(s), NESTA ORDEM, e nenhum outro:'
              % v['exclusao_custa'])
        for l in v['links_a_excluir']:
            print('    [%s] %r -> %s  (chave %s)' % (l['tipo'], l['ancora'], l['href'], l['chave']))
        print('  Depois disso o PRIMEIRO link do artigo passa a ser: %r -> chave %s'
              % (ip['ancora'], ip['chave']))
        print('  NAO escolha outro link interno para "virar o primeiro" -- e este, e so este.')
        print('  Sobrariam %d links externos.' % v['externos_depois_da_exclusao'])
        if v['exclusao_custa'] > 5:
            print('  ACIMA do teto de 5 -- indisponivel.')
        if v['externos_depois_da_exclusao'] < 10:
            print('  Derrubaria o artigo abaixo de 10 links externos -- indisponivel.')

    if v['pistas']:
        print()
        print('PISTAS (casamento literal de titulo; confira antes de usar):')
        for p in v['pistas'][:5]:
            print('  %r no bloco %s -> /%s/%s'
                  % (p['ancora'], p['chave'], p['destino'],
                     '  [ORFAO]' if p['orfao'] else ''))

    zona_txt = ' '.join(z['texto'] for z in v['zona'])
    base = palavras_uteis(zona_txt, v['titulo'])
    pont = []
    for d2, c in cat.items():
        if d2 == slug:
            continue
        alvo = palavras_uteis(c['titulo'], c['resumo'], d2.replace('-', ' '))
        n = len(base & alvo)
        if n:
            # Orfao e BONUS, nao filtro. Ordenar orfao estritamente primeiro
            # expulsa da lista o destino mais relevante so porque ele ja
            # recebe links -- e era ele que o texto realmente mencionava.
            orfao = c['entrada'] == 0
            pont.append((orfao, n + (2 if orfao else 0), d2, c))
    pont.sort(key=lambda x: -x[1])
    print()
    print('DESTINOS PLAUSIVEIS (por afinidade com a zona; orfao tem bonus):')
    for orfao, n, d2, c in pont[:40]:
        print('  %-56s recebe %2d%s' % ('/%s/' % d2, c['entrada'],
                                        '  [ORFAO]' if orfao else ''))
        print('      %s' % (c['titulo'] or ''))
    if not pont:
        print('  (nenhum destino com palavra em comum com a zona alvo)')


if __name__ == '__main__':
    if '--dossie' in sys.argv:
        dossie(sys.argv[sys.argv.index('--dossie') + 1])
    else:
        main()
