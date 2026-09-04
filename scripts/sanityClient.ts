import { createClient } from '@sanity/client'
import 'dotenv/config'

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-10-01',
  useCdn: false, // OBRIGATÓRIO em scripts de escrita
})
