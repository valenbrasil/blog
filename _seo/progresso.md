# Progresso da auditoria

Uma linha por artigo, indexada pelo `_id` do Sanity para permitir retomar em
outra sessão.

## Estados

| Estado | Significa |
|---|---|
| `editado` | recebeu ao menos um patch no Sanity nesta auditoria — **185 artigos** |
| `pendente` | nenhum patch; passou apenas pelas varreduras do acervo — **21 artigos** |

Nenhum artigo está `aprovado`: aprovação é do autor, e nada foi submetido ainda.
A auditoria individual que o plano pede — um artigo por vez, com relatório — foi
concluída em **4 dos 206**. Os outros 182 marcados `editado` receberam correções
de lotes que varreram o acervo inteiro, não a leitura artigo a artigo.

## Fases, na ordem em que rodaram

| Código | O que fez | Artigos |
|---|---|---|
| `ref` | remoção do resíduo `?ref=` do rastreamento do Ghost | 46 |
| `links` | correção de links internos quebrados pela migração | 78 |
| `meta` | preenchimento de `metaTitle` e `metaDescription` | 59 |
| `canib` | desambiguação dos 5 pares críticos de canibalização | 7 |
| `slug` | renomeação `direito-imobiliario-2` → `advocacia-imobiliaria` | 1 |
| `ext` | links externos com âncora legítima, acervo inteiro | 127 |
| `dens` | densificação dos artigos de maior intenção comercial | 3 |
| `corr` | resíduo "Antes:/Depois:" e contradição de FAQ | 1 |
| `limp` | resíduo de edição e duplicação literal | 5 |

## Reversão

`_rev anterior` é o `_rev` do **primeiro** backup do artigo, ou seja o estado
antes de qualquer patch desta auditoria. `_rev atual` é o que está publicado
agora. Os JSON completos vivem em `_seo/backups/pre-<fase>/<slug>.json`, fora do
controle de versão.

