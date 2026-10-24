# Pacotes da consultoria

Os serviços ficam em `assets/consultoria.json`. Na página `/consultoria/`, a seção "Monte a sua consultoria" mostra cada serviço como um cartão para marcar; ao lado, "Sua escolha" soma os valores, aplica o desconto por combinação e o botão "Enviar para o Marcos" abre o WhatsApp com tudo escrito (serviços, valores e total). Assim a pessoa chega na conversa já sabendo o que quer.

Sem nenhum serviço no arquivo, a seção e o botão "Montar minha consultoria" do topo ficam escondidos. Para ver montado com serviços de exemplo, abra `/consultoria/?rascunho` (usa `assets/consultoria-exemplo.json`, que o público não vê).

## Um serviço

```json
{
  "id": "diagnostico",
  "nome": "Diagnóstico da empresa",
  "resumo": "Uma linha sobre o serviço.",
  "inclui": ["O que inclui 1", "O que inclui 2"],
  "preco": 1500,
  "preco_obs": "por mês",
  "destaque": true,
  "ativo": true
}
```

| Campo | Para que serve |
|---|---|
| `id` | sem espaço nem acento. `/consultoria/?servico=diagnostico#pacotes` já abre com ele marcado (bom para mandar a alguém ou usar num post) |
| `preco` | número, com ponto nos centavos. Sem `preco`, aparece "Valor combinado na conversa" (ou o texto de `preco_obs`) e o serviço entra na mensagem como "a combinar" |
| `inclui` | lista do que vem no serviço |
| `destaque` | selo "Mais pedido" |
| `ativo` | `false` tira do site sem apagar |

## Desconto por combinação (opcional)

```json
"descontos": [{"itens": 2, "porcento": 10}, {"itens": 3, "porcento": 15}]
```

Vale o maior desconto alcançado pela quantidade de serviços marcados, e ele é aplicado só sobre os que têm preço. Sem `descontos`, não há desconto.

O arquivo é lido sem cache: ao publicar, quem abrir a página já vê a mudança. Confira se o JSON está válido (vírgulas e aspas) antes de publicar.
