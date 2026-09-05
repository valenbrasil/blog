# -*- coding: utf-8 -*-
"""Despeja os 206 artigos em /tmp/dens/artigos/<slug>.json.

Cada arquivo traz o corpo em forma legível para um agente: um item por bloco,
com a chave do bloco (necessária para a aplicação cirúrgica), o estilo, o texto
puro e os links que já existem. É o que o agente lê em vez de puxar o Portable
Text inteiro, que é dez vezes maior e cheio de ruído.
"""
import json, os, sys, re
sys.path.insert(0, '/tmp/dens')
import sanity

DEST = '/tmp/dens/artigos'
os.makedirs(DEST, exist_ok=True)

posts = sanity.q('''*[_type == "post" && defined(slug.current)]{
  _id, _rev, title, "slug": slug.current, excerpt, publishedAt,
  "categorias": categories[]->title,
  body
}''')

resumo = []
for p in posts:
    blocos = []
    externos = 0
    for i, b in enumerate(p.get('body') or []):
        if b.get('_type') != 'block':
            blocos.append({'i': i, 'chave': b.get('_key'), 'estilo': f"[{b.get('_type')}]", 'texto': ''})
            continue
        texto = sanity.texto_do_bloco(b)
        links = []
        for md in b.get('markDefs') or []:
            if md.get('_type') == 'link' and md.get('href'):
                ancora = ''.join(c.get('text', '') for c in b.get('children', [])
                                 if md.get('_key') in (c.get('marks') or []))
                links.append({'ancora': ancora, 'href': md['href']})
                # externo = http(s) para outro dominio. Link relativo
                # (/slug/) e linkagem interna e nao conta aqui.
                h = md['href']
                if h.startswith('http') and 'valenbrasil.com' not in h and 'wa.me' not in h:
                    externos += 1
        blocos.append({
            'i': i, 'chave': b.get('_key'), 'estilo': b.get('style', 'normal'),
            'lista': b.get('listItem'), 'texto': texto,
            **({'links': links} if links else {}),
        })
    palavras = sum(len(b['texto'].split()) for b in blocos)
    artigo = {
        'id': p['_id'], 'rev': p['_rev'], 'slug': p['slug'], 'titulo': p['title'],
        'categorias': p.get('categorias') or [], 'resumo': p.get('excerpt'),
        'palavras': palavras, 'links_externos': externos, 'blocos': blocos,
    }
    json.dump(artigo, open(f'{DEST}/{p["slug"]}.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    resumo.append({'slug': p['slug'], 'titulo': p['title'],
                   'categorias': artigo['categorias'], 'palavras': palavras,
                   'ext': externos, 'blocos': len(blocos)})

resumo.sort(key=lambda r: (r['ext'], -r['palavras']))
json.dump(resumo, open('/tmp/dens/inventario.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
print(f'{len(resumo)} artigos despejados em {DEST}')
print(f'links externos hoje: {sum(r["ext"] for r in resumo)}')
faltam = [r for r in resumo if r['ext'] < 10]
print(f'abaixo de 10: {len(faltam)}')
