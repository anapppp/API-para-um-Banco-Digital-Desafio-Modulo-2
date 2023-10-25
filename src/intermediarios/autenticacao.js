const { contas } = require(`../bancodedados`);

const verificarSenhaUsuarioBody = (req, res, next) => {
    const { numero_conta, senha } = req.body;
    //Verificando se os campos obrigatorios foram preenchidos
    if (numero_conta === undefined || senha === undefined) {
        return res.status(400).json({ mensagem: `Número da conta e senha são campo obrigatórios.` });
    }
    const conta = contas.find((a) => { return a.numero === Number(numero_conta); });
    // Verificando se a conta informada encontra-e no banco de dados
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta bancária não localizada." });
    };
    // Verificando a senha
    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    };
    next()
}

const verificarSenhaUsuarioURL = async (req, res, next) => {
    const { numero_conta, senha } = req.query;
    //Verificando se os campos obrigatorios foram preenchidos
    if (numero_conta === undefined || senha === undefined) {
        return res.status(400).json({ mensagem: `Número da conta e senha são campo obrigatórios.` });
    }
    const conta = contas.find((a) => { return a.numero === Number(numero_conta); });
    // Verificando se a conta informada encontra-e no banco de dados
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta bancária não localizada." });
    };
    // Verificando a senha
    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    };
    next()
}

module.exports = { verificarSenhaUsuarioBody, verificarSenhaUsuarioURL }