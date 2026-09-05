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
})
