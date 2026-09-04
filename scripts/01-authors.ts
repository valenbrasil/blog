import { getAuthors } from './ghostExport'
import { client } from './sanityClient'
import { uploadImage } from './images'
import { authorId } from './ids'

const DRY_RUN = process.argv.includes('--dry-run')
const authors = await getAuthors()

const docs = []
for (const a of authors) {
  docs.push({
    _id: authorId(a),
    _type: 'author',
    name: a.name,
    slug: { _type: 'slug', current: a.slug },
    bio: a.bio ?? undefined,
    website: a.website ?? undefined,
    image: a.profile_image ? await uploadImage(a.profile_image) : undefined,
  })
}

if (DRY_RUN) {
  console.log(JSON.stringify(docs, null, 2))
  process.exit(0)
}

const tx = client.transaction()
docs.forEach((d) => tx.createOrReplace(d))
await tx.commit()
console.log(`✓ ${docs.length} autores`)
