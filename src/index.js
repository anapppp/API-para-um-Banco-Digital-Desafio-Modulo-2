/* Desafio 2 - API para um Banco Digital.

Projeto piloto de uma API REST para banco digita que permita:

1. Criar conta bancária
2. Listar contas bancárias
3. Atualizar os dados do usuário da conta bancária
4. Excluir uma conta bancária
5. Depósitar em uma conta bancária
6. Sacar de uma conta bancária
7. Transferir valores entre contas bancárias
8. Consultar saldo da conta bancária
9. Emitir extrato bancário
*/

const express = require(`express`);
const rotas = require('./rotas.js');
const app = express();

app.use(express.json());
app.use(rotas);
app.listen(3000);
