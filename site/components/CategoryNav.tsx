import Link from 'next/link'
import type { Category } from '@/lib/types'

/**
 * As abas em pílula do kit. Ali o filtro é estado de componente; aqui são links
 * para as rotas de categoria, que já existem e são estáticas — o mesmo desenho
 * sem depender de JS.
 */
export function CategoryNav({
  categories,
  active,
}: {
  categories: Category[]
  active?: string
}) {
  const base =
    'rounded-control px-3 py-1.5 text-sm transition-colors duration-[120ms] ease-in-out whitespace-nowrap'

  return (
    <nav
      aria-label="Categorias"
      className="-mx-6 flex gap-1 overflow-x-auto rounded-control px-6 sm:mx-0 sm:bg-neutral-100 sm:p-1"
    >
      <Link
        href="/"
        aria-current={active ? undefined : 'page'}
        className={`${base} ${
          active
            ? 'text-neutral-600 hover:text-neutral-900'
            : 'bg-white font-medium text-neutral-900 shadow-xs'
        }`}
      >
        Todos
      </Link>
      {categories.map((category) => {
        const current = category.slug === active
        return (
          <Link
            key={category._id}
            href={`/categoria/${category.slug}`}
            aria-current={current ? 'page' : undefined}
            className={`${base} ${
              current
                ? 'bg-white font-medium text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {category.title}
          </Link>
        )
      })}
    </nav>
  )
}
