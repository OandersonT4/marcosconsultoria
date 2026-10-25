/* MR · cena "da bagunça à produção" (Consultoria).
   A seção é alta e o quadro fica fixo; a rolagem (0 a 1) leva a fábrica da bagunça à produção:
   1 bagunça · 2 layout (máquinas vão para o lugar) · 3 consumo (o retalho some) · 4 pessoas (cada um no posto) · 5 produção (pares andando).
   Com "reduzir movimento" ou sem JS, mostra a fábrica pronta e todos os passos. */
(function(){
  var cena = document.querySelector("[data-cena]"); if (!cena) return;
  var chao = cena.querySelector(".chao"), passos = cena.querySelectorAll(".passos-cena li"), pontos = cena.querySelectorAll(".cena-pontos i");
  var selo = cena.querySelector(".chao-selo"), espaguete = cena.querySelectorAll(".espaguete"), fluxo = cena.querySelector(".fluxo");
  var maqs = [].map.call(cena.querySelectorAll(".chao-maq"), function(el){
    el.style.left = el.style.top = "0";
    var o = el.getAttribute("data-o").split(",").map(Number), c = el.getAttribute("data-c").split(",").map(Number);
    return { el: el, o: o, c: c };
  });
  var pessoas = [].map.call(cena.querySelectorAll(".pessoa"), function(el, i){
    el.style.left = el.style.top = "0";
    return { el: el, c: el.getAttribute("data-c").split(",").map(Number), o: el.getAttribute("data-o").split(",").map(Number), f: 0.6 + (i % 4) * 0.35 };
  });
  var retalhos = cena.querySelectorAll(".retalho");
  var nomes = ["Bagunça", "Layout", "Sem desperdício", "Equipe treinada", "Produzindo"];
  var calmo = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W = 0, H = 0;
  var medir = function(){ W = chao.clientWidth; H = chao.clientHeight; };
  var lim = function(v){ return v < 0 ? 0 : v > 1 ? 1 : v; };
  var suave = function(v){ return v * v * (3 - 2 * v); };
  var mistura = function(a, b, k){ return a + (b - a) * k; };
  var etapaAtual = -1;

  var desenhar = function(t, agora){
    // t vai de 0 a 5
    var a = suave(lim((t - 0.7) / 0.9)), s = lim((t - 1.7) / 0.9), q = suave(lim((t - 2.7) / 0.9));
    maqs.forEach(function(m){
      var x = mistura(m.c[0], m.o[0], a) / 100 * W, y = mistura(m.c[1], m.o[1], a) / 100 * H, r = mistura(m.c[2], 0, a);
      m.el.style.transform = "translate(" + (x - m.el.offsetWidth / 2).toFixed(1) + "px," + (y - m.el.offsetHeight / 2).toFixed(1) + "px) rotate(" + r.toFixed(1) + "deg)";
    });
    espaguete.forEach(function(p){ p.style.opacity = (0.6 * (1 - a)).toFixed(2); });
    fluxo.style.strokeDashoffset = (1 - a).toFixed(3);
    retalhos.forEach(function(r, i){
      var k = lim(s * 1.6 - (i % 5) * 0.12);
      r.style.opacity = (0.75 * (1 - k)).toFixed(2);
      r.style.transform = "scale(" + (1 - k * 0.7).toFixed(2) + ") rotate(" + (i * 37) + "deg)";
    });
    pessoas.forEach(function(p, i){
      var vai = calmo ? 0 : (1 - q) * 2.2;
      var jx = Math.sin(agora / 1000 * p.f + i) * vai, jy = Math.cos(agora / 1000 * p.f * 0.8 + i * 2) * vai;
      var x = (mistura(p.c[0], p.o[0], q) + jx) / 100 * W, y = (mistura(p.c[1], p.o[1], q) + jy) / 100 * H;
      p.el.style.transform = "translate(" + (x - p.el.offsetWidth / 2).toFixed(1) + "px," + (y - p.el.offsetHeight / 2).toFixed(1) + "px)";
    });
    chao.classList.toggle("ok", a > 0.98);
    chao.classList.toggle("lider", q > 0.5);
    chao.classList.toggle("fluindo", t >= 3.7);
    var etapa = Math.min(4, Math.floor(t));
    if (etapa !== etapaAtual) {
      etapaAtual = etapa;
      passos.forEach(function(li, i){ li.classList.toggle("on", calmo || i === etapa); });
      pontos.forEach(function(p, i){ p.classList.toggle("on", i <= etapa); });
      selo.textContent = nomes[etapa];
    }
  };

  if (calmo) { medir(); desenhar(5, 0); window.addEventListener("resize", function(){ medir(); desenhar(5, 0); }); return; }

  var visivel = false, pedido = 0;
  var progresso = function(){
    var r = cena.getBoundingClientRect(), total = cena.offsetHeight - window.innerHeight;
    return total > 0 ? lim(-r.top / total) : 1;
  };
  var laco = function(agora){
    desenhar(Math.min(4.999, progresso() * 5.4), agora);
    pedido = visivel ? requestAnimationFrame(laco) : 0;
  };
  new IntersectionObserver(function(es){
    visivel = es[0].isIntersecting;
    if (visivel && !pedido) pedido = requestAnimationFrame(laco);
  }).observe(cena);
  window.addEventListener("resize", medir);
  medir(); desenhar(0, 0);
})();
