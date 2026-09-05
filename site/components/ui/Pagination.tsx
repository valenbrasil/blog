import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Paginação por links reais, não por estado: o site é estático e cada página do
 * feed tem a sua própria rota, então navegar aqui precisa funcionar sem JS e
 * render um endereço que o Google consegue indexar.
 *
 * Com 17 páginas não cabe listar todas, então mostramos uma janela em torno da
 * atual, sempre com a primeira e a última nas pontas.
 */
function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set([1, total, current, current - 1, current + 1])
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p))

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  return sorted.flatMap((page, i) =>
    i > 0 && page - sorted[i - 1] > 1 ? ['gap' as const, page] : [page],
  )
}

export function Pagination({
  page,
  total,
  hrefFor,
}: {
  page: number
  total: number
  hrefFor: (page: number) => string
}) {
  if (total <= 1) return null

  const box =
    'flex h-9 min-w-9 items-center justify-center rounded-control border px-2 text-sm transition-colors duration-[120ms] ease-in-out'
  const idle = 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
  const disabled = 'border-neutral-200 bg-white text-neutral-300'

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" aria-label="Página anterior" className={`${box} ${idle}`}>
          <ChevronLeft size={16} strokeWidth={1.75} aria-hidden />
        </Link>
      ) : (
        <span aria-hidden className={`${box} ${disabled}`}>
          <ChevronLeft size={16} strokeWidth={1.75} />
        </span>
      )}

      {pageWindow(page, total).map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-neutral-400">
            …
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className={`${box} border-sage-200 bg-sage-50 font-medium text-sage-700`}
          >
            {item}
          </span>
        ) : (
          <Link key={item} href={hrefFor(item)} className={`${box} ${idle}`}>
            {item}
          </Link>
        ),
      )}

      {page < total ? (
        <Link href={hrefFor(page + 1)} rel="next" aria-label="Próxima página" className={`${box} ${idle}`}>
          <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
        </Link>
      ) : (
        <span aria-hidden className={`${box} ${disabled}`}>
          <ChevronRight size={16} strokeWidth={1.75} />
        </span>
      )}
    </nav>
  )
}