| Ordem | _id | Slug | Estado | Fases | _rev anterior | _rev atual | Relatório |
|---|---|---|---|---|---|---|---|
| 1 | `post-686aef2a90342d000185eb5b` | 3-aplicativos-de-construcao | pendente | — | `—` | `—` | — |
| 2 | `post-686aef2a90342d000185eb34` | 7-cursos-online-para-arquitetos | pendente | — | `—` | `—` | — |
| 3 | `post-686aef2a90342d000185eb63` | a-estrutura-das-cidades-espanholas | editado | ref, meta | `U312e1WEeOlY6t2zslycGm` | `U312e1WEeOlY6t2zsmSRZC` | — |
| 4 | `post-686aef2a90342d000185eb48` | a-influencia-do-jardim-sensorial-na-experiencia-humana | pendente | — | `—` | `—` | — |
| 5 | `post-6807f2af99d0d30001611950` | adjudicacao-compulsoria | editado | ref, links, meta, ext | `U312e1WEeOlY6t2zslyTsU` | `U312e1WEeOlY6t2zsmUj6U` | — |
| 6 | `post-68a760ced9d9130001252c38` | administradoras-bens | editado | ref, ext | `QbRV0eIQAr15Jc3fFCAZsW` | `QbRV0eIQAr15Jc3fFCF8A5` | — |
| 7 | `post-68e66ef4cf0351000131f9df` | advocacia-imobiliaria | editado | slug, ext | `TC4AEZTvQdwZvosYYfI04F` | `TC4AEZTvQdwZvosYYfRC2Y` | — |
| 8 | `post-68238cb1627fff0001df1f56` | alienacao-fiduciaria | editado | meta, ext | `U312e1WEeOlY6t2zslyUfe` | `U312e1WEeOlY6t2zsmUjte` | — |
| 9 | `post-68b301398e290d00011b8f3c` | app-area-de-preservacao-permanente | editado | ref, ext | `QbRV0eIQAr15Jc3fFCAa5j` | `TC4AEZTvQdwZvosYYfR8zq` | — |
| 10 | `post-68e69bc2cf0351000131fa33` | aprovacao-de-projetos-na-prefeitura | editado | ext | `TC4AEZTvQdwZvosYYfI07s` | `TC4AEZTvQdwZvosYYfRIkg` | — |
| 11 | `post-686aef2a90342d000185eb68` | architecture-hunter | editado | meta | `TC4AEZTvQdwZvosYYfHwpR` | `U312e1WEeOlY6t2zsmSRxm` | — |
| 12 | `post-68b300e88e290d00011b8f30` | areas-de-protecao-ambiental | editado | ref, ext | `U312e1WEeOlY6t2zslygZ4` | `QbRV0eIQAr15Jc3fFCFAyK` | — |
| 13 | `post-686aef2a90342d000185eb6f` | arquitetura-barroca-explorando-estilo-e-influencias-historicas | editado | links | `U312e1WEeOlY6t2zslydGE` | `TC4AEZTvQdwZvosYYfQU0J` | — |
| 14 | `post-686aef2a90342d000185eb62` | arquitetura-e-igreja | editado | links, meta | `U312e1WEeOlY6t2zslyc4U` | `U312e1WEeOlY6t2zsmSSA4` | — |
| 15 | `post-686aef2a90342d000185eb32` | arquitetura-modular | editado | links, ext | `U312e1WEeOlY6t2zslyWFy` | `TC4AEZTvQdwZvosYYfRFA6` | — |
| 16 | `post-686aef2a90342d000185eb33` | arquitetura-sustentavel-na-pratica | pendente | — | `—` | `—` | — |
| 17 | `post-686aef2a90342d000185eb3f` | arquitetura-vernacular | editado | meta | `QbRV0eIQAr15Jc3fFCAYqz` | `QbRV0eIQAr15Jc3fFCEoRs` | — |
| 18 | `post-686aef2a90342d000185eb51` | arquitetura-vitoriana-e-eduardiana | editado | links | `TC4AEZTvQdwZvosYYfHvyD` | `QbRV0eIQAr15Jc3fFCElze` | — |
| 19 | `post-686aef2a90342d000185eb4f` | art-deco-nouveau-crafts-diferencas | editado | links | `TC4AEZTvQdwZvosYYfHvpk` | `QbRV0eIQAr15Jc3fFCElxl` | — |
| 20 | `post-68bae25c34162e0001650004` | ativo-imobilizado | editado | ref, links | `U312e1WEeOlY6t2zslyjbW` | `U312e1WEeOlY6t2zsmSDUa` | — |
| 21 | `post-68bae2b834162e0001650019` | avaliacao-de-empresa-guia-completo | editado | links | `TC4AEZTvQdwZvosYYfHzAb` | `U312e1WEeOlY6t2zsmSDgs` | — |
| 22 | `post-68bae49134162e0001650071` | avaliacao-de-imoveis-rurais-guia-para-proprietarios-e-investidores | editado | links, ext | `U312e1WEeOlY6t2zslykvS` | `TC4AEZTvQdwZvosYYfRG3k` | — |
| 23 | `post-68bad25a34162e000164fff2` | avaliacao-de-imovel-para-inventario | editado | links, ext | `QbRV0eIQAr15Jc3fFCAaPr` | `QbRV0eIQAr15Jc3fFCF8Sx` | — |
| 24 | `post-68bae29b34162e0001650012` | avaliacao-de-marcas | editado | ref | `TC4AEZTvQdwZvosYYfHz6y` | `QbRV0eIQAr15Jc3fFCEitA` | — |
| 25 | `post-67c03f8e6481b40001e4b7b0` | avaliacao-imobiliaria | editado | ext, dens, corr | `QbRV0eIQAr15Jc3fFCAYAD` | `QbRV0eIQAr15Jc3fFCFJNA` | `relatorios/avaliacao-imobiliaria.md` |
| 26 | `post-68bacd9634162e000164ff64` | avaliacao-imovel-comercial | editado | ext | `TC4AEZTvQdwZvosYYfHygM` | `U312e1WEeOlY6t2zsmVBaC` | — |
| 27 | `post-68a77dadde6f0800013af866` | avaliacao-mercadologica-de-imoveis | editado | ref, links, ext | `QbRV0eIQAr15Jc3fFCAZuP` | `U312e1WEeOlY6t2zsmV9T6` | — |
| 28 | `post-6807f08799d0d3000161192a` | averbacao | editado | links, ext, limp | `TC4AEZTvQdwZvosYYfHtmj` | `U312e1WEeOlY6t2zsmVzbS` | — |
| 29 | `post-688e29998f78810001f45fe1` | balneario-camboriu | editado | links | `TC4AEZTvQdwZvosYYfHxHG` | `QbRV0eIQAr15Jc3fFCEmG0` | — |
| 30 | `post-68bae2c934162e000165001f` | bens-intangivel-definicao | editado | links | `TC4AEZTvQdwZvosYYfHzFR` | `U312e1WEeOlY6t2zsmSDxG` | — |
| 31 | `post-686aef2a90342d000185eb4a` | biografia-alvaro-siza | editado | meta | `U312e1WEeOlY6t2zslyZ68` | `U312e1WEeOlY6t2zsmSSMM` | — |
| 32 | `post-686aef2a90342d000185eb5c` | biografia-eduardo-souto-de-moura | editado | meta, ext | `TC4AEZTvQdwZvosYYfHwav` | `TC4AEZTvQdwZvosYYfRFOc` | — |
| 33 | `post-686aef2a90342d000185eb55` | biografia-fran-silvestre | editado | ref | `U312e1WEeOlY6t2zslyawq` | `U312e1WEeOlY6t2zsmRhqE` | — |
| 34 | `post-686aef2a90342d000185eb43` | biografia-joao-figueiras-lima | pendente | — | `—` | `—` | — |
| 35 | `post-686aef2a90342d000185eb3a` | biografia-kengo-kuma | editado | meta | `U312e1WEeOlY6t2zslyXRi` | `QbRV0eIQAr15Jc3fFCEoTl` | — |
| 36 | `post-686aef2a90342d000185eb3e` | biografia-lina-bo-bardi | pendente | — | `—` | `—` | — |
| 37 | `post-686aef2a90342d000185eb4e` | biografia-mackintosh | editado | meta | `U312e1WEeOlY6t2zslyZpC` | `U312e1WEeOlY6t2zsmSSYe` | — |
| 38 | `post-686aef2a90342d000185eb39` | biografia-oscar-niemeyer | editado | ext | `U312e1WEeOlY6t2zslyXBK` | `U312e1WEeOlY6t2zsmV94W` | — |
| 39 | `post-686aef2a90342d000185eb71` | biografia-santiago-calatrava | editado | meta, ext | `TC4AEZTvQdwZvosYYfHx7a` | `TC4AEZTvQdwZvosYYfRFSF` | — |
| 40 | `post-68bacdfe34162e000164ff72` | blumenau-e-mercado-imobiliario | pendente | — | `—` | `—` | — |
| 41 | `post-688e29dd8f78810001f45fed` | brava-home-resort | pendente | — | `—` | `—` | — |
| 42 | `post-68baebca34162e000165019d` | bravissima-private-residence | editado | links | `TC4AEZTvQdwZvosYYfHziT` | `QbRV0eIQAr15Jc3fFCEmZV` | — |
| 43 | `post-68c80fcd5efebc0001f63723` | cadastro-imobiliario-brasileiro-cib | editado | ref, links, ext | `U312e1WEeOlY6t2zslynR8` | `TC4AEZTvQdwZvosYYfRIdQ` | — |
| 44 | `post-68a75f33d9d9130001252c25` | captador-imoveis | editado | ref, meta, ext | `U312e1WEeOlY6t2zslyemS` | `QbRV0eIQAr15Jc3fFCFAsf` | — |
| 45 | `post-68e6a7fbcf0351000131fadb` | cartas-de-creditos-no-consorcio | editado | ext | `TC4AEZTvQdwZvosYYfI0MO` | `TC4AEZTvQdwZvosYYfRIxz` | — |
| 46 | `post-686aef2a90342d000185eb38` | casa-container | editado | ext | `TC4AEZTvQdwZvosYYfHugN` | `TC4AEZTvQdwZvosYYfRFDj` | — |
| 47 | `post-681672489d322f0001f94441` | certidao-de-matricula-de-imovel | pendente | — | `—` | `—` | — |
| 48 | `post-68b1a64935652e0001f9a27b` | cessao-direitos-hereditarios | editado | ref, ext | `QbRV0eIQAr15Jc3fFCAZxY` | `U312e1WEeOlY6t2zsmUkMK` | — |
| 49 | `post-681672679d322f0001f94449` | cib-cadastro-imobiliario-brasileiro | editado | ref, meta, ext | `U312e1WEeOlY6t2zslyU4m` | `QbRV0eIQAr15Jc3fFCF88C` | — |
| 50 | `post-686aef2a90342d000185eb72` | cidade-das-artes-e-das-ciencias-cultura-e-inovacao | editado | links, meta | `QbRV0eIQAr15Jc3fFCAZX8` | `QbRV0eIQAr15Jc3fFCEoZQ` | — |
| 51 | `post-6807f0c199d0d30001611932` | cisao-empresarial | editado | links, meta, ext | `U312e1WEeOlY6t2zslyT5K` | `QbRV0eIQAr15Jc3fFCF84Q` | — |
| 52 | `post-68b1a74935652e0001f9a28f` | cna-cadastro-nacional-de-advogados | editado | ref, ext | `U312e1WEeOlY6t2zslyfho` | `TC4AEZTvQdwZvosYYfR8ox` | — |
| 53 | `post-686aef2a90342d000185eb49` | co-living | editado | meta | `U312e1WEeOlY6t2zslyYtq` | `U312e1WEeOlY6t2zsmST9W` | — |
| 54 | `post-686aef2a90342d000185eb47` | colagem-digital-na-arquitetura | pendente | — | `—` | `—` | — |
| 55 | `post-68b048a04b61a00001cb7e9c` | comissao-valores-mobiliarios-cvm | editado | ref, canib, ext | `U312e1WEeOlY6t2zslyfNK` | `QbRV0eIQAr15Jc3fFCFAwR` | — |
| 56 | `post-68bae49f34162e0001650078` | como-calcular-valor-do-aluguel | editado | links, ext | `QbRV0eIQAr15Jc3fFCAaZI` | `TC4AEZTvQdwZvosYYfRG8a` | — |
| 57 | `post-68b8a32fce1c730001db7aa2` | comodato | editado | links, ext | `QbRV0eIQAr15Jc3fFCAaEX` | `TC4AEZTvQdwZvosYYfR95t` | — |
| 58 | `post-6816728b9d322f0001f94451` | compra-e-venda-de-imovel | editado | ref, links, meta, ext, limp | `TC4AEZTvQdwZvosYYfHu3f` | `U312e1WEeOlY6t2zsmVznk` | — |
| 59 | `post-68e6a7b6cf0351000131fad5` | compra-e-venda-de-terreno | editado | ext | `QbRV0eIQAr15Jc3fFCAaqH` | `U312e1WEeOlY6t2zsmVEce` | — |
| 60 | `post-686aef2a90342d000185eb4b` | concursos-academicos-de-arquitetura | editado | meta, ext | `QbRV0eIQAr15Jc3fFCAZ7y` | `TC4AEZTvQdwZvosYYfRFHM` | — |
| 61 | `post-686aef2a90342d000185eb4d` | concursos-publicos-para-arquitetos | editado | meta, ext | `U312e1WEeOlY6t2zslyZcu` | `QbRV0eIQAr15Jc3fFCFAn0` | — |
| 62 | `post-68e6a244cf0351000131fa7f` | consorcio-financiamento | editado | ext | `QbRV0eIQAr15Jc3fFCAamV` | `QbRV0eIQAr15Jc3fFCFBHp` | — |
| 63 | `post-68b3026b8e290d00011b8f66` | construcao-em-area-de-reserva-legal | editado | ref, ext | `TC4AEZTvQdwZvosYYfHy1E` | `QbRV0eIQAr15Jc3fFCFB26` | — |
| 64 | `post-686aef2a90342d000185eb6d` | construindo-com-steel-frame | editado | links | `QbRV0eIQAr15Jc3fFCAZTM` | `TC4AEZTvQdwZvosYYfQTt3` | — |
| 65 | `post-68e6b869cf0351000131fba4` | construtora-incorporadora | editado | meta, ext | `U312e1WEeOlY6t2zslypU8` | `U312e1WEeOlY6t2zsmVFDW` | — |
| 66 | `post-68e6a2cacf0351000131faa1` | consultoria-imobiliaria | editado | ext | `TC4AEZTvQdwZvosYYfI0BV` | `QbRV0eIQAr15Jc3fFCFBNU` | — |
| 67 | `post-68bae2ec34162e0001650030` | controle-patrimonial | editado | ref | `U312e1WEeOlY6t2zslykSm` | `QbRV0eIQAr15Jc3fFCEj2b` | — |
| 68 | `post-68e6a368cf0351000131faba` | cotacao-de-hipoteca | editado | ref, links, ext | `TC4AEZTvQdwZvosYYfI0Il` | `U312e1WEeOlY6t2zsmVEE4` | — |
| 69 | `post-67c60370c0a5c6000141b6ea` | credibilidade-avaliador-de-imoveis | editado | links, meta | `TC4AEZTvQdwZvosYYfHtYD` | `TC4AEZTvQdwZvosYYfQXZg` | — |
| 70 | `post-68bacd5a34162e000164ff57` | credito-imobiliario | editado | ext | `TC4AEZTvQdwZvosYYfHycj` | `U312e1WEeOlY6t2zsmVBNu` | — |
| 71 | `post-68e6a387cf0351000131fac3` | cub | editado | ext | `U312e1WEeOlY6t2zslyoYm` | `U312e1WEeOlY6t2zsmVEQM` | — |
| 72 | `post-68e6a2e2cf0351000131faa9` | cub-santa-catarina-2025 | editado | ext | `TC4AEZTvQdwZvosYYfI0F8` | `QbRV0eIQAr15Jc3fFCFBRG` | — |
| 73 | `post-686aef2a90342d000185eb5a` | curso-tudo-marca-para-arquitetos | editado | meta | `U312e1WEeOlY6t2zslybTc` | `U312e1WEeOlY6t2zsmSTkO` | — |
| 74 | `post-68bae2db34162e0001650028` | depreciacao-de-imoveis | editado | links, ext | `TC4AEZTvQdwZvosYYfHzJ4` | `U312e1WEeOlY6t2zsmVCFA` | — |
| 75 | `post-686aef2a90342d000185eb74` | desafios-da-execucao-de-obra-para-arquitetos | editado | meta | `QbRV0eIQAr15Jc3fFCAZau` | `U312e1WEeOlY6t2zsmSTwg` | — |
| 76 | `post-68bae4cb34162e000165008d` | desapropriacao-indireta | editado | links, ext | `TC4AEZTvQdwZvosYYfHzQK` | `U312e1WEeOlY6t2zsmUn8O` | — |
| 77 | `post-68bace4734162e000164ff7f` | descubra-bombinhas | pendente | — | `—` | `—` | — |
| 78 | `post-686aef2a90342d000185eb45` | desenho-livre-com-tablet | editado | meta | `QbRV0eIQAr15Jc3fFCAZ0Q` | `QbRV0eIQAr15Jc3fFCEobJ` | — |
| 79 | `post-68b3023e8e290d00011b8f5d` | diferencas-entre-imovel-urbano-e-rural | editado | ref, meta, ext | `QbRV0eIQAr15Jc3fFCAa7c` | `U312e1WEeOlY6t2zsmVAOS` | — |
| 80 | `post-68b1aacb35652e0001f9a2c2` | direito-civil | editado | ref, meta, ext | `QbRV0eIQAr15Jc3fFCAa3q` | `TC4AEZTvQdwZvosYYfR8tn` | — |
| 81 | `post-68ba4db2788095000140e17f` | direito-das-sucessoes | editado | ref, ext | `TC4AEZTvQdwZvosYYfHyVT` | `QbRV0eIQAr15Jc3fFCF8JW` | — |
| 82 | `post-68ba4d8b788095000140e175` | direito-de-familia | editado | ref, ext | `U312e1WEeOlY6t2zslyic4` | `QbRV0eIQAr15Jc3fFCF8GN` | — |
| 83 | `post-68e6a7fbcf0351000131fadf` | direito-e-patrimonio-lei-do-inquilinato | editado | ext | `TC4AEZTvQdwZvosYYfI0Q1` | `U312e1WEeOlY6t2zsmU8xY` | `relatorios/direito-e-patrimonio-lei-do-inquilinato.md` |
| 84 | `post-68ba4da8788095000140e17b` | direito-imobiliario | editado | ref, ext | `TC4AEZTvQdwZvosYYfHyRq` | `U312e1WEeOlY6t2zsmUlcA` | — |
| 85 | `post-68e699bbcf0351000131fa05` | direito-societario | editado | ext | `U312e1WEeOlY6t2zslyndQ` | `U312e1WEeOlY6t2zsmUo3k` | — |
| 86 | `post-68e56ebeeb3c2800011c6550` | direito-tributario | editado | ext | `TC4AEZTvQdwZvosYYfI00c` | `QbRV0eIQAr15Jc3fFCF8Wj` | — |
| 87 | `post-686aef2a90342d000185eb46` | distrito-sanitario-al-daayan-doha | editado | ref, meta | `U312e1WEeOlY6t2zslyYRA` | `TC4AEZTvQdwZvosYYfQXkZ` | — |
| 88 | `post-6807f0b899d0d3000161192e` | divorcio-com-partilha-de-bens | editado | meta | `QbRV0eIQAr15Jc3fFCAYMn` | `U312e1WEeOlY6t2zsmSU8y` | — |
| 89 | `post-686aef2a90342d000185eb42` | dreamscapes | editado | meta | `QbRV0eIQAr15Jc3fFCAYul` | `QbRV0eIQAr15Jc3fFCEodC` | — |
| 90 | `post-686aef2a90342d000185eb54` | dupla-titulacao-em-arquitetura | pendente | — | `—` | `—` | — |
| 91 | `post-681672809d322f0001f9444d` | escritura-publica | editado | ext | `U312e1WEeOlY6t2zslyUH4` | `U312e1WEeOlY6t2zsmUjV4` | — |
| 92 | `post-67c43624b5f03500018a47c9` | especialistas-avaliacao-imobiliaria | editado | links, meta, ext | `TC4AEZTvQdwZvosYYfHtUa` | `U312e1WEeOlY6t2zsmV7Hu` | — |
| 93 | `post-68a71fa6d9d9130001252aa8` | especulacao-imobiliaria | editado | ref | `QbRV0eIQAr15Jc3fFCAZmE` | `QbRV0eIQAr15Jc3fFCEiGn` | — |
| 94 | `post-685bec1b1626610001b3aef5` | estrangeiro-imovel-brasil | editado | ext | `U312e1WEeOlY6t2zslyVCQ` | `QbRV0eIQAr15Jc3fFCFAjE` | — |
| 95 | `post-68bae4d834162e0001650094` | estudo-impacto-de-vizinhanca | editado | ext | `U312e1WEeOlY6t2zslylBq` | `U312e1WEeOlY6t2zsmVChq` | — |
| 96 | `post-686aef2a90342d000185eb50` | explorando-belfast | editado | meta | `TC4AEZTvQdwZvosYYfHvua` | `TC4AEZTvQdwZvosYYfQXoC` | — |
| 97 | `post-686aef2a90342d000185eb52` | explorando-glasgow | editado | links, meta, ext | `U312e1WEeOlY6t2zslyaDm` | `TC4AEZTvQdwZvosYYfRFKz` | — |
| 98 | `post-68bae83c34162e0001650104` | financiamento-imobiliario | editado | links, ext | `TC4AEZTvQdwZvosYYfHzTx` | `U312e1WEeOlY6t2zsmVCu8` | — |
| 99 | `post-686aef2a90342d000185eb60` | formacao-em-arquitetura-diferencas-entre-brasil-portugal-e-espanha | editado | links, meta | `TC4AEZTvQdwZvosYYfHwlo` | `U312e1WEeOlY6t2zsmSUs2` | — |
| 100 | `post-68bad0c034162e000164ffc2` | fotografia-imobiliaria | pendente | — | `—` | `—` | — |
| 101 | `post-68bad1e234162e000164ffe3` | fundo-imobiliario | editado | links, ext | `U312e1WEeOlY6t2zslyjCw` | `U312e1WEeOlY6t2zsmVC2s` | — |
| 102 | `post-6807f0ed99d0d30001611936` | ganhar-dinheiro-imovel | editado | ref, ext | `QbRV0eIQAr15Jc3fFCAYOg` | `QbRV0eIQAr15Jc3fFCFAfS` | — |
| 103 | `post-68bae4ac34162e000165007f` | georreferenciamento-guia-completo-para-proprietarios-rurais | editado | links, ext | `TC4AEZTvQdwZvosYYfHzMh` | `TC4AEZTvQdwZvosYYfRGCD` | — |
| 104 | `post-688e21398f78810001f45fc5` | golf-club-brasil | pendente | — | `—` | `—` | — |
| 105 | `post-680977502e276e0001cf9387` | heranca | editado | links, ext | `TC4AEZTvQdwZvosYYfHttz` | `QbRV0eIQAr15Jc3fFCF86J` | — |
| 106 | `post-68b1aa7535652e0001f9a2ba` | herdeiros-necessarios | editado | ref | `TC4AEZTvQdwZvosYYfHxrY` | `TC4AEZTvQdwZvosYYfQMUa` | — |
| 107 | `post-685beb551626610001b3aede` | hipoteca | editado | ext | `QbRV0eIQAr15Jc3fFCAYUL` | `TC4AEZTvQdwZvosYYfREva` | — |
| 108 | `post-68bae85a34162e0001650112` | hipoteca-reversa | editado | links, ext | `TC4AEZTvQdwZvosYYfHzXa` | `QbRV0eIQAr15Jc3fFCFB5s` | — |
| 109 | `post-68bacecf34162e000164ff8f` | holding-familiar | editado | links, ext | `QbRV0eIQAr15Jc3fFCAaKC` | `U312e1WEeOlY6t2zsmVBqa` | — |
| 110 | `post-68bacf6f34162e000164ff9d` | holding-mista | editado | links, ext | `TC4AEZTvQdwZvosYYfHyop` | `TC4AEZTvQdwZvosYYfRFwU` | — |
| 111 | `post-68096da52e276e0001cf9311` | holding-patrimonial | editado | links, ext | `TC4AEZTvQdwZvosYYfHtqM` | `U312e1WEeOlY6t2zsmUjIm` | — |
| 112 | `post-685bebd11626610001b3aee9` | home-equity | editado | meta, ext | `TC4AEZTvQdwZvosYYfHuFl` | `U312e1WEeOlY6t2zsmV8Te` | — |
| 113 | `post-686aef2a90342d000185eb5e` | identidade-da-arquitetura-portuguesa | editado | ref, links, meta | `TC4AEZTvQdwZvosYYfHweY` | `U312e1WEeOlY6t2zsmSV4K` | — |
| 114 | `post-68baef2634162e00016501df` | igpm-como-calcular | editado | links, ext | `U312e1WEeOlY6t2zslyn2Y` | `QbRV0eIQAr15Jc3fFCFBFw` | — |
| 115 | `post-686aef2a90342d000185eb61` | igrejas-contemporaneas | editado | links, meta | `U312e1WEeOlY6t2zslybsC` | `TC4AEZTvQdwZvosYYfQXvS` | — |
| 116 | `post-68ad98559738aa0001cc2e7a` | imoveis-na-pratica-avaliacao-de-terrenos | editado | ref, ext | `U312e1WEeOlY6t2zslyfB2` | `TC4AEZTvQdwZvosYYfRFZV` | — |
| 117 | `post-68b301f38e290d00011b8f50` | imoveis-na-pratica-imovel-rural | editado | links, ext | `U312e1WEeOlY6t2zslyh1k` | `U312e1WEeOlY6t2zsmVA3y` | — |
| 118 | `post-68b300518e290d00011b8f1c` | imoveis-na-pratica-loteamento | editado | ref, meta, ext | `TC4AEZTvQdwZvosYYfHxvB` | `U312e1WEeOlY6t2zsmV9rg` | — |
| 119 | `post-6807d50599d0d30001611801` | imoveis-santa-catarina | editado | links, meta, ext | `QbRV0eIQAr15Jc3fFCAYHl` | `QbRV0eIQAr15Jc3fFCFAdZ` | — |
| 120 | `post-6807f25f99d0d30001611948` | imovel-valoriza-ano | editado | ref, ext | `U312e1WEeOlY6t2zslyTTu` | `QbRV0eIQAr15Jc3fFCFAhL` | — |
| 121 | `post-686aef2a90342d000185eb69` | impactos-da-arquitetura-hostil | pendente | — | `—` | `—` | — |
| 122 | `post-685bf61e44c14400011e0f1d` | imposto-de-renda-sobre-venda-de-imovel | editado | meta, ext | `U312e1WEeOlY6t2zslyVrO` | `TC4AEZTvQdwZvosYYfREzD` | — |
| 123 | `post-6807f04299d0d3000161191e` | imposto-explicado-laudemio | editado | links, limp | `TC4AEZTvQdwZvosYYfHtj6` | `U312e1WEeOlY6t2zsmW0CK` | — |
| 124 | `post-68a77c8cde6f0800013af84f` | imposto-sobre-venda-imoveis | editado | ref, canib, ext | `TC4AEZTvQdwZvosYYfHxeF` | `U312e1WEeOlY6t2zsmV9Go` | — |
| 125 | `post-68e6a808cf0351000131faec` | incc-indice-nacional-custo-construcao | editado | ext | `TC4AEZTvQdwZvosYYfI0Ur` | `U312e1WEeOlY6t2zsmVEow` | — |
| 126 | `post-685bf6b144c14400011e0f2a` | indices-reajuste-aluguel | editado | canib, ext | `TC4AEZTvQdwZvosYYfHuOE` | `TC4AEZTvQdwZvosYYfRF2q` | — |
| 127 | `post-68a72891d9d9130001252b7b` | investimento-liquidez | editado | ref | `U312e1WEeOlY6t2zslyeBa` | `TC4AEZTvQdwZvosYYfQNLo` | — |
| 128 | `post-68baef0734162e00016501db` | ipca | editado | links, ext | `TC4AEZTvQdwZvosYYfHzm6` | `U312e1WEeOlY6t2zsmVDIi` | — |
| 129 | `post-67e46e58007f59000142c306` | iptu | editado | links, ext | `TC4AEZTvQdwZvosYYfHtfT` | `U312e1WEeOlY6t2zsmV7gU` | — |
| 130 | `post-68bacff734162e000164ffa9` | isencao-imposto-heranca-itcmd | editado | links, ext | `TC4AEZTvQdwZvosYYfHysS` | `QbRV0eIQAr15Jc3fFCF8OY` | — |
| 131 | `post-68bad03434162e000164ffb6` | isencao-itbi | editado | links, ext | `U312e1WEeOlY6t2zslyj0e` | `U312e1WEeOlY6t2zsmUmbc` | — |
| 132 | `post-688e29708f78810001f45fdb` | itajai | editado | links | `QbRV0eIQAr15Jc3fFCAZdQ` | `U312e1WEeOlY6t2zsmSBuG` | — |
| 133 | `post-68bad18634162e000164ffd5` | itapema | editado | links, ext | `TC4AEZTvQdwZvosYYfHyw5` | `TC4AEZTvQdwZvosYYfRG07` | — |
| 134 | `post-67ca1cd6ad8c5c0001cd5266` | itbi | editado | links, ext | `U312e1WEeOlY6t2zslyS5s` | `QbRV0eIQAr15Jc3fFCFAbg` | — |
| 135 | `post-67db4af14677c40001af11bf` | itcmd | editado | links, ext | `TC4AEZTvQdwZvosYYfHtbq` | `U312e1WEeOlY6t2zsmV7UC` | — |
| 136 | `post-685bf5d744c14400011e0f12` | juros-de-financiamento-imobiliario | editado | ext | `QbRV0eIQAr15Jc3fFCAYWE` | `QbRV0eIQAr15Jc3fFCFAl7` | — |
| 137 | `post-67c1cf984403ff0001dd2dfa` | laudo-de-avaliacao-do-imovel | editado | links, ext, dens | `QbRV0eIQAr15Jc3fFCAYC6` | `U312e1WEeOlY6t2zsmVM9g` | `relatorios/laudo-de-avaliacao-do-imovel.md` |
| 138 | `post-685be96a1626610001b3aebd` | leasing | editado | meta | `U312e1WEeOlY6t2zslyUrw` | `U312e1WEeOlY6t2zsmSVSu` | — |
| 139 | `post-68e3adc0b33d3b0001fe5ea9` | lei-de-falencia | editado | ext | `TC4AEZTvQdwZvosYYfHzwz` | `QbRV0eIQAr15Jc3fFCF8Uq` | — |
| 140 | `post-681691ee8a9b6e0001ef9570` | leilao-caixa | editado | ext | `TC4AEZTvQdwZvosYYfHu7I` | `TC4AEZTvQdwZvosYYfRErx` | — |
| 141 | `post-68ba4d58788095000140e171` | leiloes-de-imoveis | editado | ref, ext | `U312e1WEeOlY6t2zslyiPm` | `U312e1WEeOlY6t2zsmVBBc` | — |
| 142 | `post-686aef2a90342d000185eb6a` | livros-para-empreendedores | pendente | — | `—` | `—` | — |
| 143 | `post-68b8a0f0ce1c730001db7a44` | matricula-atualizada-do-imovel-guia-completo | editado | links | `U312e1WEeOlY6t2zslyhE2` | `QbRV0eIQAr15Jc3fFCEmLf` | — |
| 144 | `post-68b8a28ace1c730001db7a83` | memorial-descritivo-de-obras | editado | links, ext | `TC4AEZTvQdwZvosYYfHy4r` | `TC4AEZTvQdwZvosYYfRFo1` | — |
| 145 | `post-68b8a4d8ce1c730001db7ae4` | metodo-capitalizacao-renda | editado | links | `U312e1WEeOlY6t2zslyi1C` | `QbRV0eIQAr15Jc3fFCEmNY` | — |
| 146 | `post-68b8a614ce1c730001db7b05` | metodo-evolutivo-na-avaliacao-de-imoveis | editado | links, ext | `U312e1WEeOlY6t2zslyiDU` | `U312e1WEeOlY6t2zsmVAzK` | — |
| 147 | `post-68baeb9234162e0001650184` | metodo-involutivo | editado | links, ext | `U312e1WEeOlY6t2zslylmi` | `QbRV0eIQAr15Jc3fFCFBCA` | — |
| 148 | `post-686aef2a90342d000185eb40` | metodo-valenbrasil-o-arquiteto-digital | editado | links | `TC4AEZTvQdwZvosYYfHuyW` | `U312e1WEeOlY6t2zsmSAeQ` | — |
| 149 | `post-686aef2a90342d000185eb6b` | milan-design-week | editado | ref, meta, canib | `TC4AEZTvQdwZvosYYfHwwh` | `U312e1WEeOlY6t2zsmSeqe` | — |
| 150 | `post-686aef2a90342d000185eb6c` | milan-design-week-fuorisalone | editado | canib | `TC4AEZTvQdwZvosYYfHx0K` | `QbRV0eIQAr15Jc3fFCEq4W` | — |
| 151 | `post-68e6a819cf0351000131faf4` | minha-casa-minha-vida | editado | ext | `U312e1WEeOlY6t2zslypDk` | `TC4AEZTvQdwZvosYYfRJ5F` | — |
| 152 | `post-68bae86834162e0001650119` | nbr-14653 | editado | links, ext | `QbRV0eIQAr15Jc3fFCAadh` | `QbRV0eIQAr15Jc3fFCFB7l` | — |
| 153 | `post-68bacc1534162e000164ff35` | norman-foster-biografia | editado | ext | `U312e1WEeOlY6t2zslyioM` | `TC4AEZTvQdwZvosYYfRFsr` | — |
| 154 | `post-686aef2a90342d000185eb35` | novas-casas-com-arquitetura-modular-no-brasil | pendente | — | `—` | `—` | — |
| 155 | `post-686aef2a90342d000185eb65` | novo-parque-de-valencia | editado | meta | `U312e1WEeOlY6t2zslycT4` | `U312e1WEeOlY6t2zsmSVfC` | — |
| 156 | `post-686a8c68d5f0560001df843d` | o-impacto-da-arquitetura-imobiliaria-no-mercado-contemporaneo | editado | ext | `U312e1WEeOlY6t2zslyW3g` | `TC4AEZTvQdwZvosYYfRF6T` | — |
| 157 | `post-686aef2a90342d000185eb73` | o-minimalismo-na-arquitetura | editado | ref, links | `QbRV0eIQAr15Jc3fFCAZZ1` | `U312e1WEeOlY6t2zsmSBRa` | — |
| 158 | `post-686aef2a90342d000185eb36` | o-que-e-cau | pendente | — | `—` | `—` | — |
| 159 | `post-686aef2a90342d000185eb70` | o-que-e-croqui | editado | links | `TC4AEZTvQdwZvosYYfHx3x` | `TC4AEZTvQdwZvosYYfQU3w` | — |
| 160 | `post-686aef2a90342d000185eb37` | o-que-e-um-arquiteto | pendente | — | `—` | `—` | — |
| 161 | `post-68b1ac7d35652e0001f9a2e1` | oab-sc | editado | ref, ext | `U312e1WEeOlY6t2zslyg6O` | `QbRV0eIQAr15Jc3fFCF8EU` | — |
| 162 | `post-69bc9cfabda3d40001cefc6b` | oib-observatorio-imobiliario-brasileiro | editado | ext | `U312e1WEeOlY6t2zslypwo` | `QbRV0eIQAr15Jc3fFCFBT9` | — |
| 163 | `post-686aef2a90342d000185eb3b` | parklets | editado | meta, limp | `U312e1WEeOlY6t2zslyXmC` | `TC4AEZTvQdwZvosYYfRa7I` | — |
| 164 | `post-686aef2a90342d000185eb64` | parque-turia | editado | ref, links, meta | `QbRV0eIQAr15Jc3fFCAZQq` | `U312e1WEeOlY6t2zsmSVrU` | — |
| 165 | `post-68bae48134162e000165006a` | perito-imobiliario | editado | links, ext, dens | `U312e1WEeOlY6t2zslykf4` | `QbRV0eIQAr15Jc3fFCFDiA` | `relatorios/perito-imobiliario.md` |
| 166 | `post-68e6a2b9cf0351000131fa9a` | perito-judicial | editado | meta, ext | `U312e1WEeOlY6t2zslyoEI` | `TC4AEZTvQdwZvosYYfRIqj` | — |
| 167 | `post-68baeba934162e000165018d` | perito-judicial-arquiteto | editado | links, ext | `U312e1WEeOlY6t2zslymmA` | `QbRV0eIQAr15Jc3fFCFBE3` | — |
| 168 | `post-685bf53c44c14400011e0f04` | permuta-de-imovel | editado | meta, ext | `U312e1WEeOlY6t2zslyVSo` | `U312e1WEeOlY6t2zsmV8fw` | — |
| 169 | `post-68e6a2a2cf0351000131fa92` | potencial-construtivo-terreno | editado | ext | `U312e1WEeOlY6t2zslyo20` | `QbRV0eIQAr15Jc3fFCFBJi` | — |
| 170 | `post-68baebdb34162e00016501a5` | predios-mais-altos-brasil | editado | links | `QbRV0eIQAr15Jc3fFCAafa` | `U312e1WEeOlY6t2zsmSFjs` | — |
| 171 | `post-686aef2a90342d000185eb67` | premio-pritzker-de-arquitetura | editado | meta | `U312e1WEeOlY6t2zslycre` | `TC4AEZTvQdwZvosYYfQYEo` | — |
| 172 | `post-686aef2a90342d000185eb66` | pritzker-2024-riken-yamamoto | editado | meta | `U312e1WEeOlY6t2zslycfM` | `QbRV0eIQAr15Jc3fFCEooW` | — |
| 173 | `post-67e323f2a5ce00000103a808` | processo-de-desapropriacao-de-imoveis | editado | links, meta, ext, limp | `QbRV0eIQAr15Jc3fFCAYDz` | `U312e1WEeOlY6t2zsmW002` | — |
| 174 | `post-6807f11c99d0d3000161193a` | propriedade-expropriada | editado | ref, ext | `U312e1WEeOlY6t2zslyTHc` | `U312e1WEeOlY6t2zsmUiuC` | — |
| 175 | `post-68b8a3edce1c730001db7ac2` | ranking-metro-quadrado-mais-caro-do-brasil | editado | links, ext | `QbRV0eIQAr15Jc3fFCAaGQ` | `U312e1WEeOlY6t2zsmVAn2` | — |
| 176 | `post-6807d58a99d0d30001611808` | reajuste-de-aluguel | editado | links, meta, canib, ext | `U312e1WEeOlY6t2zslySgk` | `U312e1WEeOlY6t2zsmV7sm` | — |
| 177 | `post-68e6a345cf0351000131fab0` | recuperacao-judicial | editado | ext | `QbRV0eIQAr15Jc3fFCAaoO` | `U312e1WEeOlY6t2zsmUoG2` | — |
| 178 | `post-685bf74744c14400011e0f38` | refinanciamento-imobiliario | editado | meta, ext | `QbRV0eIQAr15Jc3fFCAYbG` | `U312e1WEeOlY6t2zsmV8sE` | — |
| 179 | `post-68bae87934162e0001650120` | registro-de-responsabilidade-tecnica-rrt | editado | links, ext | `TC4AEZTvQdwZvosYYfHzbD` | `QbRV0eIQAr15Jc3fFCFBAH` | — |
| 180 | `post-68bae4bb34162e0001650086` | registro-rural-regularizacao-de-propriedades | editado | links, ext | `QbRV0eIQAr15Jc3fFCAabo` | `U312e1WEeOlY6t2zsmUmnu` | — |
| 181 | `post-68bae84b34162e000165010b` | regularizacao-imobiliaria | editado | links, ext | `U312e1WEeOlY6t2zslylO8` | `U312e1WEeOlY6t2zsmUnOm` | — |
| 182 | `post-686aef2a90342d000185eb4c` | renderizacao-de-projetos-de-arquitetura | editado | meta | `U312e1WEeOlY6t2zslyZMW` | `U312e1WEeOlY6t2zsmSWG4` | — |
| 183 | `post-686aef2a90342d000185eb41` | resenha | editado | meta | `QbRV0eIQAr15Jc3fFCAYss` | `TC4AEZTvQdwZvosYYfQYPh` | — |
| 184 | `post-686aef2a90342d000185eb44` | resenha-do-livro-uma-linguagem-de-padroes | editado | meta | `TC4AEZTvQdwZvosYYfHv9P` | `QbRV0eIQAr15Jc3fFCEoqP` | — |
| 185 | `post-68bacccc34162e000164ff45` | residencial-tempo-muze | editado | ext | `TC4AEZTvQdwZvosYYfHyZ6` | `QbRV0eIQAr15Jc3fFCFB3z` | — |
| 186 | `post-686aef2a90342d000185eb5f` | restauracao-do-arco-de-tito | editado | links, ext | `TC4AEZTvQdwZvosYYfHwiB` | `QbRV0eIQAr15Jc3fFCFAqm` | — |
| 187 | `post-686aef2a90342d000185eb59` | restauracao-do-patrimonio-historico | editado | ext | `U312e1WEeOlY6t2zslybHK` | `QbRV0eIQAr15Jc3fFCFAot` | — |
| 188 | `post-68baebba34162e0001650195` | retrofit | editado | links, ext | `TC4AEZTvQdwZvosYYfHzeq` | `U312e1WEeOlY6t2zsmVD6Q` | — |
| 189 | `post-688e29c58f78810001f45fe7` | senna-tower | pendente | — | `—` | `—` | — |
| 190 | `post-67e32f07a5ce00000103a85f` | shopping-reajuste-de-aluguel | editado | links, meta, ext | `QbRV0eIQAr15Jc3fFCAYFs` | `U312e1WEeOlY6t2zsmUihu` | — |
| 191 | `post-68e6a396cf0351000131fac9` | sinduscon | editado | ext | `U312e1WEeOlY6t2zslyol4` | `U312e1WEeOlY6t2zsmUoSK` | — |
| 192 | `post-686aef2a90342d000185eb5d` | teorias-restauracao-patrimonio-arquitetonico | pendente | — | `—` | `—` | — |
| 193 | `post-6807f27299d0d3000161194c` | terreno-brasil | editado | ref, ext | `U312e1WEeOlY6t2zslyTgC` | `U312e1WEeOlY6t2zsmV854` | — |
| 194 | `post-68e6a275cf0351000131fa87` | terrenos | editado | ext | `U312e1WEeOlY6t2zslynpi` | `U312e1WEeOlY6t2zsmVDV0` | — |
| 195 | `post-68a77a64de6f0800013af83a` | terrenos-em-santa-catarina | editado | ref, links, ext | `TC4AEZTvQdwZvosYYfHxac` | `TC4AEZTvQdwZvosYYfRFVs` | — |
| 196 | `post-68b1a7b635652e0001f9a29c` | testamento | editado | ref, ext | `TC4AEZTvQdwZvosYYfHxlV` | `U312e1WEeOlY6t2zsmUkgo` | — |
| 197 | `post-6807f07799d0d30001611926` | usucapiao | editado | ref, meta, ext | `U312e1WEeOlY6t2zslySt2` | `TC4AEZTvQdwZvosYYfR8PY` | — |
| 198 | `post-68238463627fff0001df1f15` | valor-venal | editado | links, ext | `QbRV0eIQAr15Jc3fFCElvs` | `U312e1WEeOlY6t2zsmV8HM` | — |
| 199 | `post-68b04c1a4b61a00001cb7eb1` | valores-mobiliarios | editado | ref, canib, ext | `TC4AEZTvQdwZvosYYfHxhs` | `TC4AEZTvQdwZvosYYfRFd8` | — |
| 200 | `post-68e6a7fdcf0351000131fae3` | vender-imovel | editado | ext | `U312e1WEeOlY6t2zslyoxM` | `TC4AEZTvQdwZvosYYfRJ1c` | — |
| 201 | `post-686aef2a90342d000185eb56` | viaje-na-arquitetura-de-budapeste | editado | meta | `TC4AEZTvQdwZvosYYfHwLC` | `U312e1WEeOlY6t2zsmSWee` | — |
| 202 | `post-686aef2a90342d000185eb53` | viaje-na-arquitetura-de-edimburgo-na-escocia | editado | meta | `U312e1WEeOlY6t2zslyagS` | `TC4AEZTvQdwZvosYYfQYWx` | — |
| 203 | `post-686aef2a90342d000185eb57` | viaje-na-arquitetura-de-viena-na-austria | editado | meta | `QbRV0eIQAr15Jc3fFCAZIf` | `U312e1WEeOlY6t2zsmSWqw` | — |
| 204 | `post-68b8a1face1c730001db7a6c` | vistoriador-de-imoveis | editado | links, ext | `QbRV0eIQAr15Jc3fFCAaCe` | `U312e1WEeOlY6t2zsmVAak` | — |
| 205 | `post-68a77334de6f0800013af821` | vistorias-imoveis | editado | ref, ext | `U312e1WEeOlY6t2zslyeyk` | `QbRV0eIQAr15Jc3fFCFAuY` | — |
| 206 | `post-686aef2a90342d000185eb6e` | wood-frame | editado | links | `QbRV0eIQAr15Jc3fFCAZVF` | `TC4AEZTvQdwZvosYYfQTwg` | — |

