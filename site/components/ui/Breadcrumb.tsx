import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export type Crumb = { label: string; href?: string }

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 ? (
                <ChevronRight size={14} strokeWidth={1.75} className="text-neutral-300" aria-hidden />
              ) : null}
              {item.href && !last ? (
                <Link href={item.href} className="text-neutral-500 hover:text-sage-700">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={last ? 'max-w-[42ch] truncate text-neutral-700' : 'text-neutral-500'}
                  aria-current={last ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
