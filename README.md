# marcosconsultoria.com.br

Site da MR Gestão e Assessoria (Marcos Rodrigues). HTML, CSS e JavaScript sem build.

- `index.html`: página inicial (desde 24/10/2026): o catálogo em primeiro lugar e a consultoria logo no topo, que leva para `/consultoria/`.
- `produtos/`: catálogo dos produtos que o Marcos vende e indica, lido de `assets/produtos.json` (como preencher: `docs/catalogo.md`). Filtro por categoria, busca, ficha de cada produto e pedido pelo WhatsApp com o produto já escrito.
- `consultoria/`: o que a pessoa recebe na consultoria, antes de ir para o WhatsApp. As partes que dependem do Marcos ficam prontas e escondidas; aparecem com `?rascunho` no endereço.
- `imersao/`: página da Imersão Gestão e Liderança. **Oculta desde 24/10/2026** (a imersão não vai mais acontecer): continua no ar, mas sem link no site e com `noindex`. Preços, vagas e Eduzz abaixo ficam só como registro.
- `assets/fontes/`: Gloock e Figtree servidas pelo próprio site (antes vinham do Google Fonts), licença em `OFL.txt`.
- `assets/mr.css` e `assets/mr.js`: design system e comportamento comum (ver `docs/design-system.md`).
- `assets/og*.png`: imagens que aparecem ao compartilhar o link.
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
