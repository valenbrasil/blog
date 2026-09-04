import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  type: 'document',
  title: 'Post',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'excerpt', type: 'text' }),
    defineField({ name: 'mainImage', type: 'image', options: { hotspot: true } }),
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
        { type: 'block' },
        { type: 'image', fields: [{ name: 'caption', type: 'string' }] },
        { type: 'codeBlock' },
        { type: 'embed' },
      ],
    }),
    // metadados legados — auditoria, redirects e reexecução
    defineField({ name: 'ghostId', type: 'string', readOnly: true }),
    defineField({ name: 'legacyUrl', type: 'url', readOnly: true }),
  ],
})
