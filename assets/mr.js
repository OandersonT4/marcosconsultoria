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
// Os serviços (pacotes) da consultoria ficam em /assets/consultoria.json (como preencher: docs/consultoria.md).
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
  // Sem filtro nem busca, a página de produtos mostra uma seção por linha (categoria).
  // Cada produto sem foto mostra a amostra do material (campo "textura"; sem ele, a da categoria).
  // "Pôr na lista" monta o pedido (guardado no navegador, vale entre as páginas) e manda tudo junto pelo WhatsApp.
  var lista = document.querySelector("[data-catalogo]");
  var esc = function(t){ return String(t == null ? "" : t).replace(/[&<>"']/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); };
  var real = function(v){ return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
  var TEXTURA_CAT = { "Placas": "papelao", "Laminados e espumas": "eva", "Sintéticos e forros": "couro", "Colas e químicos": "cola", "Palmilhas e matrizes": "palmilha" };
  var tx = function(p){ return "tx tx-" + esc(p.textura || TEXTURA_CAT[p.categoria] || "papelao"); };
  var ICO_MAIS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var ICO_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  // Lista de pedido: [{id, opcao, obs}] em localStorage
  var CHAVE = "mr-lista";
  var ler = function(){ try { return JSON.parse(localStorage.getItem(CHAVE)) || []; } catch(e){ return []; } };
  var gravar = function(l){ try { localStorage.setItem(CHAVE, JSON.stringify(l)); } catch(e){} };
  // A lista enviada fica guardada em "mr-ultima": com a lista vazia, a barra oferece "Repetir" (fábrica compra igual todo mês).
  var lerUltima = function(){ try { return JSON.parse(localStorage.getItem(CHAVE + "-ultima")) || []; } catch(e){ return []; } };
  var pedido = ler(), produtos = [], porId = {}, barra, gaveta;
  var naLista = function(id){ return pedido.some(function(x){ return x.id === id; }); };

  var mensagem = function(){
    return "Olá, Marcos! Montei esta lista pelo site:\n" + pedido.map(function(x){
      var p = porId[x.id]; if (!p) return "";
      return "• " + p.nome + (x.opcao ? " · " + x.opcao : "") + (x.obs ? " · " + x.obs : "");
    }).filter(Boolean).join("\n") + "\nPode me passar o preço e o prazo?";
  };
  var montarBarra = function(){
    if (barra) return;
    barra = document.createElement("div"); barra.className = "lista-barra"; barra.hidden = true;
    barra.innerHTML = '<span class="pilha" aria-hidden="true"></span><p><b data-qtd></b>Diga cor, espessura e quantidade</p><button class="btn btn--brass btn--sm" type="button">Ver lista</button>';
    barra.querySelector("button").addEventListener("click", function(){
      if (!pedido.length) { pedido = lerUltima().filter(function(x){ return porId[x.id]; }); gravar(pedido); atualizarBarra(); }
      abrirGaveta();
    });
    document.body.appendChild(barra);
    gaveta = document.createElement("dialog"); gaveta.className = "gaveta"; gaveta.setAttribute("aria-label", "Sua lista");
    gaveta.addEventListener("click", function(e){ if (e.target === gaveta || e.target.closest("[data-fechar]")) gaveta.close(); });
    document.body.appendChild(gaveta);
  };
  var atualizarBarra = function(pular){
    montarBarra();
    var n = pedido.filter(function(x){ return porId[x.id]; }).length, ult = n ? [] : lerUltima().filter(function(x){ return porId[x.id]; });
    barra.hidden = !n && !ult.length; document.body.classList.toggle("tem-lista", !barra.hidden);
    barra.querySelector("p").innerHTML = n
      ? "<b>" + (n === 1 ? "1 item na lista" : n + " itens na lista") + "</b>Diga cor, espessura e quantidade"
      : "<b>Seu último pedido</b>" + (ult.length === 1 ? "1 item" : ult.length + " itens") + ", pronto para mandar de novo";
    barra.querySelector("button").textContent = n ? "Ver lista" : "Repetir";
    barra.querySelector(".pilha").innerHTML = (n ? pedido : ult).slice(-3).map(function(x){ return porId[x.id] ? '<i class="' + tx(porId[x.id]) + '"></i>' : ""; }).join("");
    if (pular) { barra.classList.remove("pula"); void barra.offsetWidth; barra.classList.add("pula"); }
    document.querySelectorAll("[data-por]").forEach(function(b){
      var on = naLista(b.getAttribute("data-por"));
      b.classList.toggle("na-lista", on); b.innerHTML = (on ? ICO_OK + "Na lista" : ICO_MAIS + "Pôr na lista");
    });
  };
  var desenharGaveta = function(){
    var linhas = pedido.filter(function(x){ return porId[x.id]; });
    gaveta.innerHTML = '<div class="gaveta-cab"><h2>Sua lista</h2><button class="ficha-fechar" style="position:static" type="button" data-fechar aria-label="Fechar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="gaveta-corpo">' + (linhas.length ? linhas.map(function(x){
        var p = porId[x.id];
        return '<div class="linha-ped" data-id="' + esc(p.id) + '"><i class="' + tx(p) + '"></i><b>' + esc(p.nome) + '</b>' +
          '<button class="tirar" type="button" data-tirar aria-label="Tirar ' + esc(p.nome) + ' da lista"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
          (p.opcoes && p.opcoes.length ? '<div class="opcoes" role="group" aria-label="' + esc(p.opcoes_nome || "Opção") + '">' + p.opcoes.map(function(o){ return '<button class="opcao" type="button" aria-pressed="' + ((x.opcao || "").split(", ").indexOf(o) > -1) + '">' + esc(o) + "</button>"; }).join("") + "</div>" : "") +
          '<input type="text" data-obs value="' + esc(x.obs || "") + '" placeholder="Cor, quantidade… (ex.: preto, 50 folhas)" aria-label="Detalhes de ' + esc(p.nome) + '"></div>';
      }).join("") : '<p class="gaveta-vazia">A lista está vazia. Toque em "Pôr na lista" nos produtos.</p>') + "</div>" +
      '<div class="gaveta-pe"><a class="btn btn--wa btn--block" data-enviar href="#"><svg aria-hidden="true"><use href="#i-wa"/></svg>Enviar a lista para o Marcos</a><p class="muted">O Marcos responde com o preço e o prazo. Nada é cobrado aqui.</p></div>';
    var enviar = gaveta.querySelector("[data-enviar]");
    enviar.addEventListener("click", function(){
      // depois de enviar, a lista vira o "último pedido" e esvazia
      try { localStorage.setItem(CHAVE + "-ultima", JSON.stringify(pedido)); } catch(e){}
      setTimeout(function(){ pedido = []; gravar(pedido); gaveta.close(); atualizarBarra(); }, 300);
    });
    var ligar = function(){ enviar.href = wa(mensagem()); abrirFora(enviar); };
    ligar();
    gaveta.querySelectorAll(".linha-ped").forEach(function(el){
      var id = el.getAttribute("data-id"), item = pedido.filter(function(x){ return x.id === id; })[0];
      el.querySelector("[data-tirar]").addEventListener("click", function(){ pedido = pedido.filter(function(x){ return x.id !== id; }); gravar(pedido); atualizarBarra(); desenharGaveta(); if (!pedido.length) gaveta.close(); });
      el.querySelectorAll(".opcao").forEach(function(b){ b.addEventListener("click", function(){
        // pode marcar mais de uma (ex.: duas espessuras); vai na mensagem separado por vírgula
        b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
        item.opcao = [].filter.call(el.querySelectorAll(".opcao"), function(o){ return o.getAttribute("aria-pressed") === "true"; }).map(function(o){ return o.textContent; }).join(", ");
        gravar(pedido); ligar();
      }); });
      el.querySelector("[data-obs]").addEventListener("input", function(e){ item.obs = e.target.value.trim(); gravar(pedido); ligar(); });
    });
  };
  var abrirGaveta = function(){ desenharGaveta(); if (gaveta.showModal) gaveta.showModal(); else gaveta.setAttribute("open", ""); };
  var porNaLista = function(id){
    if (naLista(id)) { abrirGaveta(); return; }
    pedido.push({ id: id, opcao: "", obs: "" }); gravar(pedido); atualizarBarra(true);
  };

  if (lista && window.fetch) {
    var sem = function(t){ return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
    var destaque = +lista.getAttribute("data-destaque") || 0;
    var filtros = document.querySelector("[data-filtros]"), busca = document.querySelector("[data-busca]");
    var cat = "", termo = "", ficha;

    var precoHtml = function(p){
      if (typeof p.preco === "number") return '<span class="preco">' + real(p.preco) + (p.preco_obs ? "<small>" + esc(p.preco_obs) + "</small>" : "") + "</span>";
      return '<span class="preco preco--consulta">' + esc(p.preco_obs || "Preço no WhatsApp") + "</span>";
    };
    var acao = function(p, cls){
      if (p.tipo === "indicacao" && p.link) return '<a class="btn btn--pine ' + cls + '" href="' + esc(p.link) + '" target="_blank" rel="sponsored noopener">Ver na loja <span class="arrow" aria-hidden="true">→</span></a>';
      if (p.tipo === "indicacao") return '<a class="btn btn--wa ' + cls + '" href="' + wa("Olá, Marcos! Vi no site a sua indicação: " + p.nome + ". Pode me contar mais?") + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Perguntar</a>';
      return '<button class="add" type="button" data-por="' + esc(p.id) + '"></button>';
    };
    var amostra = function(p){
      return p.foto ? '<img src="' + esc(p.foto) + '" alt="' + esc(p.foto_alt || p.nome) + '" loading="lazy" decoding="async">' : "";
    };
    var cartao = function(p){
      return '<article class="item" id="' + esc(p.id) + '">' +
        '<button class="item-amostra ' + (p.foto ? "" : tx(p)) + '" type="button" data-ficha="' + esc(p.id) + '" aria-label="Ver detalhes de ' + esc(p.nome) + '">' + amostra(p) + "</button>" +
        '<div class="item-corpo">' + (p.selo ? '<span class="item-selo">' + esc(p.selo) + "</span>" : "") +
        '<h3><button type="button" data-ficha="' + esc(p.id) + '">' + esc(p.nome) + "</button></h3>" + (p.resumo ? "<p>" + esc(p.resumo) + "</p>" : "") +
        '<div class="item-pe">' + (typeof p.preco === "number" || p.preco_obs ? precoHtml(p) : "<span></span>") + acao(p, "btn--sm") + "</div></div></article>";
    };

    var desenhar = function(){
      var t = sem(termo), vis = produtos.filter(function(p){
        return (!cat || p.categoria === cat) && (!t || sem(p.nome + " " + p.categoria + " " + p.resumo + " " + p.descricao + " " + (p.opcoes || []).join(" ")).indexOf(t) > -1);
      });
      if (destaque) vis = vis.filter(function(p){ return p.destaque; }).concat(vis.filter(function(p){ return !p.destaque; })).slice(0, destaque);
      if (!vis.length) {
        lista.className = "";
        lista.innerHTML = produtos.length
          ? '<div class="vazio"><h3>Nada encontrado</h3><p>Tente outra palavra ou pergunte direto ao Marcos.</p><a class="btn btn--wa btn--sm" href="' + wa("Olá, Marcos! Procurei no site e não achei: " + termo) + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Perguntar no WhatsApp</a></div>'
          : '<div class="vazio"><span class="mark">MR</span><h3>O catálogo está sendo montado</h3><p>Os produtos entram aqui em breve. Enquanto isso, pergunte pelo WhatsApp.</p><a class="btn btn--wa btn--sm" href="' + wa("Olá, Marcos! Quero saber quais produtos você tem.") + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Perguntar no WhatsApp</a></div>';
        return;
      }
      if (!destaque && !cat && !t) {
        var cats = vis.map(function(p){ return p.categoria; }).filter(function(c, i, a){ return a.indexOf(c) === i; });
        lista.className = "catalogo";
        lista.innerHTML = cats.map(function(c){
          var dela = vis.filter(function(p){ return p.categoria === c; });
          return '<section class="grupo"><div class="grupo-cab"><i class="tx tx-' + esc(TEXTURA_CAT[c] || "papelao") + '" aria-hidden="true"></i><h2>' + esc(c) + "</h2><small>" + dela.length + (dela.length === 1 ? " produto" : " produtos") + '</small></div><div class="cards">' + dela.map(cartao).join("") + "</div></section>";
        }).join("");
      } else {
        lista.className = "cards";
        lista.innerHTML = vis.map(cartao).join("");
      }
      atualizarBarra();
    };

    var abrirFicha = function(id){
      var p = porId[id]; if (!p) return;
      if (!ficha) {
        ficha = document.createElement("dialog"); ficha.className = "ficha";
        ficha.addEventListener("click", function(e){
          if (e.target === ficha || e.target.closest(".ficha-fechar")) ficha.close();
          var b = e.target.closest("[data-por]"); if (b) { ficha.close(); porNaLista(b.getAttribute("data-por")); }
        });
        document.body.appendChild(ficha);
      }
      ficha.innerHTML = '<button class="ficha-fechar" type="button" aria-label="Fechar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<div class="ficha-in"><div class="ficha-foto ' + (p.foto ? "" : tx(p)) + '">' + amostra(p) + '</div><div class="ficha-txt"><span class="prod-cat">' + esc(p.categoria) + (p.tipo === "indicacao" ? " · Indicação" : "") + "</span><h2>" + esc(p.nome) + "</h2>" +
        '<p class="desc">' + esc(p.descricao || p.resumo) + "</p>" + (p.opcoes && p.opcoes.length ? '<ul class="chips">' + p.opcoes.map(function(o){ return '<li class="chip">' + esc(o) + "</li>"; }).join("") + "</ul>" : "") + precoHtml(p) +
        (p.tipo === "indicacao" ? acao(p, "btn--block") : '<button class="btn btn--pine btn--block" type="button" data-por="' + esc(p.id) + '">Pôr na lista</button>') +
        (p.tipo === "indicacao" ? '<p class="muted" style="font-size:var(--t-xs)">Produto indicado pelo Marcos e vendido pela loja parceira.</p>' : "") +
        (p.pagina ? '<a class="btn btn--ghost btn--block" href="' + esc(p.pagina) + '">Ver a página do produto</a>' : "") + "</div></div>";
      if (ficha.showModal) ficha.showModal(); else ficha.setAttribute("open", "");
    };
    lista.addEventListener("click", function(e){
      var b = e.target.closest("[data-por]"); if (b) { porNaLista(b.getAttribute("data-por")); return; }
      var f = e.target.closest("[data-ficha]"); if (f) abrirFicha(f.getAttribute("data-ficha"));
    });

    fetch(rascunho ? "/assets/produtos-exemplo.json" : "/assets/produtos.json", { cache: "no-store" })
      .then(function(r){ return r.json(); })
      .then(function(d){
        produtos = (d.produtos || []).filter(function(p){ return p && p.id && p.nome && p.ativo !== false; });
        produtos.forEach(function(p){ porId[p.id] = p; });
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

  // Pacotes da consultoria: [data-pacotes] com [data-servicos], [data-escolha-lista], [data-escolha-total], [data-escolha-enviar]
  // /consultoria/?servico=id já marca um serviço. Sem serviços no JSON, a seção continua escondida.
  var pac = document.querySelector("[data-pacotes]");
  if (pac && window.fetch) {
    var escP = function(t){ return String(t == null ? "" : t).replace(/[&<>"']/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); };
    var realP = function(v){ return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
    var caixa = pac.querySelector("[data-servicos]"), listaE = pac.querySelector("[data-escolha-lista]"),
        totalE = pac.querySelector("[data-escolha-total]"), enviar = pac.querySelector("[data-escolha-enviar]");
    var servicos = [], descontos = [];
    var atualizar = function(){
      var marc = servicos.filter(function(sv){ var i = caixa.querySelector('input[value="' + sv.id + '"]'); return i && i.checked; });
      if (!marc.length) {
        listaE.innerHTML = '<li class="muted">Nenhum serviço marcado ainda.</li>'; totalE.innerHTML = "";
        enviar.setAttribute("aria-disabled", "true"); enviar.href = "#"; return;
      }
      listaE.innerHTML = marc.map(function(sv){ return "<li><span>" + escP(sv.nome) + "</span><span>" + (typeof sv.preco === "number" ? realP(sv.preco) : "a combinar") + "</span></li>"; }).join("");
      var comPreco = marc.filter(function(sv){ return typeof sv.preco === "number"; });
      var soma = comPreco.reduce(function(t, sv){ return t + sv.preco; }, 0);
      var pct = 0; descontos.forEach(function(d){ if (marc.length >= d.itens && d.porcento > pct) pct = d.porcento; });
      var total = Math.round(soma * (100 - pct)) / 100, todos = comPreco.length === marc.length;
      totalE.innerHTML = !comPreco.length ? "<small>Valor combinado na conversa</small>"
        : (pct ? "<s>" + realP(soma) + "</s>" : "") + "<b>" + realP(total) + "</b>" +
          "<small>" + (pct ? pct + "% de desconto por levar " + marc.length + " serviços" : "") + (todos ? "" : (pct ? " · " : "") + "+ os serviços a combinar") + "</small>";
      var msg = "Olá, Marcos! Montei a minha consultoria pelo site:\n" +
        marc.map(function(sv){ return "• " + sv.nome + (typeof sv.preco === "number" ? " (" + realP(sv.preco) + ")" : " (a combinar)"); }).join("\n") +
        (comPreco.length ? "\nTotal: " + realP(total) + (pct ? " com " + pct + "% de desconto" : "") + (todos ? "" : " + os serviços a combinar") : "") +
        "\nQuero conversar sobre a minha empresa.";
      enviar.href = wa(msg); abrirFora(enviar); enviar.removeAttribute("aria-disabled");
    };
    fetch(rascunho ? "/assets/consultoria-exemplo.json" : "/assets/consultoria.json", { cache: "no-store" })
      .then(function(r){ return r.json(); })
      .then(function(d){
        servicos = (d.servicos || []).filter(function(sv){ return sv && sv.id && sv.nome && sv.ativo !== false; });
        descontos = (d.descontos || []).filter(function(x){ return x && x.itens > 1 && x.porcento > 0; });
        if (!servicos.length) return;
        if (descontos.length) {
          var lede = pac.querySelector("[data-pacotes-lede]");
          if (lede) lede.textContent += " " + descontos.map(function(x){ return x.itens + " ou mais têm " + x.porcento + "% de desconto"; }).join("; ") + ".";
        }
        caixa.innerHTML = servicos.map(function(sv){
          return '<label class="servico"><input type="checkbox" name="servico" value="' + escP(sv.id) + '"><span class="servico-marca" aria-hidden="true"></span>' +
            (sv.destaque ? '<span class="servico-selo">Mais pedido</span>' : "") +
            "<h3>" + escP(sv.nome) + "</h3>" + (sv.resumo ? "<p>" + escP(sv.resumo) + "</p>" : "") +
            (sv.inclui && sv.inclui.length ? "<ul>" + sv.inclui.map(function(x){ return "<li>" + escP(x) + "</li>"; }).join("") + "</ul>" : "") +
            (typeof sv.preco === "number" ? '<span class="preco">' + realP(sv.preco) + (sv.preco_obs ? "<small>" + escP(sv.preco_obs) + "</small>" : "") + "</span>"
              : '<span class="preco preco--consulta">' + escP(sv.preco_obs || "Valor combinado na conversa") + "</span>") + "</label>";
        }).join("");
        pac.hidden = false;
        document.querySelectorAll("[data-so-com-pacotes]").forEach(function(el){ el.hidden = false; });
        var q = /[?&]servico=([^&#]+)/.exec(location.search);
        if (q) { var i = caixa.querySelector('input[value="' + decodeURIComponent(q[1]).replace(/"/g, "") + '"]'); if (i) i.checked = true; }
        caixa.addEventListener("change", atualizar); atualizar();
      })
      .catch(function(){});
  }

  // Raio-X da fábrica: [data-raiox] com .rx-perg (uma por vez) e .rx-op[data-marca="id do serviço"]
  var rx = document.querySelector("[data-raiox]");
  if (rx) {
    var pergs = rx.querySelectorAll(".rx-perg"), fimRx = rx.querySelector(".rx-fim"), nRx = rx.querySelector("[data-rx-n]");
    var respostas = [], marcas = {};
    var mostrar = function(i){
      pergs.forEach(function(f, k){ f.hidden = k !== i; });
      fimRx.hidden = i < pergs.length;
      rx.querySelector(".rx-conta").hidden = i >= pergs.length;
      rx.style.setProperty("--p", i / pergs.length);
      if (nRx) nRx.textContent = Math.min(i + 1, pergs.length);
    };
    pergs.forEach(function(f, i){
      f.addEventListener("click", function(e){
        var b = e.target.closest(".rx-op"); if (!b) return;
        respostas[i] = f.querySelector("legend").textContent + " " + b.textContent;
        var m = b.getAttribute("data-marca"); if (m) marcas[m] = true;
        if (i + 1 < pergs.length) { mostrar(i + 1); var prox = pergs[i + 1].querySelector(".rx-op"); if (prox) prox.focus({ preventScroll: true }); return; }
        marcas.avaliacao = true;
        rx.querySelectorAll(".rx-res li").forEach(function(li){ li.hidden = !marcas[li.getAttribute("data-id")]; });
        var env = rx.querySelector("[data-rx-enviar]");
        env.href = wa("Olá, Marcos! Fiz o Raio-X da fábrica no site e quero agendar uma visita.\n" + respostas.map(function(r){ return "• " + r; }).join("\n")); abrirFora(env);
        mostrar(pergs.length);
      });
    });
    rx.querySelector("[data-rx-refazer]").addEventListener("click", function(){ respostas = []; marcas = {}; mostrar(0); });
    mostrar(0);
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
