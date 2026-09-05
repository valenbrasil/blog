const tones = {
  brand: 'bg-sage-50 text-sage-700',
  neutral: 'bg-neutral-100 text-neutral-600',
} as const

const sizes = {
  sm: 'px-2 py-0.5 text-[0.6875rem]',
  md: 'px-2.5 py-1 text-xs',
} as const

export function Badge({
  children,
  tone = 'neutral',
  size = 'md',
}: {
  children: React.ReactNode
  tone?: keyof typeof tones
  size?: keyof typeof sizes
}) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-pill font-medium ${tones[tone]} ${sizes[size]}`}
    >
      {children}
    </span>
  )
}
