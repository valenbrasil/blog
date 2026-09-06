/*
 * Teste do aviso de cookies, em navegador de verdade.
 *
 * Existe porque "compila" e "funciona" sao coisas diferentes, e num aviso de
 * consentimento a diferenca e juridica: se um medidor carregar antes do
 * clique, o aviso nao serve para nada e a LGPD foi descumprida do mesmo jeito
 * que sem aviso nenhum. Isso nao aparece lendo o codigo -- aparece olhando o
 * que o navegador pede na rede.
 *
 * Cobre o roteiro do README que veio com consentimento-valen.js e mais o que
 * ele nao pede: persistencia entre paginas, revogacao pelo rodape, limpeza dos
 * cookies do GA ao revogar e o sinal Global Privacy Control.
 *
 * Como rodar, a partir da raiz do repositorio:
 *
 *     cd site && NEXT_PUBLIC_BASE_PATH='' npm run build
 *     node tests/consentimento.mjs
 *
 * O BASE_PATH vazio importa: o teste serve site/out a partir da raiz, como o
 * dominio de producao faz. Com o /blog do padrao local, o script do aviso daria
 * 404 e todo teste passaria por engano -- sem medidor porque nao ha nada.
 *
 * O servidor estatico e proprio, de dez linhas, para o teste nao depender de
 * nenhum pacote alem do playwright.
 */
import { createRequire } from 'node:module'

/*
  O playwright nao e dependencia deste projeto -- ele so entra para este teste.
  Procura no projeto primeiro, cai para a instalacao global, e se nao achar
  nenhuma diz o que fazer em vez de estourar um ERR_MODULE_NOT_FOUND cru.
*/
const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require('playwright'))
} catch {
  try {
    ;({ chromium } = require('/opt/node22/lib/node_modules/playwright/index.js'))
  } catch {
    console.error('playwright nao encontrado. Instale com: npm i -D playwright')
    process.exit(2)
  }
}
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

import { fileURLToPath } from 'node:url'
const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'out')
const TIPOS = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css',
                '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.json':'application/json', '.xml':'application/xml', '.txt':'text/plain' }

const servidor = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  let f = path.join(RAIZ, p)
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html') } catch { f = f.endsWith('.html') ? f : f + '.html' }
  fs.readFile(f, (e, buf) => {
    if (e) { res.writeHead(404); res.end('nao encontrado'); return }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream' })
    res.end(buf)
  })
})
await new Promise(r => servidor.listen(4321, r))
const BASE = 'http://localhost:4321'

const MEDIDORES = /googletagmanager\.com|analytics\.ahrefs\.com|cloudflareinsights\.com/
const navegador = await chromium.launch()
const linhas = []
const ok = (c, t) => { linhas.push(`${c ? '  ok  ' : '  FALHA'} ${t}`); return c }
let falhas = 0
const checa = (c, t) => { if (!ok(c, t)) falhas++ }

async function contexto() {
  const ctx = await navegador.newContext()
  const pedidos = []
  ctx.on('request', r => { if (MEDIDORES.test(r.url())) pedidos.push(r.url()) })
  return { ctx, pedidos }
}

// ---------------------------------------------------------- 1. primeira visita
{
  const { ctx, pedidos } = await contexto()
  const pg = await ctx.newPage()
  await pg.goto(`${BASE}/`, { waitUntil: 'load' })
  await pg.waitForTimeout(1500)
  checa(pedidos.length === 0, `visita nova: nenhuma chamada a medidor antes de responder (achou ${pedidos.length})`)
  const aviso = pg.getByRole('dialog', { name: /Cookies neste site/i })
  checa(await aviso.isVisible(), 'aviso aparece na primeira visita')
  checa(await pg.getByRole('button', { name: 'Aceitar' }).isVisible(), 'botao Aceitar presente')
  checa(await pg.getByRole('button', { name: 'Rejeitar' }).isVisible(), 'botao Rejeitar presente')
  const politica = pg.locator('div[role=dialog] a')
  checa((await politica.getAttribute('href')).includes('politica-de-privacidade'), 'aviso linka a politica')

  // ---- Rejeitar
  await pg.getByRole('button', { name: 'Rejeitar' }).click()
  await pg.waitForTimeout(1200)
  checa(pedidos.length === 0, `apos Rejeitar: nenhum medidor carregado (achou ${pedidos.length})`)
  checa(!(await pg.getByRole('dialog').isVisible().catch(() => false)), 'aviso some depois de responder')
  const ck = (await ctx.cookies()).find(c => c.name === 'valen_consent')
  checa(!!ck, 'cookie valen_consent gravado')
  checa(ck && decodeURIComponent(ck.value).split('|')[1] === 'denied', `cookie registra a recusa (${ck && decodeURIComponent(ck.value).split('|').slice(0,4).join('|')})`)
  checa(ck && Math.abs(ck.expires * 1000 - Date.now() - 365 * 864e5) < 6 * 36e5, 'validade de 365 dias')

  await pg.goto(`${BASE}/casa-container/`, { waitUntil: 'load' })
  await pg.waitForTimeout(1500)
  checa(!(await pg.getByRole('dialog').isVisible().catch(() => false)), 'recusa persiste: aviso nao volta em outra pagina')
  checa(pedidos.length === 0, `recusa persiste: segue sem medidor (achou ${pedidos.length})`)
  await ctx.close()
}

