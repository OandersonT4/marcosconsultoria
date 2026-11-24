# marcosconsultoria.com.br

Site da MR Gestão e Assessoria (Marcos Rodrigues). HTML, CSS e JavaScript sem build.

- `index.html`: página inicial (desde 24/11/2026, pedido do Anderson): entrada com **3 portas** (Consultoria, Palestra, Produtos), a faixa de marcas e "Quem é Marcos". O catálogo em destaque e o resumo da consultoria saíram do Início (estão nas próprias páginas).
- Conteúdo (25/10/2026, texto do próprio Marcos): o site é de **materiais para calçados** (commodities e especialidades, com a placa ecológica Tubox de fabricação própria) e **consultoria para fábricas** (layout, modelagem/consumo/custo, treinamento, liderança, indicação, avaliação). Consultoria funciona assim: contato, visita, avaliação, orçamento e proposta, fechamento. Os produtos ainda sem foto e sem preço ("Preço no WhatsApp").
- Visual (25/10/2026): Início com leque de amostras de material (texturas em CSS, `.tx-*` no `mr.css`) e faixa de marcas; Consultoria com a um layout de fábrica só, o momento-assinatura **"da bagunça à produção"** (`assets/cena.js`: seção alta com quadro fixo, 10 setores da compra à expedição; a rolagem leva cada setor para o lugar, some o retalho, cada pessoa vai ao posto e os pares andam na linha), o **Raio-X da fábrica** (6 perguntas em `consultoria/index.html`, cada resposta pode marcar um serviço com `data-marca`; o resultado vai pelo WhatsApp pedindo a visita) e o "Como funciona" em linha do tempo.
- **Lista de pedido** (Início e Produtos): "Pôr na lista" em cada produto, gaveta com as opções do produto (espessura, marca, tipo) e campo de cor/quantidade, tudo numa mensagem só. Fica no navegador (`mr-lista`); a lista enviada vira o "último pedido" (`mr-lista-ultima`) e a barra oferece **Repetir**.
- Fotos: 12 produtos têm foto (`assets/produtos/*.webp`, 400 a 600 px). Camurça, sintéticos, palmilha, matrizes e forro jacquard são de uso livre; colas (Kisafix, Quimicolla, Una), papelão Induma, placa (Tubox), Napa, EVA liso e dublagem são fotos dos fabricantes e lojas do setor, autorizadas pelo Anderson em 25/10/2026 porque o Marcos revende essas marcas. Fontes em `creditos/` (link no rodapé de Produtos). Ao trocar por foto do Marcos, apague a linha do crédito. Espuma, EVA jacquard, atoalhado, tecido combate e plastisol seguem com a amostra desenhada (nada confiável na internet). A marca da cola se escreve Quimicolla.
- `placa-ecologica/`: página própria da placa que o Marcos fabrica (espessuras lado a lado para escolher, orçamento pelo WhatsApp, `Product` + caminho para o Google).
- `produtos/`: catálogo dos produtos que o Marcos vende e indica, lido de `assets/produtos.json` (como preencher: `docs/catalogo.md`). Filtro por categoria, busca, ficha de cada produto e pedido pelo WhatsApp com o produto já escrito.
- `consultoria/`: o que a pessoa recebe na consultoria, antes de ir para o WhatsApp, e o **montador de pacotes** (serviços de `assets/consultoria.json`, com desconto por combinação; como preencher: `docs/consultoria.md`). É a página onde fica o WhatsApp da consultoria. As partes que dependem do Marcos ficam prontas e escondidas; aparecem com `?rascunho` no endereço.
- `palestra/`: palestra **Liderança na prática** (24/11/2026), feita do conteúdo da antiga imersão, **sem data, local nem preço** (formato e duração combinados com o Marcos). Chamada pelo WhatsApp com a mensagem pronta.
- `imersao/`: a imersão de 28/11 foi cancelada; desde 24/11/2026 a página só redireciona para `/palestra/` (o arquivo fica, porque o envio nunca apaga da VPS).
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

## O que falta do Marcos

Blocos prontos e escondidos (só aparecem com `?rascunho` no endereço), esperando o texto real dele:
- **Depoimentos** (`consultoria/index.html`): 3 depoimentos reais, com nome, cargo e empresa, e a autorização de quem falou.
- **Perguntas frequentes** (`consultoria/index.html`): tamanho de empresa que atende, se atende fora de Nova Serrana, quanto tempo dura e como é o preço.
- **Fotos** dos produtos que ainda usam a amostra desenhada: EVA jacquard, espuma, forro atoalhado, tecido combate e dublados para plastisol (`assets/produtos.json`).
- **Palestra:** se ele quiser, duração, formato (presencial, para quantas pessoas) e fotos dele falando.

Ao receber, preencha, tire o `data-rascunho` do bloco e publique.

## Publicar

Botão **Actions › Publicar no site**, só a partir da `main`: rode `simular` e depois `publicar`. Envia para `/var/www/marquinhos` pelo usuário `deploy-marcos` (a chave só grava nessa pasta). Não apaga nada na VPS.
Segredos no ambiente `producao`: `MARCOS_SSH_KEY`, `VPS_HOST`, `VPS_KNOWN_HOSTS` e, se o SSH não for na porta 22, `VPS_PORT`.
