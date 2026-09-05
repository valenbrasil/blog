/**
 * Card do guia: branco, borda de 1px, raio de 12px, sombra mínima. Sem
 * gradiente e sem borda colorida só à esquerda.
 */
export function Card({
  children,
  tone = 'default',
  interactive = false,
  padded = true,
  className = '',
}: {
  children: React.ReactNode
  tone?: 'default' | 'subtle'
  interactive?: boolean
  padded?: boolean
  className?: string
}) {
  return (
    <div
      className={[
        'rounded-card border border-neutral-200 shadow-xs',
        tone === 'subtle' ? 'bg-neutral-50' : 'bg-white',
        padded ? 'p-5' : 'overflow-hidden',
        interactive
          ? 'transition-shadow duration-200 ease-in-out hover:border-neutral-300 hover:shadow-md'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