// ---------------------------------------------------------- 2. aceitar
{
  const { ctx, pedidos } = await contexto()
  const pg = await ctx.newPage()
  await pg.goto(`${BASE}/`, { waitUntil: 'load' })
  await pg.waitForTimeout(1500)
  await pg.getByRole('button', { name: 'Aceitar' }).click()
  await pg.waitForTimeout(2500)
  const tem = f => pedidos.some(u => u.includes(f))
  checa(tem('googletagmanager.com'), 'apos Aceitar: Google Analytics carrega')
  checa(tem('analytics.ahrefs.com'), 'apos Aceitar: Ahrefs carrega')
  checa(tem('cloudflareinsights.com'), 'apos Aceitar: Cloudflare carrega')
  const ck = (await ctx.cookies()).find(c => c.name === 'valen_consent')
  checa(ck && decodeURIComponent(ck.value).split('|')[1] === 'granted', 'cookie registra a autorizacao')
  checa(decodeURIComponent(ck.value).split('|')[2] === '2026-09-06', 'cookie carrega a versao da politica')

  await pg.goto(`${BASE}/termos-de-uso/`, { waitUntil: 'load' })
  await pg.waitForTimeout(1500)
  checa(!(await pg.getByRole('dialog').isVisible().catch(() => false)), 'autorizacao persiste: aviso nao volta')

  // ---- revogar pelo rodape
  await pg.getByRole('button', { name: 'Preferências de cookies' }).click()
  await pg.waitForTimeout(400)
  checa(await pg.getByRole('dialog').isVisible(), 'botao do rodape reabre o aviso')
  checa(await pg.getByRole('button', { name: 'Fechar' }).isVisible(), 'quem ja decidiu ganha o botao Fechar')
  await pg.getByRole('button', { name: 'Rejeitar' }).click()
  await pg.waitForTimeout(600)
  const ck2 = (await ctx.cookies()).find(c => c.name === 'valen_consent')
  checa(ck2 && decodeURIComponent(ck2.value).split('|')[1] === 'denied', 'revogacao grava a recusa')
  const ga = (await ctx.cookies()).filter(c => c.name === '_ga' || c.name.startsWith('_ga_'))
  checa(ga.length === 0, `revogacao apaga os cookies do GA (sobraram ${ga.length})`)
  await ctx.close()
}

// ---------------------------------------------------------- 3. Global Privacy Control
{
  const ctx = await navegador.newContext()
  const pedidos = []
  ctx.on('request', r => { if (MEDIDORES.test(r.url())) pedidos.push(r.url()) })
  await ctx.addInitScript(() => Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true }))
  const pg = await ctx.newPage()
  await pg.goto(`${BASE}/`, { waitUntil: 'load' })
  await pg.waitForTimeout(1500)
  await pg.waitForTimeout(800)
  checa(!(await pg.getByRole('dialog').isVisible().catch(() => false)), 'GPC ativo: aviso nem aparece')
  checa(pedidos.length === 0, 'GPC ativo: nenhum medidor carrega')
  const ck = (await ctx.cookies()).find(c => c.name === 'valen_consent')
  checa(ck && decodeURIComponent(ck.value).split('|').slice(1,2)[0] === 'denied', 'GPC ativo: recusa gravada')
  checa(ck && decodeURIComponent(ck.value).split('|')[3] === 'gpc', 'GPC ativo: origem registrada como gpc')
  await ctx.close()
}

await navegador.close()
servidor.close()
console.log(linhas.join('\n'))
console.log(falhas === 0 ? `\nTODOS OS ${linhas.length} TESTES PASSARAM` : `\n${falhas} FALHA(S) de ${linhas.length}`)
process.exit(falhas === 0 ? 0 : 1)
