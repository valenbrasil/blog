# Links externos mortos — o que era, o que não era, e o que foi feito

A varredura das 605 URLs externas distintas do HTML gerado devolveu 50 com
problema. **Nenhuma veio da densificação**: todas são de passadas anteriores.
Mas a maioria não estava morta — era o ambiente da sessão que não as alcançava.

## A triagem

| URL | Veredito | O que foi feito |
|---|---|---|
| `avaliador.caicba.com.br` | **morta**. O host não resolve em DNS, e o domínio `caicba.com.br` também não | bloco removido inteiro — o conteúdo dele *era* o endereço |
| `portalibre.fgv.br/igp` | **viva**. Responde 200 no curl com User-Agent de navegador | nada. Eram 10 das 16 ocorrências |
| `adobe.com/pt/products/fresco.html#` | viva. Inalcançável daqui, mas a Adobe está no ar | `#` solto retirado, caminho corrigido para `/br/` |
| `ufrgs.br`, `ufsj.edu.br`, `siccau.caubr.org.br`, `jardindelturia.com`, `ricardobofill.com` | **não verificáveis daqui** | removidos por decisão do autor |

Os 42 restantes são 403 de bloqueio a robô ou casca de aplicação JavaScript —
funcionam no navegador de quem lê, e não foram tocados.

## O falso negativo que quase custou dez links

`portalibre.fgv.br/igp` é a página do IGP-M na FGV, citada em dez artigos. Meu
verificador em Python falhava nela com erro de TLS e a marcou como morta. O
mesmo endereço responde **200** no curl com User-Agent de navegador. Tratar a
lista sem reconferir teria removido dez links vivos para a fonte oficial do
índice.

## Os cinco removidos

Levantei que a falha era do ambiente e não prova de site fora do ar: os cinco
resolvem DNS e falham na conexão, o log do proxy registra `connect_rejected` e
`ws_closed_mid_exchange` para eles, e `adobe.com` — que certamente está no ar —
falha igual. A decisão do autor foi remover mesmo assim: link que ninguém
consegue conferir não fica.

Saíram pela operação `destroca` do `cirurgia.py`, que tira o link e **mantém o
texto**. Quem lê continua vendo "Universidade Federal do Rio Grande do Sul
(UFRGS)" e "Clique em 'Solicitar Registro Profissional'", só sem âncora. As três
páginas conservaram o mesmo número de blocos.

```
ufrgs.br, ufsj.edu.br              o-que-e-um-arquiteto   24 links
siccau.caubr.org.br                o-que-e-cau             4 links
jardindelturia.com, ricardobofill  parque-turia            0 links
```

Acervo: 1.148 → 1.143 links externos. **Nenhum link morto conhecido resta.**