### Renomeação de slug — `direito-imobiliario-2` → `advocacia-imobiliaria`

Autorizada explicitamente pelo autor, com o custo declarado antes: o endereço
antigo estava publicado desde out/2025 e constava do sitemap do Ghost.

Como o site é `output: 'export'` e não emite 301, a URL antiga continua sendo uma
rota gerada — uma página-ponte com `<link rel="canonical">` para o endereço novo
e `<meta http-equiv="refresh">` de zero segundo. Fica fora do sitemap de
propósito: é ponte, não conteúdo. O mapa vive em `site/lib/redirects.ts` e serve
para qualquer renomeação futura.

O artigo também foi diferenciado do irmão, que era a origem do problema: H1,
metaTitle e metaDescription passaram a falar de advocacia imobiliária, e um link
âncora leva de volta a `direito-imobiliario`. Backup em
`_seo/backups/pre-slug/`, com o `_rev` anterior registrado.

### Fase 1 — links externos, artigo a artigo

| Lote | Artigos | Externos | Estado |
|---|---|---|---|
| `direito-e-patrimonio-lei-do-inquilinato` | 1 | 0 → 11 | na meta · relatório em `_seo/relatorios/` |
| Categoria Direito Imobiliário | 36 | 17 → 88 | abaixo da meta — ver `lacuna-de-fontes.md` |

