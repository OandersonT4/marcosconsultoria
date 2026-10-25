# marcosconsultoria.com.br

Site da MR Gestão e Assessoria (Marcos Rodrigues). HTML, CSS e JavaScript sem build.

- `index.html`: página inicial (desde 24/10/2026): o catálogo em primeiro lugar e a consultoria logo no topo, que leva para `/consultoria/`.
- Conteúdo (25/10/2026, texto do próprio Marcos): o site é de **materiais para calçados** (commodities e especialidades, com a placa ecológica Tubox de fabricação própria) e **consultoria para fábricas** (layout, modelagem/consumo/custo, treinamento, liderança, indicação, avaliação). Consultoria funciona assim: contato, visita, avaliação, orçamento e proposta, fechamento. Os produtos ainda sem foto e sem preço ("Preço no WhatsApp").
- Visual (25/10/2026): Início com leque de amostras de material (texturas em CSS, `.tx-*` no `mr.css`) e faixa de marcas; Consultoria com a um layout de fábrica só, o momento-assinatura **"da bagunça à produção"** (`assets/cena.js`: seção alta com quadro fixo, 10 setores da compra à expedição; a rolagem leva cada setor para o lugar, some o retalho, cada pessoa vai ao posto e os pares andam na linha), o **Raio-X da fábrica** (6 perguntas em `consultoria/index.html`, cada resposta pode marcar um serviço com `data-marca`; o resultado vai pelo WhatsApp pedindo a visita) e o "Como funciona" em linha do tempo.
- **Lista de pedido** (Início e Produtos): "Pôr na lista" em cada produto, gaveta com as opções do produto (espessura, marca, tipo) e campo de cor/quantidade, tudo numa mensagem só. Fica no navegador (`mr-lista`); a lista enviada vira o "último pedido" (`mr-lista-ultima`) e a barra oferece **Repetir**.
- Fotos: camurça, sintéticos, palmilha e matrizes têm foto de uso livre (`assets/produtos/*.webp`, 800 px); autores e licenças em `creditos/` (link no rodapé de Produtos). Ao trocar por foto do Marcos, apague a linha do crédito. Os outros produtos seguem com a amostra desenhada.
- `placa-ecologica/`: página própria da placa que o Marcos fabrica (espessuras lado a lado para escolher, orçamento pelo WhatsApp, `Product` + caminho para o Google).
- `produtos/`: catálogo dos produtos que o Marcos vende e indica, lido de `assets/produtos.json` (como preencher: `docs/catalogo.md`). Filtro por categoria, busca, ficha de cada produto e pedido pelo WhatsApp com o produto já escrito.
- `consultoria/`: o que a pessoa recebe na consultoria, antes de ir para o WhatsApp, e o **montador de pacotes** (serviços de `assets/consultoria.json`, com desconto por combinação; como preencher: `docs/consultoria.md`). É a página onde fica o WhatsApp da consultoria. As partes que dependem do Marcos ficam prontas e escondidas; aparecem com `?rascunho` no endereço.
- `imersao/`: página da Imersão Gestão e Liderança. **Oculta desde 24/10/2026** (a imersão não vai mais acontecer): continua no ar, mas sem link no site e com `noindex`. Preços, vagas e Eduzz abaixo ficam só como registro.
- Sem botão fixo de WhatsApp (desde 24/10/2026): o site resolve a dúvida e a pessoa chega no WhatsApp já sabendo o que quer. O WhatsApp fica no pedido de cada produto, na página da consultoria e no rodapé. Logo (marca MR + nome, `.logo`) no topo do Início.
- Ícone de "app" (adicionar à tela inicial): `site.webmanifest` (nome "Marcos MR"), `assets/icones/mr-180.png` (iPhone), `mr-192.png` e `mr-512.png` (Android) e `mr-32.png` (aba do navegador), feitos de `docs/icone.html`. Toda página tem o `manifest`, o `apple-touch-icon` e o nome embaixo do ícone.
- Atualizar o app: aviso de versão nova (`assets/atualizar.js`, igual ao do painel): com o site aberto como app da tela inicial, confere ao abrir e ao voltar para o app se a página mudou no servidor e mostra "Tem uma versão nova do site" com o botão Atualizar. No navegador comum não aparece; para ver, abra com `?versao=teste`. Vai em toda página, antes do `</body>`, com as cores no próprio `<script>` (`data-fundo`, `data-botao`...).
- Pré-visualização do link (WhatsApp, Instagram, Facebook): cada página tem a sua imagem 1200x630 (`assets/og.png`, `og-produtos.png`, `og-consultoria.png`, `og-imersao.png`, montadas em `docs/og/og.html?p=`) e o bloco completo de `og:*` e `twitter:*`.
- `assets/fontes/`: Gloock e Figtree servidas pelo próprio site (antes vinham do Google Fonts), licença em `OFL.txt`.
- `assets/mr.css` e `assets/mr.js`: design system e comportamento comum (ver `docs/design-system.md`).
- `assets/og*.png`: imagens que aparecem ao compartilhar o link (uma por página).
- Google (desde 25/10/2026): cada página tem a sua palavra no título (Consultoria: "Consultoria empresarial em Nova Serrana") e o endereço oficial (`canonical`). O Início tem o JSON-LD `ProfessionalService` (MR Gestão e Assessoria, Marcos como fundador, telefone, Nova Serrana, Instagram); a Consultoria, o `Service` e o caminho Início › Consultoria; Produtos, o caminho. `sitemap.xml` (atualize o `lastmod` ao mudar páginas; a imersão fica de fora por estar oculta), `robots.txt` e `404.html` (com `noindex`; para o Nginx usar, a configuração precisa de `error_page 404 /404.html;`). As perguntas frequentes da Consultoria só ganham o JSON-LD `FAQPage` quando o Marcos responder. O que fica fora do site: `docs/google.md`.
- `docs/`: documentação e modelo das imagens de compartilhamento. Não vai para a VPS.

