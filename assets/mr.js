/* MR Gestão e Assessoria · comportamento comum das páginas. */

/* ===== CONFIGURAÇÃO ===== */
var MR = {
  WHATSAPP: "5537991474586",
  // Links de pagamento da Eduzz. Enquanto estiverem vazios, os botões abrem o WhatsApp.
  CHECKOUT_INDIVIDUAL: "",   // produto "Imersão Gestão e Liderança · Individual" (R$ 790)
  CHECKOUT_GRUPO: "",        // produto "Imersão Gestão e Liderança · Grupo" (R$ 740 por pessoa, 2 ou mais)
  INICIO: "2026-11-28T07:00:00-03:00"
};
// As vagas ficam em /assets/vagas.json ({"total": 80, "vendidas": 0}).
// Os produtos do catálogo ficam em /assets/produtos.json (como preencher: docs/catalogo.md).
// Com ?rascunho no endereço, a página mostra as partes ainda em montagem e o catálogo de exemplo.
/* ======================== */

(function(){
  var wa = function(msg){ return "https://wa.me/" + MR.WHATSAPP + "?text=" + encodeURIComponent(msg); };
  var abrirFora = function(a){ a.target = "_blank"; a.rel = "noopener"; };

  // WhatsApp: [data-wa="mensagem"]
  document.querySelectorAll("[data-wa]").forEach(function(a){ a.href = wa(a.getAttribute("data-wa")); abrirFora(a); });

  // Inscrição pela Eduzz: [data-checkout="individual" | "grupo"]
  var checkout = {
    individual: [MR.CHECKOUT_INDIVIDUAL, "Olá! Quero garantir minha vaga na Imersão Gestão e Liderança do dia 28/11 (individual, R$ 790)."],
    grupo: [MR.CHECKOUT_GRUPO, "Olá! Quero inscrever um grupo na Imersão Gestão e Liderança do dia 28/11 (R$ 740 por pessoa). Seremos __ pessoas."]
  };
  var ligarCheckout = function(){
    document.querySelectorAll("[data-checkout]").forEach(function(a){
      var c = checkout[a.getAttribute("data-checkout")]; if (!c) return;
      a.href = c[0] || wa(c[1]); abrirFora(a);
    });
  };
  ligarCheckout();

  // Vagas: [data-vagas] mostra quantas restam; [data-vagas-bar] mostra a barra
  var mostrarVagas = function(v){
    var total = +v.total || 0, restam = Math.max(0, total - (+v.vendidas || 0));
    document.querySelectorAll("[data-vagas]").forEach(function(el){
      el.textContent = restam === 0 ? "Vagas esgotadas" : restam === 1 ? "Resta 1 vaga" : "Restam " + restam + " de " + total + " vagas";
    });
    document.querySelectorAll("[data-vagas-bar]").forEach(function(el){ el.style.setProperty("--p", total ? (restam / total) : 0); });
    if (restam === 0) {
      document.documentElement.classList.add("esgotado");
      document.querySelectorAll("[data-checkout]").forEach(function(a){
        a.href = wa("Olá! As vagas da Imersão Gestão e Liderança esgotaram. Quero entrar na lista de espera."); abrirFora(a);
        var t = a.querySelector("[data-txt]") || a; if (t.childNodes.length) t.firstChild.textContent = "Entrar na lista de espera ";
      });
    }
  };
  if (document.querySelector("[data-vagas],[data-vagas-bar]") && window.fetch) {
    fetch("/assets/vagas.json", { cache: "no-store" }).then(function(r){ return r.json(); }).then(mostrarVagas).catch(function(){});
  }

  // Contagem regressiva: [data-count] com [data-d] [data-h] [data-m]; [data-dias] escreve "Faltam N dias"
  var fim = new Date(MR.INICIO).getTime();
  var dois = function(x){ return x < 10 ? "0" + x : "" + x; };
  var tique = function(){
    var m = Math.max(0, Math.floor((fim - Date.now()) / 60000));
    var v = { d: Math.floor(m / 1440), h: dois(Math.floor(m % 1440 / 60)), m: dois(m % 60) };
    document.querySelectorAll("[data-count]").forEach(function(c){ ["d","h","m"].forEach(function(k){ var el = c.querySelector("[data-" + k + "]"); if (el) el.textContent = v[k]; }); });
    document.querySelectorAll("[data-dias]").forEach(function(el){ el.textContent = v.d === 1 ? "Falta 1 dia" : "Faltam " + v.d + " dias"; });
  };
  tique(); setInterval(tique, 15000);

  // Barra de navegação: fundo ao rolar e menu do celular
  var top = document.querySelector(".top"), btn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
  var calmo = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var aoRolar = function(){
    if (top) top.classList.toggle("is-scrolled", window.scrollY > 8);
    // --rola (0 a 1 na primeira tela): o "MR" grande do topo desce devagar ao rolar
    if (!calmo) document.documentElement.style.setProperty("--rola", Math.min(1, window.scrollY / window.innerHeight).toFixed(3));
  };
  window.addEventListener("scroll", aoRolar, { passive: true }); aoRolar();
  if (btn && menu) {
    var abrir = function(on){
      btn.setAttribute("aria-expanded", on ? "true" : "false");
      top.classList.toggle("is-open", on);
      document.documentElement.classList.toggle("menu-aberto", on);
    };
    btn.addEventListener("click", function(){ abrir(btn.getAttribute("aria-expanded") !== "true"); });
    menu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ abrir(false); }); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") abrir(false); });
    window.addEventListener("resize", function(){ if (window.innerWidth > 960) abrir(false); });
  }

  // Rascunho: ?rascunho mostra os blocos [data-rascunho] e usa o catálogo de exemplo
  var rascunho = /[?&]rascunho\b/.test(location.search);
  if (rascunho) {
    document.documentElement.classList.add("rascunho");
    var av = document.createElement("p"); av.className = "aviso-rascunho";
    av.textContent = "Rascunho: as partes tracejadas e os produtos de exemplo não aparecem para o público.";
    document.body.appendChild(av);
  }

  // Catálogo: [data-catalogo] (com data-destaque="N" mostra só os N em destaque), [data-filtros], [data-busca]
  var lista = document.querySelector("[data-catalogo]");
  if (lista && window.fetch) {
    var esc = function(t){ return String(t == null ? "" : t).replace(/[&<>"']/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); };
    var real = function(v){ return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
    var sem = function(t){ return String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };
    var destaque = +lista.getAttribute("data-destaque") || 0;
    var filtros = document.querySelector("[data-filtros]"), busca = document.querySelector("[data-busca]");
    var produtos = [], cat = "", termo = "", ficha;

    var precoHtml = function(p){
      if (typeof p.preco === "number") return '<span class="preco">' + real(p.preco) + (p.preco_obs ? "<small>" + esc(p.preco_obs) + "</small>" : "") + "</span>";
      return '<span class="preco preco--consulta">' + esc(p.preco_obs || "Preço no WhatsApp") + "</span>";
    };
    var acao = function(p, cls){
      if (p.tipo === "indicacao" && p.link) return '<a class="btn btn--pine ' + cls + '" href="' + esc(p.link) + '" target="_blank" rel="sponsored noopener">Ver na loja <span class="arrow" aria-hidden="true">→</span></a>';
      var msg = p.tipo === "indicacao"
        ? "Olá, Marcos! Vi no site a sua indicação: " + p.nome + ". Pode me contar mais?"
        : "Olá, Marcos! Vi no site e quero: " + p.nome + (typeof p.preco === "number" ? " (" + real(p.preco) + ")" : "") + ".";
      return '<a class="btn btn--wa ' + cls + '" href="' + wa(msg) + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>' + (p.tipo === "indicacao" ? "Perguntar" : "Pedir") + "</a>";
    };
    var foto = function(p){
      return p.foto ? '<img src="' + esc(p.foto) + '" alt="' + esc(p.foto_alt || p.nome) + '" loading="lazy" decoding="async">' : '<span class="prod-ph" aria-hidden="true">' + esc((p.nome || "M").charAt(0)) + "</span>";
    };
    var selo = function(p){ return p.tipo === "indicacao" ? '<span class="prod-selo">Indicação</span>' : '<span class="prod-selo prod-selo--venda">Venda direta</span>'; };

    var desenhar = function(){
      var t = sem(termo), vis = produtos.filter(function(p){
        return (!cat || p.categoria === cat) && (!t || sem(p.nome + " " + p.categoria + " " + p.resumo + " " + p.descricao).indexOf(t) > -1);
      });
      if (destaque) vis = vis.filter(function(p){ return p.destaque; }).concat(vis.filter(function(p){ return !p.destaque; })).slice(0, destaque);
      if (!vis.length) {
        lista.innerHTML = produtos.length
          ? '<div class="vazio"><h3>Nada encontrado</h3><p>Tente outra palavra ou pergunte direto ao Marcos.</p><a class="btn btn--wa btn--sm" href="' + wa("Olá, Marcos! Procurei no site e não achei: " + termo) + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Perguntar no WhatsApp</a></div>'
          : '<div class="vazio"><span class="mark">MR</span><h3>O catálogo está sendo montado</h3><p>Os produtos que o Marcos vende e indica entram aqui em breve. Enquanto isso, pergunte pelo WhatsApp.</p><a class="btn btn--wa btn--sm" href="' + wa("Olá, Marcos! Quero saber quais produtos você vende e indica.") + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Perguntar no WhatsApp</a></div>';
        lista.classList.remove("prods");
        return;
      }
      lista.classList.add("prods");
      lista.innerHTML = vis.map(function(p){
        return '<article class="prod" id="' + esc(p.id) + '">' +
          '<button class="prod-foto" type="button" data-ficha="' + esc(p.id) + '" aria-label="Ver detalhes de ' + esc(p.nome) + '">' + foto(p) + selo(p) + "</button>" +
          '<div class="prod-corpo"><span class="prod-cat">' + esc(p.categoria) + "</span><h3>" + esc(p.nome) + "</h3>" + (p.resumo ? "<p>" + esc(p.resumo) + "</p>" : "") +
          '<div class="prod-pe">' + precoHtml(p) + acao(p, "btn--sm") + "</div></div></article>";
      }).join("");
    };

    var abrirFicha = function(id){
      var p = produtos.filter(function(x){ return x.id === id; })[0]; if (!p) return;
      if (!ficha) {
        ficha = document.createElement("dialog"); ficha.className = "ficha";
        ficha.addEventListener("click", function(e){ if (e.target === ficha || e.target.closest(".ficha-fechar")) ficha.close(); });
        document.body.appendChild(ficha);
      }
      ficha.innerHTML = '<button class="ficha-fechar" type="button" aria-label="Fechar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<div class="ficha-in"><div class="ficha-foto">' + foto(p) + '</div><div class="ficha-txt"><span class="prod-cat">' + esc(p.categoria) + (p.tipo === "indicacao" ? " · Indicação" : "") + "</span><h2>" + esc(p.nome) + "</h2>" +
        '<p class="desc">' + esc(p.descricao || p.resumo) + "</p>" + precoHtml(p) + acao(p, "btn--block") +
        (p.tipo === "indicacao" ? '<p class="muted" style="font-size:var(--t-xs)">Produto indicado pelo Marcos e vendido pela loja parceira.</p>' : "") + "</div></div>";
      if (ficha.showModal) ficha.showModal(); else ficha.setAttribute("open", "");
    };
    lista.addEventListener("click", function(e){ var b = e.target.closest("[data-ficha]"); if (b) abrirFicha(b.getAttribute("data-ficha")); });

    fetch(rascunho ? "/assets/produtos-exemplo.json" : "/assets/produtos.json", { cache: "no-store" })
      .then(function(r){ return r.json(); })
      .then(function(d){
        produtos = (d.produtos || []).filter(function(p){ return p && p.id && p.nome && p.ativo !== false; });
        if (filtros) {
          var cats = produtos.map(function(p){ return p.categoria; }).filter(function(c, i, a){ return c && a.indexOf(c) === i; });
          filtros.hidden = cats.length < 2;
          filtros.innerHTML = ['<button class="filtro" type="button" aria-pressed="true" data-cat="">Todos</button>'].concat(cats.map(function(c){ return '<button class="filtro" type="button" aria-pressed="false" data-cat="' + esc(c) + '">' + esc(c) + "</button>"; })).join("");
          filtros.addEventListener("click", function(e){
            var b = e.target.closest(".filtro"); if (!b) return; cat = b.getAttribute("data-cat");
            filtros.querySelectorAll(".filtro").forEach(function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); desenhar();
          });
        }
        if (busca) { busca.closest(".busca").hidden = produtos.length < 2; busca.addEventListener("input", function(){ termo = busca.value.trim(); desenhar(); }); }
        desenhar();
        // /produtos/#id abre a ficha do produto (link para mandar a alguém)
        var peloHash = function(){ if (location.hash.length > 1) abrirFicha(decodeURIComponent(location.hash.slice(1))); };
        peloHash(); window.addEventListener("hashchange", peloHash);
      })
      .catch(function(){ produtos = []; desenhar(); });
  }

  // Dúvidas: abre uma de cada vez
  document.querySelectorAll(".acc").forEach(function(acc){
    acc.addEventListener("toggle", function(e){
      if (e.target.open) acc.querySelectorAll("details[open]").forEach(function(d){ if (d !== e.target) d.open = false; });
    }, true);
  });

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function(el){ el.classList.add("is-in"); });
    return;
  }

  // Entrada suave ao rolar
  var ver = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add("is-in"); ver.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function(el){ ver.observe(el); });

  // Menu: marca a seção visível
  var links = document.querySelectorAll(".nav a[href^='#']");
  if (links.length) {
    var mapa = {};
    var marcar = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { links.forEach(function(a){ a.classList.remove("is-on"); }); (mapa[e.target.id] || []).forEach(function(a){ a.classList.add("is-on"); }); } });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function(a){ var s = document.querySelector(a.getAttribute("href")); if (s) { (mapa[s.id] = mapa[s.id] || []).push(a); marcar.observe(s); } });
  }
})();
