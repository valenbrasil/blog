import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-neutral-200 bg-neutral-50 py-8">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-4 px-6 text-sm text-neutral-500 sm:flex-row sm:justify-between">
        <span>{year} @ valenbrasil.com | Todos os Direitos Reservados.</span>
        <nav className="flex gap-5">
          <Link href="/privacidade" className="text-neutral-500 hover:text-sage-700">
            Política de Privacidade
          </Link>
          <Link href="/termos" className="text-neutral-500 hover:text-sage-700">
            Termos de Uso
          </Link>
        </nav>
      </div>
    </footer>
  )
}
