import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'jk3z4mls',
  dataset: 'production',
  apiVersion: '2024-10-01',
  useCdn: true,
})