Ao fim deste lote restavam 164 artigos com zero links externos — número que a
passada seguinte sobre o acervo derrubou para 38. O diagnóstico da seção
seguinte, porém, continua valendo: o gargalo nunca foi o link.

### Achado que reclassifica o item mais caro

A meta de 10 a 20 links externos por artigo não se resolve inserindo links: 25
dos 41 artigos de Direito Imobiliário não citam nenhuma norma por número, e a
mediana de âncoras legítimas por artigo é 2. Não há onde ancorar fonte porque o
texto não afirma nada específico o bastante para precisar de uma.

O plano prevê exatamente este caso e manda expandir o conteúdo primeiro. Ou
seja: não são ~2.300 links a inserir, são ~200 artigos a densificar, com o link
saindo como subproduto. Detalhado em `_seo/lacuna-de-fontes.md`.

### Links externos — acervo completo

Segunda passada, agora sobre todos os artigos com zero links, de qualquer
categoria, com o catálogo ampliado para 42 fontes (somaram-se Lei 4.591/64,
6.766/79, 8.036/90, 6.385/76, 11.977/09, CDC, CVM, ANBIMA, FGTS, ABECIP,
Ministério das Cidades, ABNT, IPHAN, Pritzker e MoMA).

```
acervo, 206 artigos
  links externos ............. 199 → 502
  hosts distintos ............ 165
  artigos com zero ........... 165 → 38
  artigos na meta 10–20 ...... 2
  texto do corpo alterado .... 0 artigos
  chaves duplicadas / órfãos . 0 / 0
  duplicatas introduzidas .... 0   (as 13 existentes são anteriores a esta auditoria)
```

