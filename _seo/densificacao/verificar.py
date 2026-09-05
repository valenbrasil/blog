# -*- coding: utf-8 -*-
"""Confere uma URL antes de ela virar link no acervo.

    python3 /tmp/dens/verificar.py <url> ["termo que a pagina deve conter" ...]

Responde em JSON: status HTTP, URL final depois dos redirecionamentos, titulo da
pagina, tamanho do texto e, para cada termo pedido, se ele aparece no texto.

Por que existe: o Planalto recusa o User-Agent do curl e devolve conexao vazia,
o que faria um agente concluir que a lei nao existe. E porque "a URL responde
200" nao basta -- muito 200 e pagina de erro ou de busca vazia. O teste util e
se o texto da pagina contem aquilo que o artigo vai afirmar.

O resultado fica em cache em /tmp/dens/cache/ para 200 agentes nao baterem
duzentas vezes no mesmo endereco.
"""
import hashlib, json, os, re, sys, time, urllib.error, urllib.request

CACHE = '/tmp/dens/cache'
UA = ('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) '
      'Chrome/120.0.0.0 Safari/537.36')


def _texto(html):
    html = re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>', ' ', html)
    return re.sub(r'\s+', ' ', re.sub(r'(?s)<[^>]+>', ' ', html)).strip()


def buscar(url, forcar=False):
    os.makedirs(CACHE, exist_ok=True)
    chave = os.path.join(CACHE, hashlib.sha256(url.encode()).hexdigest()[:32] + '.json')
    if os.path.exists(chave) and not forcar:
        return json.load(open(chave, encoding='utf-8'))

    saida = {'url': url, 'status': 0, 'final': url, 'titulo': '', 'chars': 0, 'erro': None}
    for tentativa in range(3):
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': UA,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            })
            with urllib.request.urlopen(req, timeout=45) as r:
                bruto = r.read(3_000_000)
                cs = r.headers.get_content_charset() or 'utf-8'
                html = bruto.decode(cs, 'replace')
                saida['status'] = r.status
                saida['final'] = r.url
            m = re.search(r'(?is)<title[^>]*>(.*?)</title>', html)
            saida['titulo'] = re.sub(r'\s+', ' ', m.group(1)).strip()[:200] if m else ''
            texto = _texto(html)
            saida['chars'] = len(texto)
            saida['texto'] = texto[:400_000]
            saida['erro'] = None
            break
        except urllib.error.HTTPError as e:
            saida['status'] = e.code
            saida['erro'] = f'HTTP {e.code}'
            break
        except Exception as e:
            saida['erro'] = f'{type(e).__name__}: {e}'
            if tentativa < 2:
                time.sleep(2 ** tentativa)

    json.dump(saida, open(chave, 'w', encoding='utf-8'), ensure_ascii=False)
    return saida


def conferir(url, termos=()):
    d = buscar(url)
    texto = (d.get('texto') or '')
    alvo = re.sub(r'\s+', ' ', texto).lower()
    achados = {}
    for t in termos:
        t_norm = re.sub(r'\s+', ' ', t).strip().lower()
        achados[t] = t_norm in alvo
    return {
        'url': d['url'], 'status': d['status'], 'final': d['final'],
        'titulo': d['titulo'], 'chars': d['chars'], 'erro': d['erro'],
        'viva': d['status'] == 200 and d['chars'] > 500,
        'termos': achados,
        'todos_os_termos': all(achados.values()) if achados else None,
    }


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    print(json.dumps(conferir(sys.argv[1], sys.argv[2:]), ensure_ascii=False, indent=1))
