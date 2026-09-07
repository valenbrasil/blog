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

O blog é publicado pela **Vercel**, no projeto `valenbrasil-blog` (time
ValenBrasil), a partir do repositório no **GitLab**:
<https://gitlab.com/valenbrasil/blog>. Cada push no `main` do GitLab que toque
`site/**` dispara um deploy. Como o conteúdo é lido em tempo de build, **uma
publicação nova no Studio só aparece no ar depois de um novo deploy** — o Sanity
não avisa a Vercel.

O projeto na Vercel usa Root Directory `site` e depende de duas variáveis de
ambiente, `NEXT_PUBLIC_BASE_PATH` (string **vazia**) e `NEXT_PUBLIC_SITE_URL`
(`https://blog.valenbrasil.com`). Ver `site/README.md` para por que a primeira
não pode simplesmente faltar.

O domínio `blog.valenbrasil.com` é configurado no painel da Vercel (Project →
Settings → Domains); no DNS, `blog` aponta para a Vercel.

### GitLab é a fonte da verdade

O GitHub (<https://github.com/valenbrasil/blog>) é **apenas cópia de backup**,
mantida por push mirror do GitLab. Duas consequências que valem para qualquer
pessoa — ou agente — que mexa neste repositório:

- **Commitar direto no GitHub é perda de trabalho.** O espelho sobrescreve o
  GitHub à força (`keep divergent refs` desligado); commits que existam só lá
  são apagados na sincronização seguinte, sem erro e sem aviso.
- **Commit que não chega no GitLab não vai para o ar.** Quem publica é a
  Vercel, lendo do GitLab.

`.github/workflows/deploy.yml` ainda existe e publica no GitHub Pages, mas o
Pages não serve mais o domínio — é rota de retorno, não a publicação real.

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

Não é preciso gerar redirects. O blog voltou para o endereço que tinha no Ghost
e os slugs bateram 1:1 na migração, então cada URL antiga já resolve sozinha.
`npm run migrate:redirects` continua existindo, mas escreve um mapa
`/slug` → `/blog/slug` que só fazia sentido enquanto o site morava sob o prefixo
do GitHub Pages — hoje ele mandaria as URLs antigas para lugar nenhum.

### Verificação

Depois de migrar, use o checklist e as queries GROQ da seção 12 de
`MIGRACAOGHOSTSANITY.md` (Sanity Studio → Vision) para conferir contagem de posts,
referências órfãs, corpos vazios e imagens de capa ausentes.

### Fora do escopo

Membros/assinaturas, newsletter e comentários nativos do Ghost não têm equivalente
automático no Sanity — veja a seção 14 do documento de migração antes de desligar o Ghost.
