import Link from 'next/link'
import { EMPRESA, INSTITUTIONAL_URL } from '@/lib/site-config'

/*
  O rodapé carrega a identificação da empresa, não só o aviso de copyright.

  Registro profissional num blog de avaliação de imóveis não é enfeite: as
  diretrizes de avaliação de qualidade do Google mandam o avaliador procurar
  quem responde pelo site e com que autoridade, e este é um tema em que a
  informação errada custa dinheiro a quem lê. CAU e CRECI dizem quem pode
  assinar um laudo. Os dados são os mesmos do rodapé do site institucional.
*/
export function Footer() {
  const { razaoSocial, cnpj, registros, fundacao, endereco } = EMPRESA
  const ano = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-neutral-200 bg-neutral-50 py-10">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-6 text-sm text-neutral-500 md:flex-row md:justify-between">
        <div className="flex flex-col gap-1">
          <a href={INSTITUTIONAL_URL} className="font-medium text-neutral-700 hover:text-sage-700">
            {razaoSocial}
          </a>
          <span>
            CNPJ {cnpj} · Desde {fundacao}
          </span>
          <span>{registros.map((r) => `${r.conselho} ${r.numero}`).join(' · ')}</span>
          <span>
            {endereco.logradouro} · {endereco.cidade} · {endereco.estadoNome}
          </span>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <nav className="flex gap-5">
            <Link href="/politica-de-privacidade" className="text-neutral-500 hover:text-sage-700">
              Política de Privacidade
            </Link>
            <Link href="/termos-de-uso" className="text-neutral-500 hover:text-sage-700">
              Termos de Uso
            </Link>
          </nav>
          <span>{ano} @ valenbrasil.com | Todos os Direitos Reservados.</span>
        </div>
      </div>
    </footer>
  )
}
