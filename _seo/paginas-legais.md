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
`www.googletagmanager.com`, `analytics.ahrefs.com` e `wa.me` apenas se o
visitante clicar —, que as
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

- Abrir o painel do GA4 e o do Ahrefs, anotar o prazo de retenção
  configurado e substituir a frase genérica da seção 9.
- Conferir contrato a contrato a base do art. 33 para a transferência
  internacional (Google, GitHub, Ahrefs, Sanity).
- Decidir se haverá encarregado nomeado publicamente.
- Confirmar que `contato@valenbrasil.com` e `privacidade@valenbrasil.com` estão
  ativos e monitorados.

## Identificação da empresa (5 de setembro de 2026)

Faltava no blog o que o site institucional já publica no rodapé: registro
profissional, CNPJ e ano de fundação. Conferido em `https://valenbrasil.com`
no mesmo dia, palavra por palavra:

    Valen Brasil Gestão Empresarial Ltda
    CNPJ 39.819.814/0001-98 · Desde 2020
    CAU PJ69468-1 · CRECI 11689-J
    Rua Samuel Heusi, 463 · Itajaí · Santa Catarina

Os dados entraram em `lib/site-config.ts`, numa constante só, e dali alimentam
três lugares — repetir número de registro em três arquivos é garantir que um
deles fique para trás no dia em que mudar:

- **Rodapé de todas as 237 páginas.** Antes tinha só o aviso de copyright.
  Registro profissional num blog de avaliação de imóveis não é enfeite: as
  diretrizes de avaliação de qualidade do Google mandam procurar quem responde
  pelo site e com que autoridade, e CAU e CRECI são o que diz quem pode assinar
  um laudo.
- **JSON-LD de `Organization`**, novo, em toda página. Antes existia apenas
  `publisher: { "@type": "Organization", name: "Valen Brasil" }` dentro do
  `BlogPosting` de cada artigo — um nome solto, sem endereço nem registro. Agora
  há um `@id` (`https://valenbrasil.com/#organizacao`) com `legalName`,
  `foundingDate`, `taxID`, `address`, `telephone` e os registros como
  `identifier` (CNPJ, CAU, CRECI), que é onde o schema.org acomoda registro
  emitido por terceiro. O `publisher` dos 206 artigos passou a apontar para esse
  `@id`: em vez de 206 organizações homônimas, uma só, identificada.
- **As duas páginas legais**, na seção do controlador e na de contato.

`vatID` foi descartado de propósito: CNPJ é `taxID`; `vatID` é registro de IVA e
não existe no Brasil.

## Apresentação das duas páginas

**Texto justificado.** Só as duas páginas legais, pela classe
`.texto-justificado`. Num artigo o texto é interrompido o tempo todo por imagem,
citação e subtítulo, e justificar abriria buracos; um documento legal é lido em
bloco, com parágrafos longos e seguidos, que é o caso em que a margem direita
reta ajuda. Vai com `hyphens: auto` por necessidade: justificar sem hifenizar
espalha o espaço que sobra entre poucas palavras e produz rios brancos
verticais. A hifenização depende do `lang` da página, que é `pt-BR`.

**Bloco de contato idêntico nos dois documentos**, byte a byte — mesma ordem,
mesmos rótulos, mesmos links:

    Razão social · CNPJ · Registros profissionais · Em atividade desde ·
    Endereço · E-mail · Dados pessoais e direitos do titular · WhatsApp

Antes divergiam: a política não trazia o e-mail geral nem o link do WhatsApp, e
os termos listavam os mesmos itens noutra ordem, com o canal de privacidade por
último e com outro rótulo.

Isso obrigou a afrouxar uma regra do portão de conferência, que reprovava
qualquer aparição de `contato@valenbrasil.com` na política. A regra existia para
impedir o defeito de 2025 — mandar o titular exercer direitos no e-mail geral —,
e o jeito certo de exprimi-la não é banir o endereço, é exigir que ele nunca
apareça no mesmo item que fala de direito, titular ou LGPD. O portão agora
confere isso, e também que `privacidade@` esteja presente.

## Conferência independente — 43 achados, 19 sobreviveram

