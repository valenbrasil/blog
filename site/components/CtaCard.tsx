import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { WHATSAPP_URL } from '@/lib/site-config'

/**
 * Chamada de fim de artigo, com a copy do kit de blog: prazo concreto, verbo no
 * imperativo, sem urgência artificial.
 */
export function CtaCard() {
  return (
    <Card tone="subtle" className="mt-12">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-xl leading-snug font-medium text-neutral-900">
            Quer saber o valor do seu imóvel?
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Laudo de avaliação a partir de 3 dias úteis.
          </p>
        </div>
        <Button href={WHATSAPP_URL} iconRight="arrow-right">
          Solicitar avaliação
        </Button>
      </div>
    </Card>
  )
}
