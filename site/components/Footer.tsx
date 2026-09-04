import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-stone-200">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:justify-between">
        <p>&copy; {year} Valen Brasil</p>
        <nav className="flex gap-4">
          <Link href="/privacidade" className="hover:text-stone-900">
            Política de Privacidade
          </Link>
          <Link href="/termos" className="hover:text-stone-900">
            Termos de Uso
          </Link>
        </nav>
      </div>
    </footer>
  )
}
