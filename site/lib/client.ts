import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'jk3z4mls',
  dataset: 'production',
  apiVersion: '2024-10-01',
  /*
    Sem CDN, de propósito. O site é `output: 'export'`: todas estas consultas
    acontecem uma única vez, durante o build, e nunca no navegador de ninguém —
    então a latência que o CDN economizaria não chega a leitor nenhum, e o que
    resta é só o risco do cache.

    E o risco é concreto: o CDN guarda cada consulta em separado, então um build
    disparado logo após uma publicação podia sair internamente inconsistente —
    as rotas de artigo lendo o dado novo e o sitemap ainda lendo o antigo.
    Aconteceu ao renomear um slug: o sitemap listou o endereço velho, que já não
    existia mais como conteúdo.

    O custo é algumas centenas de requisições não cacheadas por build, o que
    cabe folgado na cota — e a alternativa é publicar sitemap mentindo sobre o
    próprio site.
  */
  useCdn: false,

  /*
    Repetição explícita, porque o custo acima tem uma consequência: são
    centenas de requisições por build e basta UMA falhar para o
    `output: 'export'` inteiro abortar. Foi o que aconteceu no build 29 —
    `ECONNRESET` ao buscar um único artigo, e as 237 páginas foram perdidas:

        Error occurred prerendering page "/itbi"
        TypeError: fetch failed … [cause]: Error: read ECONNRESET

    O padrão do cliente já é 5 tentativas e ECONNRESET consta da lista de
    erros repetíveis, mas há uma brecha: para erro de rede o `get-it` recusa
    repetir quando o método não é GET nem HEAD, e consulta longa vai por POST.
    Consulta é idempotente — repetir é sempre seguro aqui.

    A espera é mais generosa que a padrão (100ms dobrando) porque o build não
    tem pressa e um reset costuma vir de aperto momentâneo do outro lado:
    esperar mais resolve mais.
  */
  maxRetries: 8,
  retryDelay: (attemptNumber) =>
    Math.min(500 * 2 ** attemptNumber, 10_000) + Math.random() * 250,
})
