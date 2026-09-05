export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso))
}

/**
 * Forma abreviada usada nas linhas de metadados do design system
 * ("19 de mar de 2026"). O Intl devolve o mês com ponto de abreviação e o kit
 * não usa, então tiramos.
 */
export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeZone: 'America/Sao_Paulo',
  })
    .format(new Date(iso))
    .replace('.', '')
}
