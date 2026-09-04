import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-stone-200">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6">
        <Link href="/" className="text-xl font-semibold text-stone-900">
          Valen Brasil
        </Link>
        <nav className="flex gap-6 text-sm text-stone-600">
          <Link href="/" className="hover:text-stone-900">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  )
}
