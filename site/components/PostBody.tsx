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
            className="h-auto w-full rounded-card"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-neutral-500">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      )
    },
    codeBlock: ({ value }) => (
      <pre className="my-6 overflow-x-auto rounded-card bg-neutral-900 p-4 font-mono text-sm text-neutral-100">
        <code>{value.code}</code>
      </pre>
    ),
    embed: ({ value }) => (
      <div className="my-8 aspect-video">
        <iframe
          src={value.url}
          className="h-full w-full rounded-card"
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
    <div className="prose prose-valen max-w-none">
      <PortableText value={body} components={components} />
    </div>
  )
}
