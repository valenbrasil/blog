/*
 * Aviso de cookies do blog.valenbrasil.com — versão sem framework, para o repositório do blog.
 *
 * Por que existe: o blog e a homepage são publicados separadamente, mas estão no mesmo domínio
 * (valenbrasil.com). A decisão sobre cookies é gravada num cookie no domínio de topo
 * (.valenbrasil.com), então quem decide no blog não vê o aviso de novo na homepage, e vice-versa.
 *
 * Precisa ser IDÊNTICO à homepage em: nome do cookie, formato do valor, validade e versão da
 * política. Se qualquer um mudar lá, mude aqui também (há um teste na homepage que avisa).
 *
 * Como instalar no blog:
 *   1. Copie este arquivo para os arquivos estáticos do blog (ex.: /js/consentimento-valen.js).
 *   2. No <head> de todas as páginas, antes de qualquer outro script, adicione:
 *        <script src="/js/consentimento-valen.js"></script>
 *   3. REMOVA do <head> as tags soltas de Google Analytics, Ahrefs e Cloudflare: este arquivo
 *      carrega as três apenas depois do "Aceitar".
 *   4. No rodapé, para a pessoa poder mudar de ideia, adicione:
 *        <button type="button" onclick="ValenConsent.abrirPreferencias()">Preferências de cookies</button>
 */
