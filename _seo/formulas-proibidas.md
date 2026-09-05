# Fórmulas de escrita proibidas

O plano lista, na seção "Padrões proibidos na escrita", as construções que não
podem aparecer nem no texto novo nem nas reescritas. A varredura original
registrou 59 ocorrências em 54 artigos.

## O número era outro

Refeita a detecção com todos os padrões do plano — e não só os mais óbvios —
apareceram **160 ocorrências em 104 artigos**:

```
  37  em resumo                26  não é apenas X, é Y
  26  vamos explorar           26  é importante destacar
   9  neste artigo vamos        8  em suma
   8  vale ressaltar            8  incrível
   7  revolucionário            3  na era digital
   2  por fim, mas não menos importante
```

## Como cada grupo foi tratado

**Muletas de abertura — 77 ocorrências, removidas.** "Vale ressaltar que X"
afirma exatamente o que "X" afirma, com três palavras a mais e um tom de
locutor. Nenhuma delas carrega informação, então a correção é retirar e deixar
a frase de pé. O plano é explícito quanto a isto: trocar por outra muleta não
resolve o que ele quer evitar.

**"Não é apenas X, mas Y" — 26 ocorrências, reescritas.** É um efeito de
retórica: gasta uma negação para dizer que algo é X e é Y. Vira afirmação
direta, mantendo Y no lugar de destaque onde o autor o pusera.

    − A Senna Tower não é apenas um prédio, mas uma verdadeira obra-prima da engenharia
    + A Senna Tower é uma obra-prima da engenharia

**Anúncios de estrutura — 27 ocorrências.** "Vamos explorar…" anuncia o que a
seção seguinte já mostra. Onde a frase só anunciava, saiu; onde carregava
informação — a lista das modalidades, a distinção entre dois assuntos — virou
frase declarativa, para não perder conteúdo (Regra 1 do plano).

    − Vamos explorar as principais modalidades: usucapião extraordinária, ordinária e especial.
    + As principais modalidades são a usucapião extraordinária, a ordinária e a especial.

Três parágrafos existiam só para conter o anúncio e ficaram vazios depois do
corte. Foram removidos: `<p>` vazio é ruído na página.

**Superlativos — 12 de 15 removidos, 3 mantidos.** O plano proíbe superlativo
**sem sustentação**, e essa condição faz diferença. "Praias incríveis" e
"vistas incríveis" são enfeite e saíram. Já estes três ficaram, porque a própria
frase sustenta o adjetivo:

- as estações de Wagner e os edifícios de Loos "foram revolucionários **e
  impulsionaram Viena para a era moderna**";
- os princípios de Boito, "**apresentados em 1884**", com o que era novo
  explicado na sequência;
- o trabalho de Riken Yamamoto, **laureado do Pritzker**, descrito logo depois.

## Um erro meu, barrado antes de gravar

A primeira versão do script corrigia a caixa das letras no span inteiro. Uma das
regras — minúscula depois de vírgula, para o caso da muleta intercalada —
rebaixou **"Vitória"** para "vitória" em `o-que-e-um-arquiteto`, num trecho a
dez palavras do corte. A regra foi descartada: ela nunca foi necessária, porque
muleta intercalada é sempre seguida de "que X" com X minúsculo. A correção de
caixa passou a valer só no ponto exato da edição.

## Resultado

```
                                    antes    depois
fórmulas proibidas ............      160  →      3
artigos afetados ..............      104  →      3
blocos alterados ..............        —       146
palavras .......................  225.227 → 224.708   (−519)
```

As 3 restantes são os superlativos sustentados pela própria frase.

Conferência no nível de bloco, contra os backups de 101 artigos:

- **0** artigos com contagem de blocos diferente — nenhum bloco entrou ou saiu
  além dos três vazios;
- **0** blocos alterados que não continham uma fórmula proibida.

As 519 palavras a menos são as muletas. Nenhuma informação saiu com elas: cada
bloco alterado foi conferido individualmente contra o padrão que o motivou.
