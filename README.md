# marcosconsultoria.com.br

Site da MR Gestão e Assessoria (Marcos Rodrigues). HTML, CSS e JavaScript sem build.

- `index.html`: página inicial.
- `imersao/`: página da Imersão Gestão e Liderança (28/11/2026).
- `assets/`: fotos.

Na VPS os arquivos ficam em `/var/www/marquinhos`. Repositório público: não coloque senhas, chaves ou dados de clientes aqui.

## Publicar

Botão **Actions › Publicar no site**, só a partir da `main`: rode `simular` e depois `publicar`. Envia para `/var/www/marquinhos` pelo usuário `deploy-marcos` (a chave só grava nessa pasta). Não apaga nada na VPS.
Segredos no ambiente `producao`: `MARCOS_SSH_KEY`, `VPS_HOST`, `VPS_KNOWN_HOSTS` e, se o SSH não for na porta 22, `VPS_PORT`.
