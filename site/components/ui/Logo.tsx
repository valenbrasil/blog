import Image from 'next/image'
import icone from '@/public/valen-icone.png'
import lettering from '@/public/valen-logo.png'

/**
 * A marca são dois arquivos e nunca é redesenhada: o guia proíbe recriar o
 * lettering em SVG/CSS ou aproximá-lo com outra fonte, então isto é sempre
 * <Image>, nunca texto.
 *
 * Em telas estreitas fica só o selo, que o guia prevê até 16px. Encolher o
 * lettering junto o levaria abaixo do legível, e mantê-lo no tamanho cheio
 * empurraria a navegação para fora da tela.
 */
export function Logo({ height = 18 }: { height?: number }) {
  return (
    <span className="flex items-center gap-3">
      <Image src={icone} alt="Valen Brasil" height={height + 10} width={height + 10} priority />
      <Image
        src={lettering}
        alt=""
        height={height}
        width={Math.round((height * 1500) / 210)}
        priority
        className="hidden sm:block"
      />
    </span>
  )
}
