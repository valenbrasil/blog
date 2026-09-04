import { defineType, defineField } from 'sanity'

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
        { name: 'alt', type: 'string' },
        { name: 'caption', type: 'string' },
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
        { type: 'block' },
        { type: 'image', fields: [{ name: 'caption', type: 'string' }] },
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
