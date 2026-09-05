import { defineType, defineField, defineArrayMember } from 'sanity'

export const post = defineType({
  name: 'post',
  type: 'document',
  title: 'Post',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'excerpt', type: 'text' }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        // Os três campos existem para leitores diferentes: o alt é lido em voz
        // alta por leitor de tela e aparece quando a imagem não carrega; o title
        // só surge no hover do mouse; a caption é texto visível para todo mundo.
        // Repetir o mesmo texto nos três não ajuda ninguém.
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo (alt)',
          description:
            'Descreva o que a imagem mostra, para quem usa leitor de tela. Frase curta e objetiva, sem "imagem de".',
        },
        {
          name: 'title',
          type: 'string',
          title: 'Título (hover)',
          description:
            'Complemento exibido quando o mouse para sobre a imagem. Acrescente algo que o alt não diz — crédito, local, data. Deixe vazio se for só repetir o alt.',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Legenda',
          description:
            'Legenda visível abaixo da imagem, com o contexto que o leitor precisa para entender por que ela está no texto.',
        },
      ],
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            // Declarar `annotations` SUBSTITUI a lista padrão do Sanity, então o
            // link precisa ser redeclarado aqui — mantendo _type 'link' e o campo
            // 'href' com esse nome exato, que é como os 565 markDefs importados do
            // Ghost já estão gravados. Mudança aditiva: só entra o campo novo.
            // `decorators` fica de fora de propósito, para preservar o padrão
            // (negrito, itálico, código).
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    // O acervo tem 195 links relativos ("/slug") e o tipo `url`
                    // do Sanity só aceita http/https por padrão — sem afrouxar a
                    // validação, esses links apareceriam como erro no Studio.
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                  defineField({
                    name: 'nofollow',
                    type: 'boolean',
                    title: 'Marcar como nofollow',
                    description:
                      'Deixe desmarcado. O padrão do blog é dofollow: link de saída para fonte de autoridade é sinal positivo de qualidade para o Google. Marque apenas em link patrocinado, pago ou de afiliado, onde o nofollow é exigido.',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        {
          type: 'image',
          // Aditivo de propósito: 288 das 304 imagens do acervo já têm `alt`
          // gravado (veio da migração do Ghost), mas o campo nunca foi declarado
          // — o Sanity guardava o valor sem exibi-lo no Studio. Declará-lo aqui
          // devolve o dado ao editor; remover ou renomear qualquer campo apagaria
          // o que já está gravado.
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo (alt)',
              description:
                'Descreva o que a imagem mostra, para quem usa leitor de tela. Frase curta e objetiva, sem "imagem de".',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Título (hover)',
              description:
                'Complemento exibido quando o mouse para sobre a imagem. Acrescente algo que o alt não diz — crédito, local, data. Deixe vazio se for só repetir o alt.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Legenda',
              description:
                'Legenda visível abaixo da imagem, com o contexto que o leitor precisa para entender por que ela está no texto.',
            },
          ],
        },
        { type: 'codeBlock' },
        { type: 'embed' },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', type: 'string', validation: (Rule) => Rule.max(65) }),
        defineField({ name: 'metaDescription', type: 'text', validation: (Rule) => Rule.max(155) }),
      ],
    }),
    // metadados legados — auditoria, redirects e reexecução
    defineField({ name: 'ghostId', type: 'string', readOnly: true }),
    defineField({ name: 'legacyUrl', type: 'url', readOnly: true }),
  ],
})
