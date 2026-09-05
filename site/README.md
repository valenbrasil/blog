# Site do blog

Next.js App Router com `output: 'export'` — o build gera HTML estático, sem
servidor. O conteúdo vem do Sanity (projeto `jk3z4mls`, dataset `production`,
público) em tempo de build, então uma publicação nova no Studio só aparece
depois de rodar o workflow de deploy.

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
e definidos no workflow de deploy. Hoje o site roda na raiz de
`blog.valenbrasil.com`, então o base path é vazio. Num GitHub Pages de projeto
ele seria servido sob o nome do repositório, e aí `NEXT_PUBLIC_BASE_PATH=/blog`.

O domínio em si é configurado em Settings → Pages → Custom domain, não aqui.
`public/CNAME` vai junto no artefato, mas não é ele que decide o endereço.
