import { defineType, defineField } from 'sanity'

export const codeBlock = defineType({
  name: 'codeBlock',
  type: 'object',
  title: 'Código',
  fields: [
    defineField({ name: 'language', type: 'string' }),
    defineField({ name: 'code', type: 'text' }),
  ],
})

export const embed = defineType({
  name: 'embed',
  type: 'object',
  title: 'Embed',
  fields: [
    defineField({ name: 'url', type: 'url' }),
    defineField({ name: 'provider', type: 'string' }), // youtube | vimeo | twitter | other
  ],
})
