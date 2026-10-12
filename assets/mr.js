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
  var aoRolar = function(){ if (top) top.classList.toggle("is-scrolled", window.scrollY > 8); };
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