(function () {
  "use strict";

  var COOKIE = "valen_consent";
  var TTL_DIAS = 365;
  var VERSAO_POLITICA = "2026-09-06"; // igual a PRIVACY_POLICY_VERSION da homepage
  var POLITICA_URL = "https://valenbrasil.com/politica-de-privacidade";

  // Medições do blog. O token do Cloudflare é o do blog, diferente do da homepage.
  var GA_ID = "G-DP9C1G5246";
  var AHREFS_KEY = "X2AoK5UaoY8tPMNmCRaBhA";
  var CF_TOKEN = "48a089b94e6d42b8a5ce2f0856257c25";
  var GA_COOKIE_EXPIRES = 33696000; // 13 meses

  var TEXTO = {
    eyebrow: "Privacidade",
    titulo: "Cookies neste site",
    corpo:
      "Usamos apenas um cookie necessário para lembrar sua escolha, que vale também no nosso site. " +
      "Se você autorizar, também usamos o Google Analytics, o Ahrefs Web Analytics e o Cloudflare Web Analytics " +
      "para medir, de forma agregada, como o site é utilizado. Sem sua autorização, nenhum cookie de análise é criado. " +
      'Você pode mudar sua decisão a qualquer momento em "Preferências de cookies", no rodapé. Saiba mais na ',
    linkRotulo: "Política de Privacidade",
    rejeitar: "Rejeitar",
    aceitar: "Aceitar",
    fechar: "Fechar",
  };

  // ---------------------------------------------------------------- cookie
  function dominio() {
    var host = location.hostname;
    var apex = host.split(".").slice(-2).join(".");
    return apex.indexOf(".") > -1 && host.slice(-apex.length) === apex ? "; domain=." + apex : "";
  }

  function lerCookie() {
    var partes = document.cookie.split(";");
    for (var i = 0; i < partes.length; i++) {
      var p = partes[i].trim();
      if (p.indexOf(COOKIE + "=") === 0) return decodeURIComponent(p.slice(COOKIE.length + 1));
    }
    return null;
  }

  function gravarCookie(analytics, origem) {
    var valor = ["1", analytics, VERSAO_POLITICA, origem, new Date().toISOString()].join("|");
    var seguro = location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      COOKIE + "=" + encodeURIComponent(valor) + "; Max-Age=" + TTL_DIAS * 86400 + "; Path=/" + dominio() + "; SameSite=Lax" + seguro;
  }

  /** Decisão vigente ou null (ausente, de outra versão da política ou vencida). */
  function decisao() {
    var valor = lerCookie();
    if (!valor) return null;
    var p = valor.split("|");
    if (p[0] !== "1" || (p[1] !== "granted" && p[1] !== "denied") || p[2] !== VERSAO_POLITICA) return null;
    var quando = new Date(p[4]).getTime();
    if (!isFinite(quando) || quando + TTL_DIAS * 864e5 < Date.now()) return null;
    return p[1];
  }

  // ------------------------------------------------------- consent mode
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  function apagarCookiesGa() {
    var host = location.hostname;
    var apex = host.split(".").slice(-2).join(".");
    var dominios = ["", host, "." + host, "." + apex];
    var nomes = document.cookie.split(";").map(function (c) {
      return c.trim().split("=")[0];
    });
    for (var i = 0; i < nomes.length; i++) {
      if (nomes[i] !== "_ga" && nomes[i].indexOf("_ga_") !== 0) continue;
      for (var j = 0; j < dominios.length; j++) {
        document.cookie = nomes[i] + "=; Max-Age=0; path=/" + (dominios[j] ? "; domain=" + dominios[j] : "");
      }
    }
  }

  var carregado = false;
  function carregarMedicoes() {
    if (carregado) return;
    carregado = true;
    gtag("consent", "update", { analytics_storage: "granted" });

    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(ga);
    gtag("js", new Date());
    gtag("config", GA_ID, {
      cookie_expires: GA_COOKIE_EXPIRES,
      cookie_flags: "SameSite=Lax;Secure",
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    var ahrefs = document.createElement("script");
    ahrefs.async = true;
    ahrefs.src = "https://analytics.ahrefs.com/analytics.js";
    ahrefs.setAttribute("data-key", AHREFS_KEY);
    document.head.appendChild(ahrefs);

    var cf = document.createElement("script");
    cf.type = "module";
    cf.src = "https://static.cloudflareinsights.com/beacon.min.js";
    cf.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
    document.head.appendChild(cf);
  }

  function aplicar(valor, origem) {
    gravarCookie(valor, origem);
    if (valor === "granted") carregarMedicoes();
    else {
      window["ga-disable-" + GA_ID] = true;
      gtag("consent", "update", { analytics_storage: "denied" });
      apagarCookiesGa();
    }
  }

  // ------------------------------------------------------------- banner
  var caixa = null;

  function fechar() {
    if (!caixa) return;
    caixa.parentNode.removeChild(caixa);
    caixa = null;
    document.documentElement.style.scrollPaddingBottom = "";
  }

  function mostrar(jaDecidiu) {
    if (caixa) return;
    caixa = document.createElement("div");
    caixa.setAttribute("role", "dialog");
    caixa.setAttribute("aria-modal", "false");
    caixa.setAttribute("aria-label", TEXTO.titulo);
    caixa.style.cssText =
      "position:fixed;left:0;right:0;bottom:0;z-index:2147483000;padding:16px;" +
      "font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#464843";

    var cartao = document.createElement("div");
    cartao.style.cssText =
      "max-width:1200px;margin:0 auto;background:#fff;border:1px solid #e6e8e4;border-radius:12px;" +
      "box-shadow:0 12px 32px rgba(20,22,19,.10),0 2px 6px rgba(20,22,19,.05);padding:20px;" +
      "max-height:calc(100dvh - 32px);overflow:auto";

    var eyebrow = document.createElement("p");
    eyebrow.textContent = TEXTO.eyebrow;
    eyebrow.style.cssText = "margin:0;font-size:12px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#61645e";

    var titulo = document.createElement("h2");
    titulo.textContent = TEXTO.titulo;
    titulo.style.cssText = "margin:8px 0 0;font-size:20px;font-weight:500;color:#141613";

    var corpo = document.createElement("p");
    corpo.style.cssText = "margin:8px 0 0;max-width:70ch";
    corpo.appendChild(document.createTextNode(TEXTO.corpo));
    var link = document.createElement("a");
    link.href = POLITICA_URL + "#cookies";
    link.textContent = TEXTO.linkRotulo;
    link.style.cssText = "color:#4a633c;text-decoration:underline;text-underline-offset:2px";
    corpo.appendChild(link);
    corpo.appendChild(document.createTextNode("."));

    var acoes = document.createElement("div");
    acoes.style.cssText = "display:flex;flex-wrap:wrap;gap:12px;margin-top:20px";

    function botao(rotulo, aoClicar) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = rotulo;
      b.style.cssText =
        "min-height:40px;padding:6px 16px;border:1px solid #c8cbc6;border-radius:8px;background:#fff;" +
        "font:500 14px/1.5 inherit;color:#141613;cursor:pointer";
      b.addEventListener("click", aoClicar);
      return b;
    }

    acoes.appendChild(
      botao(TEXTO.rejeitar, function () {
        aplicar("denied", "banner");
        fechar();
      }),
    );
    acoes.appendChild(
      botao(TEXTO.aceitar, function () {
        aplicar("granted", "banner");
        fechar();
      }),
    );
    if (jaDecidiu) acoes.appendChild(botao(TEXTO.fechar, fechar));

    cartao.appendChild(eyebrow);
    cartao.appendChild(titulo);
    cartao.appendChild(corpo);
    cartao.appendChild(acoes);
    caixa.appendChild(cartao);
    document.body.appendChild(caixa);
    // Recuo para o aviso não esconder o que recebe foco (WCAG 2.4.11).
    document.documentElement.style.scrollPaddingBottom = caixa.offsetHeight + "px";
  }

  function iniciar() {
    var atual = decisao();
    if (atual === "granted") {
      carregarMedicoes();
      return;
    }
    if (atual === "denied") return;
    // Sem decisão: Global Privacy Control ativo vale como recusa, sem mostrar o aviso.
    if (navigator.globalPrivacyControl === true) {
      aplicar("denied", "gpc");
      return;
    }
    mostrar(false);
  }

  window.ValenConsent = {
    decisao: decisao,
    abrirPreferencias: function () {
      mostrar(true);
    },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
