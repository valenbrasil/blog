import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  type: 'document',
  title: 'Categoria',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Descrição',
      description:
        'Texto visível no topo da página da categoria. De 30 a 50 palavras: diga o que a ' +
        'categoria contém, para quem chega da busca decidir numa olhada se é o que procura.',
    }),
    /*
      Duas descrições, de propósito.

      A `description` acima é o texto que o leitor vê, e tem 30 a 50 palavras. A
      meta description do Google é exibida até cerca de 155 caracteres — a
      descrição longa entraria cortada no meio de uma frase.

      Sem este campo, `generateMetadata` usava a `description` inteira e era isso
      que acontecia. Deixado em branco, o comportamento antigo volta: a
      `description` é usada como estava.
    */
    defineField({
      name: 'seoDescription',
      type: 'text',
      title: 'Meta description',
      description: 'Versão curta para o resultado de busca. Até 155 caracteres.',
      validation: (rule) => rule.max(155),
    }),
  ],
})
