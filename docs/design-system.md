# Design system · MR Gestão e Assessoria

Tudo o que as páginas usam está em dois arquivos:

- `assets/mr.css`: tokens, base e componentes.
- `assets/mr.js`: configuração (WhatsApp, links da Eduzz, preços, data) e comportamento.

Cada página só acrescenta o próprio layout num `<style>` curto. Ao criar uma página nova, carregue as fontes, o `mr.css`, o `mr.js` e coloque `<script>document.documentElement.classList.add("js")</script>` no `<head>`. Esse script liga as animações de entrada; sem ele, tudo aparece parado e visível.

Ao mudar `mr.css` ou `mr.js`, troque o `?v=` nas páginas para o navegador não usar a versão guardada.

## Cores

| Token | Cor | Uso |
|---|---|---|
| `--pine` | #16302B | fundo principal escuro, texto forte em fundo claro |
| `--pine-2` / `--pine-3` / `--pine-4` | #1E3D37 / #10241F / #244840 | cards escuros, rodapé, hover |
| `--cream` / `--paper` / `--white` | #F3EEE4 / #FAF7F1 / #FFFFFF | fundos e cartões (base do site) |
| `--sage` / `--sage-lt` | #D6DDD2 / #E8EDE5 | verde-sálvia claro: seções e destaques |
| `--rose` / `--rose-lt` | #E2CFD3 / #F3E8EA | bordô pastel: seções e destaques |
| `--brass-dk` | #8A6B3D | dourado para texto pequeno em fundo claro (rótulos) |
| `--brass` / `--brass-lt` | #B08D57 / #D2B582 | destaque, botões, linhas, detalhes em fundo escuro |
| `--wine` | #5B2B36 | seção "incluso", palavras em destaque |
| `--slate` | #A9B9BE | apoio |
| `--ink` / `--ink-2` / `--muted` | #17201E / #2D3835 / #5B6662 | texto em fundo claro |
| `--on-dark` / `--on-dark-muted` | #DDE3DE / #B9C4BF | texto em fundo escuro |

O site é claro: creme, branco, sálvia clarinho e bordô pastel nos fundos; o verde escuro (`--pine`) fica no texto, nos botões e no rodapé; o bordô (`--wine`) nos destaques de título e números. Rótulos pequenos em dourado usam `--brass-dk`, que tem contraste suficiente em fundo claro.

## Tipografia

- **Gloock** (`--f-display`) em títulos, números grandes, datas e preços.
- **Figtree** (`--f-body`) no resto.
- Escala: `--t-xs` a `--t-xl` no texto; `--t-h3`, `--t-h2` e `--t-h1` nos títulos (já se ajustam ao tamanho da tela).

## Espaço, forma e movimento

- Espaços `--s-1` (4px) a `--s-8` (64px); `--s-9` é o respiro entre seções.
- Cantos `--r-sm`, `--r-md`, `--r-lg` e `--r-pill`.
- Sombras `--sh-1`, `--sh-2` e `--sh-dark`.
- Movimento `--ease` e `--dur`, sempre discreto: o site é de um curso de alto valor, nada pisca nem chama atenção sozinho. Quem pede menos movimento no aparelho vê tudo parado.

## Componentes

| Classe | O que é |
|---|---|
| `.wrap` | largura máxima com margem lateral (16px no celular) |
| `.section` + `--white` `--paper` `--cream` `--sage` `--rose` (e `--pine` `--wine` se precisar de uma faixa escura) | faixas da página |
| `.sec-head` | cabeçalho de seção: `.eyebrow` + `h2` + `.lede` |
| `.eyebrow` + `.rule` | rótulo em caixa alta com o traço dourado |
| `.grid.g-2` / `.g-3` | grades que viram uma coluna no celular |
| `.btn` + `--brass` `--pine` `--ghost` `--wa` `--sm` `--block` | botões (`.arrow` anima a seta) |
| `.chip` + `--dark` `--brass`, `.dot` | etiquetas |
| `.card` + `--top` `--dark` `--lift`, `.ico`, `.num` | cartões |
| `.top`, `.brand`, `.mark`, `.nav`, `.top-cta`, `.menu-btn`, `.menu` | barra de navegação fixa; no celular o menu abre pelo botão de três linhas |
| `.count` com `data-count` | contagem regressiva (`data-d` `data-h` `data-m`) |
| `.vagas`, `.vagas-txt` com `data-vagas`, `.vagas-bar` com `data-vagas-bar` | vagas restantes e barra |
| `.acc` | perguntas que abrem uma de cada vez |
| `.foot` | rodapé |
| `.reveal` (`style="--i:N"` para escalonar) | entrada suave ao rolar |

## Comportamento (`mr.js`)

- `data-wa="mensagem"`: o link abre o WhatsApp do Marcos com a mensagem pronta.
- `data-checkout="individual"` e `data-checkout="grupo"`: botões de inscrição pela Eduzz. Usam `CHECKOUT_INDIVIDUAL` e `CHECKOUT_GRUPO`; enquanto estiverem vazios, abrem o WhatsApp.
- `data-vagas` e `data-vagas-bar`: leem `/assets/vagas.json` e mostram "Restam N de 80 vagas". Com 0, a página mostra "Vagas esgotadas" e os botões viram "Entrar na lista de espera".
- `.menu-btn`: abre e fecha o menu do celular (fecha com Esc, ao tocar num link ou ao alargar a tela).
- `data-dias`: escreve "Faltam N dias".
- `.nav a[href^="#"]`: marca no menu a seção que está na tela.

## Imagens de compartilhamento

`assets/og.png` e `assets/og-imersao.png` (1200×630) são geradas a partir de `docs/og/og.html` (`?p=home` ou `?p=imersao`), com um print de 1200×630 no navegador. O site não usa fotos do Marcos.
