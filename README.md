# marcosconsultoria.com.br

Site da MR Gestão e Assessoria (Marcos Rodrigues). HTML, CSS e JavaScript sem build.

- `index.html`: página inicial.
- `imersao/`: página da Imersão Gestão e Liderança (28/11/2026).
- `assets/mr.css` e `assets/mr.js`: design system e comportamento comum (ver `docs/design-system.md`).
- `assets/og*.png`: imagens que aparecem ao compartilhar o link.
- `docs/`: documentação e modelo das imagens de compartilhamento. Não vai para a VPS.

Repositório público: não coloque senhas, chaves ou dados de clientes aqui.

## Preços da imersão

- Individual: **R$ 790**.
- Grupo, 2 ou mais pessoas: **R$ 740 por pessoa**.

Os valores ficam em `assets/mr.js` (`PRECO_INDIVIDUAL` e `PRECO_GRUPO`) e também escritos nos textos de `imersao/index.html` (topo, investimento, dúvidas e chamada final). Ao mudar o preço, mude nos dois lugares.

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
