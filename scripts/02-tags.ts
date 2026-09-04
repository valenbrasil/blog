import { getTags } from './ghostExport'
import { client } from './sanityClient'
import { categoryId } from './ids'

const DRY_RUN = process.argv.includes('--dry-run')
const tags = await getTags()

// OBRIGATÓRIO: tags internas do Ghost (prefixo "#") não viram categoria
const docs = tags
  .filter((t: any) => t.visibility !== 'internal')
  .map((t: any) => ({
    _id: categoryId(t),
    _type: 'category',
    title: t.name,
    slug: { _type: 'slug', current: t.slug },
    description: t.description ?? undefined,
  }))

if (DRY_RUN) {
  console.log(JSON.stringify(docs, null, 2))
  process.exit(0)
}

const tx = client.transaction()
docs.forEach((d: any) => tx.createOrReplace(d))
await tx.commit()
console.log(`✓ ${docs.length} categorias`)
