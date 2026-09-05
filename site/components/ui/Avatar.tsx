/**
 * Iniciais sobre o verde-claro da marca. O único autor do blog não tem foto no
 * Sanity, então o fallback é o caso normal e não uma exceção.
 */
export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <span
      aria-hidden
      className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-sage-100 text-[0.625rem] font-semibold text-sage-700"
    >
      {initials}
    </span>
  )
}
