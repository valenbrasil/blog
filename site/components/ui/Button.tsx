import Link from 'next/link'
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react'

/**
 * O guia manda resolver ícones do Lucide por nome. Este mapa existe para manter
 * a prop `icon` como string sem arrastar o pacote inteiro para o bundle.
 */
const icons = {
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'message-circle': MessageCircle,
} as const

export type IconName = keyof typeof icons

const variants = {
  // Verde é acento: fundo sólido só no botão primário, sempre com texto branco.
  solid: 'bg-sage-500 text-white hover:bg-sage-600 border border-transparent',
  outline: 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50',
  ghost: 'bg-transparent text-neutral-700 border border-transparent hover:bg-neutral-100',
  link: 'bg-transparent text-sage-600 hover:text-sage-700 border-0 p-0 h-auto',
} as const

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
} as const

type Props = {
  children: React.ReactNode
  href: string
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  iconLeft?: IconName
  iconRight?: IconName
  className?: string
}

export function Button({
  children,
  href,
  variant = 'solid',
  size = 'md',
  iconLeft,
  iconRight,
  className = '',
}: Props) {
  const Left = iconLeft ? icons[iconLeft] : null
  const Right = iconRight ? icons[iconRight] : null
  const external = href.startsWith('http')

  const content = (
    <>
      {Left ? <Left size={16} strokeWidth={1.75} aria-hidden /> : null}
      {children}
      {Right ? <Right size={16} strokeWidth={1.75} aria-hidden /> : null}
    </>
  )

  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap',
    'transition-colors duration-[120ms] ease-in-out',
    variants[variant],
    variant === 'link' ? 'text-sm' : sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