Repositório público: não coloque senhas, chaves ou dados de clientes aqui.

## Preços da imersão

- Individual: **R$ 790**.
- Grupo, 2 ou mais pessoas: **R$ 740 por pessoa**.

Os valores estão escritos em `imersao/index.html` (topo, investimento, dúvidas e chamada final), nas mensagens do WhatsApp em `assets/mr.js` e nos produtos da Eduzz. Ao mudar o preço, mude nos três lugares.

## Vagas

São 80. O que já foi vendido fica em `assets/vagas.json`:

```json
{"total": 80, "vendidas": 0}
```

Conforme as vendas confirmadas na Eduzz, aumente `vendidas` e publique (simular, depois publicar). A página lê esse arquivo sem cache, então o número muda na hora para quem abrir. Com `vendidas` igual a `total`, a página mostra "Vagas esgotadas" e os botões passam a oferecer a lista de espera pelo WhatsApp.

## Eduzz

Crie dois produtos (ou duas ofertas do mesmo produto):

| Produto | Preço | Onde colar o link |
|---|---|---|
| Imersão Gestão e Liderança · Individual | R$ 790 | `CHECKOUT_INDIVIDUAL` em `assets/mr.js` |
| Imersão Gestão e Liderança · Grupo | R$ 740 por pessoa | `CHECKOUT_GRUPO` em `assets/mr.js` |

No produto de grupo, deixe a pessoa escolher a quantidade na hora de pagar, se a Eduzz permitir. Se não permitir, use ofertas por quantidade (2 vagas R$ 1.480, 3 vagas R$ 2.220…) e combine qual link vai no botão. Enquanto os links estiverem vazios, os botões abrem o WhatsApp com a quantidade e o total já escritos.

## Publicar

Botão **Actions › Publicar no site**, só a partir da `main`: rode `simular` e depois `publicar`. Envia para `/var/www/marquinhos` pelo usuário `deploy-marcos` (a chave só grava nessa pasta). Não apaga nada na VPS.
Segredos no ambiente `producao`: `MARCOS_SSH_KEY`, `VPS_HOST`, `VPS_KNOWN_HOSTS` e, se o SSH não for na porta 22, `VPS_PORT`.
