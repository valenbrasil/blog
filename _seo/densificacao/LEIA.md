# Densificação de links externos — o que está aqui e como retomar

Isto existe porque o container é efêmero. As ferramentas e os planos pendentes
viviam em `/tmp`, e o cache dos workflows em `~/.claude`; nenhum dos dois
sobrevive à reciclagem do container. Sem isto, retomar significaria refazer.

## Ferramentas

| Arquivo | O que faz |
|---|---|
| `sanity.py` | acesso ao Sanity. Lê o token de `/home/user/blog/.env.local`, que é gitignored — **nenhum segredo mora aqui** |
| `dump.py` | despeja os 206 artigos em `/tmp/dens/artigos/<slug>.json`, em forma legível para um agente |
| `verificar.py` | confere uma URL antes de ela virar link: status, e se o **texto** da página contém o que a frase vai afirmar. Manda User-Agent de navegador porque o Planalto recusa o do curl e devolve conexão vazia |
| `aplica.py` | grava no Sanity. Só operação aditiva; assere antes de escrever que todo parágrafo do autor continua presente na mesma ordem |
| `estado.py` | fotografa onde tudo parou. Só lê arquivo, não gasta agente |
| `cirurgia.py` | tira link morto: `destroca` (tira o link, mantém o texto), `troca_href` e `remove` (apaga bloco cujo conteúdo *é* o endereço morto). Separado do `aplica.py` de propósito — aquele é aditivo e se recusa a perder texto |
| `vigia.sh` | vigia de uso: sai ao primeiro sinal de limite numa saída nova, ao passar do teto de tokens, ou quando os lotes silenciam |

Antes de usar, recrie a base:

```
mkdir -p /tmp/dens && cp _seo/densificacao/*.py /tmp/dens/ && cp _seo/densificacao/vigia.sh /tmp/dens/
python3 /tmp/dens/dump.py && python3 /tmp/dens/estado.py
```

## Planos pendentes

`planos/` traz os 11 artigos dos lotes E e F cujo plano foi redigido e **não
passou pelo cético**. Não grave nenhum deles como está: no que já rodou, o
cético reprovou 35 operações de 393, todas por leitura errada de fonte real —
data de inscrição trocada, artigo de lei já revogado citado como vigente,
dispositivo lido ao contrário, âncora apontando para bloco errado.

O caminho certo para eles é rodar só o estágio de refutação sobre o plano
salvo, não redigir de novo.

## Onde parou

Ver `_seo/densificacao-estado.md`, que o `estado.py` regenera.
