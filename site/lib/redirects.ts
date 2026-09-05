/**
 * Endereços antigos que mudaram de slug, apontando para o slug atual.
 *
 * Existe porque `output: 'export'` não emite 301: sem isto, trocar um slug
 * transforma a URL antiga em 404 seco, e todo backlink e histórico de
 * ranqueamento daquela página vai junto.
 *
 * O que se consegue num site estático é uma página-ponte no endereço antigo:
 * `<link rel="canonical">` apontando para o novo — que é o sinal que o Google
 * de fato consolida — mais um `<meta http-equiv="refresh">` de zero segundo
 * para o visitante. Não é tão bom quanto um 301, mas preserva o leitor e a
 * maior parte do sinal de busca.
 *
 * Cada entrada aqui gera uma rota estática a mais no build. Só acrescente slug
 * que existiu publicado: apontar para um endereço que nunca esteve no ar não
 * recupera nada e ainda cria página órfã.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // Renomeado ao separar este artigo de `direito-imobiliario`, que tinha o
  // mesmo H1 e a mesma palavra-chave. O sufixo `-2` só existia porque o slug
  // estava ocupado; publicado em out/2025 e presente no sitemap do Ghost.
  'direito-imobiliario-2': 'advocacia-imobiliaria',
}
