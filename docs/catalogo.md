# Catálogo de produtos

Os produtos ficam em `assets/produtos.json`. A página `/produtos/` mostra todos, com filtro por categoria e busca; o Início mostra até 6 (primeiro os com `"destaque": true`). Sem nenhum produto, as duas páginas mostram "O catálogo está sendo montado" com o botão do WhatsApp.

Para ver o catálogo montado com produtos de exemplo, abra `/produtos/?rascunho` ou `/?rascunho` (usa `assets/produtos-exemplo.json`, que o público não vê).

## Um produto

```json
{
  "id": "nome-do-produto",
  "nome": "Nome do produto",
  "categoria": "Categoria",
  "tipo": "venda",
  "preco": 89.9,
  "preco_obs": "à vista no Pix",
  "resumo": "Uma linha que aparece no cartão.",
  "descricao": "Texto completo da ficha que abre ao tocar na foto.\nPode ter mais de um parágrafo.",
  "foto": "/assets/produtos/nome-do-produto.webp",
  "foto_alt": "O que aparece na foto",
  "link": "",
  "destaque": true,
  "ativo": true
}
```

| Campo | Para que serve |
|---|---|
| `id` | sem espaço nem acento; vira o endereço da ficha (`/produtos/#nome-do-produto`) para mandar a alguém |
| `tipo` | `"venda"` (o Marcos vende: botão "Pôr na lista", e a lista inteira vai numa mensagem pelo WhatsApp) ou `"indicacao"` (ele indica e a loja parceira vende) |
| `preco` | número, com ponto nos centavos (`89.9`). Sem `preco`, aparece "Preço no WhatsApp" (ou o texto de `preco_obs`) |
| `link` | só nas indicações: o botão vira "Ver na loja" e abre esse link (pode ser link de afiliado). Sem link, o botão pergunta pelo WhatsApp |
| `foto` | opcional. Quadrada ou 4:3, até 1200 px, em `assets/produtos/`. Sem foto, aparece a inicial do nome |
| `destaque` | aparece primeiro no Início |
| `textura` | amostra desenhada quando não há foto: `eco`, `papelao`, `eva`, `jacquard`, `espuma`, `napa`, `couro`, `camurca`, `forro`, `atoalhado`, `tecido`, `dublado`, `cola`, `palmilha`, `matriz`. Sem ela, vale a da categoria |
| `selo` | etiqueta no cartão (ex.: "Fabricação própria") |
| `opcoes` / `opcoes_nome` | botões que a pessoa marca na lista de pedido (ex.: espessuras, marcas); pode marcar mais de um |
| `pagina` | página própria do produto; aparece "Ver a página do produto" na ficha |
| `ativo` | `false` tira do site sem apagar |

O arquivo é lido sem cache: ao publicar, quem abrir o site já vê a mudança. Confira se o JSON está válido (vírgulas e aspas) antes de publicar.

## Página da consultoria

`/consultoria/` é a página que a pessoa vê antes de ir para o WhatsApp. Os blocos com `data-rascunho` (o que você recebe, formatos e valores, depoimentos e dúvidas) só aparecem com `/consultoria/?rascunho`. Para colocar um no ar: troque os textos entre `[colchetes]` pelos de verdade e apague o `data-rascunho` da `<section>`.
