'use client'

/*
  Botão do rodapé que reabre o aviso de cookies.

  Cliente, e não servidor, porque precisa de onClick — o `onclick=""` que o
  README do arquivo de consentimento sugere é HTML solto e o React não o
  executa; escrito assim, o botão ficaria mudo sem erro nenhum, que é o pior
  jeito de quebrar.

  A LGPD (art. 8º, § 5º) dá à pessoa o direito de revogar o consentimento a
  qualquer momento, e por procedimento tão simples quanto o de concedê-lo. Este
  botão é esse procedimento: sem ele, quem clicou "Aceitar" uma vez não teria
  como voltar atrás.

  `window.ValenConsent` é criado pelo script de consentimento, que carrega com
  `defer` — pode não existir ainda se alguém clicar durante o carregamento da
  página, daí o encadeamento opcional em vez de confiar que já esteja lá.
*/

declare global {
  interface Window {
    ValenConsent?: { abrirPreferencias: () => void; decisao: () => string | null }
  }
}

export function PreferenciasCookies({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.ValenConsent?.abrirPreferencias()}>
      Preferências de cookies
    </button>
  )
}
