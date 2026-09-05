# -*- coding: utf-8 -*-
"""Acesso ao Sanity. O token fica em /home/user/blog/.env.local (chmod 600,
gitignored) e nunca entra em arquivo versionado — o repositório é público."""
import json, urllib.parse, urllib.request

ENV = {}
for _l in open('/home/user/blog/.env.local', encoding='utf-8'):
    _l = _l.strip()
    if _l and '=' in _l and not _l.startswith('#'):
        k, v = _l.split('=', 1)
        ENV[k] = v

DS = ENV['SANITY_DATASET']
BASE = f"https://{ENV['SANITY_PROJECT_ID']}.api.sanity.io/v{ENV['SANITY_API_VERSION']}/data"


def _req(url, data=None, tentativas=5):
    import time
    for n in range(tentativas):
        try:
            r = urllib.request.Request(url, data=json.dumps(data).encode() if data else None)
            r.add_header('Authorization', f"Bearer {ENV['SANITY_TOKEN']}")
            if data:
                r.add_header('Content-Type', 'application/json')
            with urllib.request.urlopen(r, timeout=180) as x:
                return json.load(x)
        except Exception as e:
            if n == tentativas - 1:
                raise
            time.sleep(2 ** n)


def q(query, **params):
    """Consulta GROQ. Vai por POST porque as consultas longas estouram a URL."""
    corpo = {'query': query, 'params': {k: v for k, v in params.items()}}
    return _req(f'{BASE}/query/{DS}', corpo)['result']


def mutate(mutations, rev=None):
    return _req(f'{BASE}/mutate/{DS}?returnIds=true', {'mutations': mutations})


def texto_do_bloco(b):
    """Texto puro de um bloco de Portable Text."""
    if b.get('_type') != 'block':
        return ''
    return ''.join(c.get('text', '') for c in b.get('children', []) if c.get('_type') == 'span')
