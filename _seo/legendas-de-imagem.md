# Legendas de imagem — as 94 que faltavam

## Por que eu tinha me recusado antes

As 94 imagens sem legenda nunca tiveram uma no Ghost. A contagem de figuras do
site antigo batia exatamente com a do acervo restaurado e não sobrava legenda
órfã, então escrever uma seria inventar texto — foi o que eu disse quando o item
apareceu.

## O que mudou

A instrução foi derivar a legenda do que já existe: o título do artigo e um
resumo do parágrafo anterior e do posterior. Isso não é inventar, é sintetizar
contexto que o próprio artigo escreveu.

E havia um dado que eu não tinha olhado: **as 94 imagens têm `alt` preenchido**.
O `alt` descreve o que está na foto. Com ele, a legenda pode dizer o que a
imagem mostra *e* por que ela está ali, sem afirmar nada que ninguém possa
conferir.

## O critério de escrita

A legenda não repete o `alt`. O `alt` existe para quem não vê a imagem; a
legenda, para quem vê e quer saber por que ela está naquele ponto do texto. Cada
uma liga o que está na foto ao assunto da seção:

    alt      "Vista panorâmica de Bombinhas, um paraíso em Santa Catarina."
    contexto o parágrafo anterior cita a estimativa do IBGE de 20 mil habitantes
    legenda  "Bombinhas vista do alto: uma península de cerca de 20 mil
              habitantes que avança sobre o Atlântico, no litoral norte
              catarinense."

## A trava

`legendas.py` só grava onde a legenda está **vazia**. Se a imagem já tem uma,
alguém a escreveu, e sobrescrever seria perder texto do autor. O script também
confere que o `alt` continua o mesmo de quando o plano foi feito — se a imagem
foi trocada no Sanity nesse meio-tempo, a gravação não acontece.

## Resultado

```
635 imagens no acervo · 0 sem legenda
94 escritas, em 29 artigos, em 4 lotes
```
