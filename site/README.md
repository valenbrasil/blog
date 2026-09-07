# Site do blog

Next.js App Router com `output: 'export'` — o build gera HTML estático, sem
servidor. O conteúdo vem do Sanity (projeto `jk3z4mls`, dataset `production`,
público) em tempo de build, então uma publicação nova no Studio só aparece
depois de um novo deploy.

O deploy é feito pela Vercel, a partir do **GitLab** — ver "Publicação" no
README da raiz. O GitLab é a fonte da verdade; o GitHub é só cópia de backup.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # gera out/
npm run lint
```

## Design system

O visual segue o guia da Valen Brasil: <https://valenbrasil.github.io/design/>
— especificamente o kit de blog em `ui_kits/blog/`.

O guia é a fonte da verdade dos tokens. `app/globals.css` traz uma cópia deles
(cores, tipografia, espaçamento, raios, sombras, movimento) e a ponte para as
utilitárias do Tailwind; mudança de token começa no guia e desce para cá, nunca
o contrário.

Três coisas que o guia impõe e que é fácil desfazer sem perceber:

- **O sistema é exclusivamente claro.** Não existe tema escuro, nem bloco
  `.dark`, nem seção de fundo escuro. É a regra número 1 do guia.
- **Verde é acento, não fundo.** Botão primário, ícones, links, badges e estado
  ativo de navegação. Texto verde usa sempre o `sage-700`: o `sage-500` sobre
  branco não atinge AA em texto pequeno.
- **A marca nunca é redesenhada.** O logo são os dois PNGs em `public/`
  (`valen-logo.png`, `valen-icone.png`), usados como imagem — nunca recriados
  em texto, SVG ou CSS.

`components/ui/` são os componentes do design system (Logo, Badge, Button,
Card, Separator, Breadcrumb, Pagination, Avatar); `components/` são as peças do
blog montadas com eles.

## Rotas

| Rota | Origem |
|---|---|
| `/` | primeira página do feed: destaque + 12 cards |
| `/pagina/[n]/` | páginas 2 em diante, 12 cards cada (`noindex`) |
| `/[slug]/` | artigo — mesmo padrão de URL do Ghost antigo, sem prefixo |
| `/categoria/[slug]/` | todos os artigos da categoria |
| `/politica-de-privacidade/`, `/termos-de-uso/` | HTML fixo de `content/` — slugs herdados do Ghost |
| `sitemap.xml`, `sitemap-posts.xml`, `robots.txt` | gerados no build |

## Endereço público

`NEXT_PUBLIC_BASE_PATH` e `NEXT_PUBLIC_SITE_URL`, lidos por `lib/site-config.ts`
e definidos nas variáveis de ambiente do projeto na Vercel. Hoje o site roda na
raiz de `blog.valenbrasil.com`, então o base path é vazio — e é preciso que ele
seja **string vazia**, não ausente: o default no código é `/blog`, herdado da
época do GitHub Pages, e uma variável faltando faz o site subir com todos os
assets sob `/blog/` sem gerar erro nenhum.

O domínio em si é configurado no painel da Vercel (Project → Settings →
Domains), não aqui. `public/CNAME` é resquício do GitHub Pages e não decide
nada hoje.
