# Blog da Valen Brasil

Blog publicado em <https://blog.valenbrasil.com>. O conteúdo vive no
Sanity e o site é estático.

| Pasta | O que é |
|---|---|
| `site/` | O blog: Next.js estático, lê do Sanity em tempo de build. Ver `site/README.md`. |
| `studio/` | O Sanity Studio, onde o conteúdo é editado. Publicado em <https://valenbrasil.sanity.studio>. |
| `sanity/` | Schemas do conteúdo, compartilhados pelo Studio e pelos scripts. |
| `scripts/` | Migração do Ghost, já concluída. Só é preciso rodar de novo se a migração for refeita. |

O visual segue o design system da marca: <https://valenbrasil.github.io/design/>.

## Publicação

`.github/workflows/deploy.yml` constrói `site/` e publica no GitHub Pages, a cada
push em `main` que toque em `site/**` e sob demanda por `workflow_dispatch`.
Como o conteúdo é lido em tempo de build, **uma publicação nova no Studio só
aparece no ar depois de rodar o workflow** — o Sanity não avisa o GitHub.

A origem do Pages precisa estar em **GitHub Actions** (Settings → Pages → Build
and deployment → Source). Em "Deploy from a branch", o GitHub roda um build
Jekyll da raiz do repositório a cada push, que publica este README por cima do
blog — aconteceu uma vez e derrubou o site.

O domínio `blog.valenbrasil.com` também vive nas configurações do Pages
(Settings → Pages → Custom domain), não no código: o `site/public/CNAME`
acompanha o artefato por garantia, mas não é ele que configura o domínio. Do
lado do DNS, `blog` é um CNAME para `valenbrasil.github.io`.

## Migração Ghost → Sanity

Os scripts em `scripts/` migraram o conteúdo do Ghost CMS para o Sanity.io,
conforme documentado em `MIGRACAOGHOSTSANITY.md`. A migração já rodou; o que
segue serve para refazê-la.

### Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.local.example` para `.env.local` e preencha com suas credenciais:

   ```bash
   cp .env.local.example .env.local
   ```

   | Variável | Onde obter |
   |---|---|
   | `GHOST_URL` / `GHOST_KEY` | Ghost Admin → Settings → Integrations → Add custom integration |
   | `SANITY_PROJECT_ID` / `SANITY_DATASET` | sanity.io/manage → projeto |
   | `SANITY_TOKEN` | sanity.io/manage → projeto → API → Tokens (role `Editor`) |

   **Importante:** rode a migração de imagens enquanto a instância do Ghost ainda estiver
   no ar — assets locais deixam de existir depois que o Ghost for desligado.

### Execução (ordem obrigatória)

```bash
npx tsx scripts/01-authors.ts
npx tsx scripts/02-tags.ts
npx tsx scripts/03-posts.ts --dry-run   # confira a saída antes de gravar
npx tsx scripts/03-posts.ts
```

Ou, via npm scripts:

```bash
npm run migrate:authors
npm run migrate:tags
npm run migrate:posts:dry
npm run migrate:posts
```

Gerar os redirects 301 (SEO) após a migração de posts:

```bash
npm run migrate:redirects
```

### Verificação

Depois de migrar, use o checklist e as queries GROQ da seção 12 de
`MIGRACAOGHOSTSANITY.md` (Sanity Studio → Vision) para conferir contagem de posts,
referências órfãs, corpos vazios e imagens de capa ausentes.

### Fora do escopo

Membros/assinaturas, newsletter e comentários nativos do Ghost não têm equivalente
automático no Sanity — veja a seção 14 do documento de migração antes de desligar o Ghost.
