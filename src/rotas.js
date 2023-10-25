const express = require(`express`);
const rotas = express();
const contasBancarias = require(`./controladores/contasbancarias`);
const { verificarSenhaUsuarioBody, verificarSenhaUsuarioURL } = require('./intermediarios/autenticacao')

rotas.post(`/contas`, contasBancarias.criarContaBancaria);
rotas.get(`/contas`, contasBancarias.listarContasBancarias);
rotas.put(`/contas/:numeroConta/usuario`, contasBancarias.atualizarContaDoUsuario);
rotas.delete(`/contas/:numeroConta`, contasBancarias.excluirConta);
rotas.post(`/transacoes/depositar`, contasBancarias.depositarEmContaBancaria);
rotas.post(`/transacoes/sacar`, verificarSenhaUsuarioBody, contasBancarias.sacarDeContaBancaria);
rotas.post(`/transacoes/transferir`, verificarSenhaUsuarioBody, contasBancarias.tranferirEntreContasBancarias);
rotas.get(`/contas/saldo`, verificarSenhaUsuarioURL, contasBancarias.consultarSaldoDeContaBancaria);
rotas.get(`/contas/extrato`, verificarSenhaUsuarioURL, contasBancarias.emitirExtratoDaContaBancaria);

module.exports = rotas;