Os 38 que continuam em zero não têm âncora natural alguma: são sobretudo peças
locais e de mercado — `itajai`, `balneario-camboriu`, `brava-home-resort`,
`fotografia-imobiliaria`, `especulacao-imobiliaria` — que não citam norma, órgão
nem índice em ponto nenhum. Vale o mesmo diagnóstico de `lacuna-de-fontes.md`:
é conteúdo a densificar, não link a inserir.

Fontes bloqueadas para verificação automática, deixadas de fora de propósito:
STJ, B3, CAU/BR, UNESCO, IBGE e Caixa respondem 403 a qualquer cliente que não
seja navegador. São candidatas legítimas para conferência manual.

### Densificação — artigos de maior intenção comercial

| Artigo | Palavras | Externos | Estado |
|---|---|---|---|
| `laudo-de-avaliacao-do-imovel` | 2.435 → 2.984 | 4 → 11 | **na meta** · relatório em `_seo/relatorios/` |
| `perito-imobiliario` | 4.588 → 5.286 | 9 → 12 | **na meta** · relatório em `_seo/relatorios/` |
| `avaliacao-imobiliaria` | 2.325 → 2.844 | 4 → 10 | **na meta** · relatório em `_seo/relatorios/` |

`laudo-de-avaliacao-do-imovel` foi o primeiro artigo a atingir a faixa de 10 a
20 links externos por densificação, e não por inserção. Os links vieram como
consequência do conteúdo novo: base legal
de quem assina (Leis 5.194/66, 12.378/10 e 6.530/78), ART e RRT (Lei 6.496/77) e
os requisitos do laudo pericial no CPC (arts. 156 e 473).

