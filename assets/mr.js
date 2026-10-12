/* MR Gestão e Assessoria · comportamento comum das páginas. */

/* ===== CONFIGURAÇÃO ===== */
var MR = {
  WHATSAPP: "5537991474586",
  // Links de pagamento da Eduzz. Enquanto estiverem vazios, os botões abrem o WhatsApp.
  CHECKOUT_INDIVIDUAL: "",   // produto "Imersão Gestão e Liderança · Individual" (R$ 790)
  CHECKOUT_GRUPO: "",        // produto "Imersão Gestão e Liderança · Grupo" (R$ 740 por pessoa, 2 ou mais)
  PRECO_INDIVIDUAL: 790,
  PRECO_GRUPO: 740,
  INICIO: "2026-11-28T07:00:00-03:00",
  MAX_VAGAS: 20
};
/* ======================== */

(function(){
  var reais = function(n){ return "R$ " + n.toLocaleString("pt-BR"); };
  var wa = function(msg){ return "https://wa.me/" + MR.WHATSAPP + "?text=" + encodeURIComponent(msg); };
  var abrirFora = function(a){ a.target = "_blank"; a.rel = "noopener"; };

  // WhatsApp: [data-wa="mensagem"]
  document.querySelectorAll("[data-wa]").forEach(function(a){
    a.href = wa(a.getAttribute("data-wa")); abrirFora(a);
  });

  // Inscrição individual: [data-checkout="individual"]
  document.querySelectorAll('[data-checkout="individual"]').forEach(function(a){
    a.href = MR.CHECKOUT_INDIVIDUAL || wa("Olá! Quero garantir minha vaga na Imersão Gestão e Liderança do dia 28/11 (individual, " + reais(MR.PRECO_INDIVIDUAL) + ").");
    abrirFora(a);
  });

  // Grupo: seletor de quantidade com total e economia
  var grupo = document.querySelector("[data-grupo]");
  if (grupo) {
    var n = 2, out = grupo.querySelector("output"), menos = grupo.querySelector("[data-menos]"), mais = grupo.querySelector("[data-mais]");
    var tot = grupo.querySelector("[data-total]"), eco = grupo.querySelector("[data-economia]"), btns = document.querySelectorAll('[data-checkout="grupo"]');
    var atualizar = function(){
      out.value = out.textContent = n;
      menos.disabled = n <= 2; mais.disabled = n >= MR.MAX_VAGAS;
      tot.textContent = reais(n * MR.PRECO_GRUPO);
      eco.textContent = reais(n * (MR.PRECO_INDIVIDUAL - MR.PRECO_GRUPO));
      btns.forEach(function(a){
        a.href = MR.CHECKOUT_GRUPO || wa("Olá! Quero garantir " + n + " vagas na Imersão Gestão e Liderança do dia 28/11 (grupo, " + reais(MR.PRECO_GRUPO) + " por pessoa, total " + reais(n * MR.PRECO_GRUPO) + ").");
        abrirFora(a);
        var t = a.querySelector("[data-txt]"); if (t) t.textContent = "Garantir " + n + " vagas";
      });
    };
    menos.addEventListener("click", function(){ if (n > 2) { n--; atualizar(); } });
    mais.addEventListener("click", function(){ if (n < MR.MAX_VAGAS) { n++; atualizar(); } });
    atualizar();
  }

  // Contagem regressiva: [data-count] com [data-d] [data-h] [data-m] [data-s]
  var fim = new Date(MR.INICIO).getTime();
  var dois = function(x){ return x < 10 ? "0" + x : "" + x; };
  var contas = document.querySelectorAll("[data-count]");
  var tique = function(){
    var s = Math.max(0, Math.floor((fim - Date.now()) / 1000));
    var v = { d: Math.floor(s / 86400), h: dois(Math.floor(s % 86400 / 3600)), m: dois(Math.floor(s % 3600 / 60)), s: dois(s % 60) };
    contas.forEach(function(c){ ["d","h","m","s"].forEach(function(k){ var el = c.querySelector("[data-" + k + "]"); if (el) el.textContent = v[k]; }); });
    document.querySelectorAll("[data-dias]").forEach(function(el){ el.textContent = v.d === 1 ? "Falta 1 dia" : "Faltam " + v.d + " dias"; });
  };
  if (contas.length || document.querySelector("[data-dias]")) { tique(); setInterval(tique, 1000); }

  // Topo mais escuro ao rolar
  var top = document.querySelector(".top");
  var aoRolar = function(){ if (top) top.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", aoRolar, { passive: true }); aoRolar();

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

  // Barra fixa do celular: aparece depois do topo e some na seção de investimento
  var dock = document.querySelector(".dock"), hero = document.querySelector("[data-hero]"), inv = document.getElementById("investimento");
  if (dock && hero) {
    var passou = false, emInv = false;
    var mostrar = function(){ dock.classList.toggle("is-on", passou && !emInv); };
    new IntersectionObserver(function(es){ passou = !es[0].isIntersecting; mostrar(); }).observe(hero);
    if (inv) new IntersectionObserver(function(es){ emInv = es[0].isIntersecting; mostrar(); }, { threshold: .15 }).observe(inv);
  }

  // Menu: marca a seção visível
  var links = document.querySelectorAll(".nav a[href^='#']");
  if (links.length) {
    var mapa = {};
    var marcar = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { links.forEach(function(a){ a.classList.remove("is-on"); }); mapa[e.target.id].classList.add("is-on"); } });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function(a){ var s = document.querySelector(a.getAttribute("href")); if (s) { mapa[s.id] = a; marcar.observe(s); } });
  }

})();