Quatro lentes independentes (exatidão factual, coerência entre os documentos,
LGPD e escrita) leram os textos já publicados; cada achado passou por três
céticos com instrução de refutar. Dos 43 brutos, 19 sobreviveram e todos foram
corrigidos.

### O bloqueante: o YouTube não estava na política

A política dizia "**Quatro serviços de terceiros participam do funcionamento do
blog**" e encerrava a seção apresentando o WhatsApp como o único terceiro a
mais, contactado só no clique. São cinco.

`components/PostBody.tsx` renderiza o bloco `embed` como `<iframe src={value.url}>`
puro, e dois artigos publicados carregam o player — `/biografia-mackintosh/` e
`/distrito-sanitario-al-daayan-doha/`, ambos com
`src="https://www.youtube.com/embed/..."`. O `loading="lazy"` adia a requisição
até a rolagem; não a condiciona a clique. Abrir o artigo e rolar já faz o
navegador pedir o player ao **www.youtube.com** — domínio com cookie, não
`youtube-nocookie.com` —, que recebe IP, dados do navegador e o endereço da
página.

O erro é do inventário que alimentou a redação: a varredura procurou `src` e
`href` de script e de imagem, e não olhou `<iframe>`. Uma política que promete
dizer exatamente quem recebe os dados do leitor, e erra o número para menos, é o
defeito mais grave que os dois documentos podiam ter.

Corrigido em quatro pontos: a contagem fechada da seção 5 abriu, entrou um
parágrafo descrevendo o player, a seção 2 passou a citá-lo entre o que registra
dado automaticamente, e a seção 8 o incluiu na transferência internacional.

**Decisão pendente da empresa:** trocar os dois embeds por `youtube-nocookie.com`
é mudança de uma palavra e reduz de verdade o que vai para o Google. Se for
feita, a política precisa passar a descrever o que valer então.

### Os outros dezoito

- **Direitos do titular (art. 19).** O texto prometia entregar o acesso
  "imediatamente" e sem condição, e o parágrafo seguinte, na mesma seção, dizia
  que não há como ligar registro de audiência a pessoa identificada. Vale contra
  o controlador o compromisso mais amplo que ele publicou. A ressalva entrou
  para dentro do compromisso.
- **Criança (art. 14).** "Não tratamos conscientemente dados de crianças" é
  importação da fórmula norte-americana do COPPA; o art. 14 não é condicionado
  ao conhecimento do controlador, e a frase anterior já admitia não haver como
  saber a idade de quem lê. Passou a descrever o que acontece.
- **Ahrefs sem cookie.** "Não confirmamos isso de forma independente, então não
  garantimos que nada seja gravado no seu navegador" transferia ao visitante uma
  incerteza que é de quem decidiu carregar o script. Agora o texto diz de quem é
  o ônus.
- **Identificador `_ga` por e-mail.** O documento se comprometia a buscar
  registros a partir de um identificador que qualquer pessoa pode digitar, sem
  etapa de verificação nem limite. Entrou o limite.
- **"Que integra estes Termos".** A Política é cumprimento do dever de informação
  do art. 9º, não cláusula de contrato aceito por navegação.
- **Alcance dos Termos.** A `description` restringia ao blog um documento que
  rege os dois sites.
- Mais dez ajustes de escrita: repetição de "incidente", "aqui" solto, o
  anglicismo "websites" onde o próprio parágrafo define "Sites", "CDN" e "plantas
  de valores" sem explicação, siglas de conselho sem o nome por extenso, e a
  forma de citar lei alinhada entre os dois documentos.

## Nota de 6 de setembro de 2026

Este documento descreve o estado em que as páginas legais foram reescritas,
quando o blog carregava Google Analytics e Ahrefs em toda visita. Não é mais o
estado atual: os identificadores de medição foram retirados a pedido da
empresa, que vai adotar outra forma de rastreio, e as páginas legais passaram a
dizer que o blog não mede audiência e não grava cookie — o que é verdade
enquanto as constantes de `site/lib/site-config.ts` estiverem vazias.

Os identificadores que apareciam aqui foram removidos junto: um relatório não é
lugar de guardar código que a empresa pediu para tirar do projeto.

Quando a nova medição entrar, as páginas legais voltam a descrevê-la, e é este
documento que registra o método — inventário conferido no HTML publicado, nada
afirmado sem verificação — a ser repetido.
