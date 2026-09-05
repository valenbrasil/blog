import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { INSTITUTIONAL_URL, WHATSAPP_URL } from '@/lib/site-config'

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1080px] items-center justify-between px-6">
        <Link href="/" aria-label="Blog da Valen Brasil">
          <Logo />
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href={INSTITUTIONAL_URL}
            className="text-sm font-medium text-neutral-700 hover:text-sage-700"
          >
            Home
          </a>
          <Link href="/" className="text-sm font-medium text-neutral-900 hover:text-sage-700">
            Blog
          </Link>
          {/* Envolvido num span porque `hidden` e `inline-flex` são ambas
              utilitárias de display: qual vence depende da ordem na folha
              gerada, não da ordem no atributo class. */}
          <span className="hidden sm:block">
            <Button href={WHATSAPP_URL} size="sm" variant="outline" iconRight="message-circle">
              Fale conosco
            </Button>
          </span>
        </nav>
      </div>
    </header>
  )
}
