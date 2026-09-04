import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import type { BodyBlock } from '@/lib/types'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlFor(value).width(1200).fit('max').auto('format').url()
      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt || ''}
            width={1200}
            height={800}
            className="rounded-lg w-full h-auto"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-sm text-stone-500 text-center">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      )
    },
    codeBlock: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded-lg bg-stone-900 p-4 text-sm text-stone-100">
        <code>{value.code}</code>
      </pre>
    ),
    embed: ({ value }) => (
      <div className="my-8 aspect-video">
        <iframe
          src={value.url}
          className="h-full w-full rounded-lg"
          allowFullScreen
          loading="lazy"
        />
      </div>
    ),
  },
}

export function PostBody({ body }: { body: BodyBlock[] }) {
  if (!body || body.length === 0) return null
  return (
    <div className="prose prose-stone max-w-none">
      <PortableText value={body} components={components} />
    </div>
  )
}