Cada norma foi lida no texto oficial do Planalto antes de entrar no artigo, não
citada de memória. Os 89 blocos originais seguem idênticos; os 16 novos foram
inseridos entre eles.

### Varredura de defeitos de conteúdo

Detalhada em `_seo/limpeza-de-residuos.md`. Corrigidos os itens 1 e 2: 10 blocos
removidos em 5 artigos, −274 palavras, nenhuma informação perdida. Seguem em
aberto 794 legendas de imagem publicadas como parágrafo (82 artigos) e 59
fórmulas de escrita proibidas pelo plano (54 artigos).

## Estado do acervo hoje

Medido no Sanity, não estimado.

```
artigos ............................. 206
  editado ........................... 185
  pendente ..........................  21
  com auditoria individual ..........   4   (relatório em _seo/relatorios/)

metaTitle ausente ...................   0
metaDescription ausente .............   0
excerpt ausente .....................   0

links externos ...................... 518
  artigos com 0 .....................  38
  artigos com 1 a 9 ................. 161
  artigos na meta 10 a 20 ...........   5

links internos (corpo) .............. 634
  artigos com 0 .....................   0
  artigos com 5 ou mais .............  67
  quebrados .........................   0

imagens no corpo ..................... 635   (eram 98)
  com alt ........................... 635
  com caption ....................... 541
capas com alt ........................ 206 de 206

saltos de heading (h2 -> h4) .........   0
artigos sem categoria ................   0
```

