import Image from 'next/image'
import lettering from '@/public/valen-logo.png'

/**
 * A marca é o arquivo, nunca redesenhada: o guia proíbe recriar o lettering em
 * SVG/CSS ou aproximá-lo com outra fonte.
 *
 * 285px é a largura que o lettering ocupa no cabeçalho de valenbrasil.com — lá
 * o contêiner é 285x31 com object-fit: cover, que só recorta a margem
 * transparente do PNG. Aqui o arquivo aparece inteiro na proporção natural
 * (285x40), então o lettering visível fica do mesmo tamanho do site oficial,
 * com a margem do arquivo virando respiro dentro do cabeçalho de 76px.
 *
 * Em telas estreitas ele encolhe, senão não sobraria espaço para a navegação.
 */
export function Logo() {
  return (
    <Image
      src={lettering}
      alt="Valen Brasil"
      priority
      className="h-auto w-[180px] sm:w-[285px]"
    />
  )
}
