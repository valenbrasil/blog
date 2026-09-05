/*
  Bloco de dados estruturados (schema.org) em JSON-LD.

  Por que dangerouslySetInnerHTML: o React escapa o texto que passa como filho
  de um elemento, e dentro de <script> isso vira JSON quebrado (aspas viram
  &quot;) que o Google não consegue ler. Não existe caminho oficial no Next para
  serializar filhos de <script> preservando o conteúdo — injetar a string já
  pronta é a forma recomendada pela própria documentação do App Router.

  Por que é seguro: o `data` é montado por nós a partir do dataset do Sanity,
  onde só a redação publica — não há entrada de usuário anônimo em nenhum campo.
  Ainda assim `JSON.stringify` escapa aspas e barras invertidas, então o único
  risco residual seria um "</script>" digitado dentro de um título no CMS; o
  escape do "<" abaixo fecha essa porta sem alterar o que o parser JSON lê.
*/
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