A linkagem interna está detalhada em `_seo/linkagem-interna.md`, incluindo o que
o Google de fato recomenda, seis links errados que eu mesmo introduzi e removi, e
o que continua em aberto.

## O que falta, em ordem de custo

1. **Densificar 201 artigos.** É o item central. A meta de 10 a 20 links
   externos foi atingida em 5. Nos outros 201 não é trabalho de inserir link, e
   sim de escrever: acrescentar a norma, o artigo, o prazo, a alíquota que o
   texto hoje resume como "a lei prevê". O plano pede um artigo por vez, com
   relatório; foram 4.

2. ~~794 legendas publicadas como parágrafo~~ — **resolvido**, e o diagnóstico
   estava errado. Não eram legendas fora do lugar: eram o rastro de **556
   imagens que a migração do Ghost perdeu**. O site antigo ainda tem as figuras,
   e 537 delas foram restauradas com a legenda em `caption`. Detalhado em
   `_seo/imagens-restauradas.md`.

3. ~~59 fórmulas de escrita proibidas~~ — **resolvido**. Eram 160 em 104
   artigos, não 59 em 54. Restam 3 superlativos que a própria frase sustenta.
   Detalhado em `_seo/formulas-proibidas.md`.

4. **Canibalização: 255 pares sinalizados, 5 resolvidos.** O grosso é ruído do
   índice — todo slug com "direito" pareia com `oab-sc`. Os pares reais ainda
   intocados são `indices-reajuste-aluguel` × `reajuste-de-aluguel`,
   `imposto-de-renda-sobre-venda-de-imovel` × `imposto-sobre-venda-imoveis`,
   `cadastro-imobiliario-brasileiro-cib` × `cib-cadastro-imobiliario-brasileiro`
   e `credito-imobiliario` × `financiamento-imobiliario`.

