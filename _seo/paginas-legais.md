# Páginas legais — reescrita de 5 de setembro de 2026

As duas páginas — `/politica-de-privacidade/` e `/termos-de-uso/` — traziam o
texto de 20 de abril de 2025, que descrevia um site diferente do que existe.

## O que estava errado

A política afirmava coletar "nome, e-mail e outras informações fornecidas ao se
inscrever em newsletters, preencher formulários de contato ou comentar em
publicações", declarava finalidade de "gerenciar comentários" e "enviar
newsletters" e descrevia "cookies de funcionalidade" que personalizavam a
experiência. Nada disso existe: a varredura do HTML gerado não encontrou uma só
tag `<form>` nem `<input>` em nenhuma das 237 páginas, não há sistema de
comentários, não há cadastro de e-mail, não há login.

Os termos tinham uma seção inteira, "Conteúdo Gerado pelo Usuário", com licença
mundial e sublicenciável sobre um conteúdo que não tem como chegar, e exigiam 18
anos ou autorização do responsável para ler um blog aberto.

Os dois citavam apenas o Google Analytics e omitiam Ahrefs, GitHub Pages e
Sanity, que também recebem dados do visitante. E os links de abertura apontavam
para `https://valenbrasil.com/` com o texto `https://blog.valenbrasil.com`.

## O inventário que sustentou a reescrita

Nada foi afirmado sem estar conferido no código ou no HTML publicado. O
inventário registra o que o navegador do visitante contacta — `cdn.sanity.io`,
`www.googletagmanager.com` (medição G-DP9C1G5246), `analytics.ahrefs.com`
(chave X2AoK5UaoY8tPMNmCRaBhA) e `wa.me` apenas se o visitante clicar —, que as
fontes são servidas pelo próprio domínio, que o Sanity é lido só no build e que
a hospedagem é GitHub Pages.

A regra valeu nos dois sentidos. Onde a correção dependia de verificação que
ninguém aqui podia fazer — o prazo de retenção configurado no painel do GA4, o
mecanismo de transferência internacional do art. 33, o nome do encarregado — o
texto ficou em silêncio sobre o fundamento em vez de inventar um. Isso vira
pendência da empresa, registrada abaixo.

## O que os documentos passam a dizer

`privacidade.html` tem 14 seções e abre com "O que este blog não faz", listando
a ausência de formulário, busca, comentário, newsletter, login e pagamento. Só
depois descreve o que de fato acontece: log de acesso do GitHub, medição do
Google Analytics e do Ahrefs, entrega de imagem pela CDN do Sanity, e o que
acontece se o visitante escrever pelo WhatsApp. Os cookies são nomeados
(`_ga` e `_ga_<ID>`) e atribuídos a quem os grava.

`termos.html` tem 13 seções. Saíram a seção de conteúdo do usuário e a
exigência de idade; entrou uma seção que separa a aceitação dos Termos da base
legal do tratamento — navegar não é consentimento —, e o canal de WhatsApp
saiu de "links para sites de terceiros", porque quem clica ali abre conversa
com a própria Valen Brasil, que responde como controladora.

E-mail de privacidade: `privacidade@valenbrasil.com`. O `contato@` continua nos
assuntos que não são de dados pessoais — pedido de licença de uso, contato
geral.

## Estrutura e indexação

As duas páginas abriam com `<h3>` e não tinham `<h1>`. O título do documento
passou a `<h1>`, as seções continuam `<h2>`, e o dos termos deixou de ser
"Valen Brasil e Blog Valen Brasil" para dizer o que o documento é.

Ficam **index, follow**. São sinal de confiança que as diretrizes de avaliação
de qualidade do Google mandam procurar, ainda mais num blog de tema YMYL; o
argumento de conteúdo raso não se aplica depois que o texto passou a citar a
infraestrutura real; e as duas já estão no `sitemap.xml` e recebem link do
rodapé de todas as páginas — pôr `noindex` numa URL listada no sitemap seria
sinal contraditório. Cada uma ganhou `description` própria, no lugar da
genérica do site.

## Pendências da empresa

- Abrir o painel do GA4 (G-DP9C1G5246) e o do Ahrefs, anotar o prazo de
  retenção configurado e substituir a frase genérica da seção 9.
- Conferir contrato a contrato a base do art. 33 para a transferência
  internacional (Google, GitHub, Ahrefs, Sanity).
- Decidir se haverá encarregado nomeado publicamente.
- Confirmar que `contato@valenbrasil.com` e `privacidade@valenbrasil.com` estão
  ativos e monitorados.
