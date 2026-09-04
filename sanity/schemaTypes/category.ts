import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  type: 'document',
  title: 'Categoria',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', type: 'text' }),
  ],
})
