import { defineType, defineField } from 'sanity'

export const author = defineType({
  name: 'author',
  type: 'document',
  title: 'Autor',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'bio', type: 'text' }),
    defineField({ name: 'image', type: 'image' }),
    defineField({ name: 'website', type: 'url' }),
  ],
})