5. **Pendências que dependem de decisão do autor.** Não foram tocadas porque
   exigem informação que não dá para verificar em fonte pública:
   - ~~Valores sem fonte~~ — **resolvido**. Os quatro foram atrás da fonte antes
     de sair: o "mercado de R$ 200 bi" existia e estava subestimado (R$ 312,4 bi
     de financiamento em 2024, balanço da Abecip) e virou número certo com
     fonte; os outros três não têm fonte e saíram. No lugar das faixas de
     honorários entrou o critério real de cálculo, que os regulamentos
     referenciais dos institutos estaduais definem. Ver `_seo/valores-sem-fonte.md`.
   - ~~Data errada em `direito-e-patrimonio-lei-do-inquilinato`~~ — **corrigida**.
     O texto atribuía a 2023 uma reforma que é da Lei 12.112/2009, e dava como
     exemplo o art. 17, que é de 1991. Ver o relatório do artigo.
   - ~~NBR 14653, graus de fundamentação e de precisão~~ — **decidido: não vai
     ser publicado.** O texto da norma é conteúdo pago da ABNT, protegido por
     direito autoral, e reproduzir as tabelas de grau seria pirataria. Continua
     valendo citar a norma pelo número e linkar a página onde ela é vendida.
   - Estrutura: um H2 genérico "Resumo"; em `perito-imobiliario` um H2
     "Introdução à Profissão" como penúltima seção; vários artigos abrindo com
     "Neste guia completo".

6. **Bloqueios externos.** STJ, B3, CAU/BR, UNESCO, IBGE e Caixa respondem 403 a
   qualquer cliente que não seja navegador: foram omitidos em vez de citados sem
   conferência, e ficam para verificação manual. E a chave da API do Ahrefs
   devolve 401 no esquema documentado — sem uma chave válida não dá para cruzar
   posições e backlinks.

## Fora da tabela, já concluído

Nada disto é patch no Sanity, então não aparece por artigo: schema com `alt`,
`title` e anotação de link própria; `rel` e `target` em link externo derivados do
`href`; canonical, Open Graph, Twitter Card e JSON-LD `BlogPosting` +
`BreadcrumbList` no ar; paridade de slug com o Ghost provada em 203 de 203 URLs;
Google Analytics e Ahrefs Web Analytics; e o monitoramento no Firehose
(`_seo/firehose.md`).
