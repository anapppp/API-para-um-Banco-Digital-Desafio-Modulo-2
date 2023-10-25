let { banco, contas, saques, depositos, transferencias } = require(`../bancodedados`);
let { idxUnicoDaConta } = require(`../bancodedados`);

const buscaConta = (contas, numeroConta) => {
    const conta = contas.find((a) => { return a.numero === Number(numeroConta); });
    return conta;
}

const criarContaBancaria = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const camposObrigatorios = [{
        statusDoCampo: typeof (nome),
        nomeDoCampo: "Nome"
    },
    {
        statusDoCampo: typeof (cpf),
        nomeDoCampo: "CPF"
    },
    {
        statusDoCampo: typeof (data_nascimento),
        nomeDoCampo: "Data de nascimento"
    },
    {
        statusDoCampo: typeof (telefone),
        nomeDoCampo: "Telefone"
    },
    {
        statusDoCampo: typeof (email),
        nomeDoCampo: "E-mail"
    },
    {
        statusDoCampo: typeof (senha),
        nomeDoCampo: "Senha"
    }];

    //Verificando se os campos obrigatorios foram preenchidos
    for (i of camposObrigatorios) {
        if (i.statusDoCampo === "undefined") {
            return res.status(400).json({ mensagem: `${i.nomeDoCampo} é um campo obrigatório.` });
        }
    };

    //Verificando se os campos cpf e email sao unicos
    if (contas.find((conta) => { return conta.usuario.cpf == cpf }))
        return res.status(400).json({ mensagem: `O campo CPF deve ser único.` });
    if (contas.find((conta) => { return conta.usuario.email == email }))
        return res.status(400).json({ mensagem: `O campo E-mail deve ser único.` });

    //Cadastrando conta
    const contaBancaria = {
        numero: idxUnicoDaConta++,  //primeiro retorna depois incrementa
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };
    contas.push(contaBancaria);
    return res.status(201).send();
};

const listarContasBancarias = (req, res) => {
    const senha_banco = req.query.senha_banco;

    //Verificando se a senha foi informada
    if (typeof (senha_banco) === "undefined") {
        return res.status(400).json({ mensagem: `${i.nomeDoCampo} é um campo obrigatório.` });
    };

    //Verificando se a senha informada esta correta
    if (banco.senha === senha_banco) {
        return res.status(200).json(contas);
    } else {
        return res.status(401).json({ mensagem: `Senha do banco incorreta.` });
    };
};

const atualizarContaDoUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const numeroConta = req.params.numeroConta;

    const camposObrigatorios = [{
        statusDoCampo: typeof (nome),
        nomeDoCampo: "Nome"
    },
    {
        statusDoCampo: typeof (cpf),
        nomeDoCampo: "CPF"
    },
    {
        statusDoCampo: typeof (data_nascimento),
        nomeDoCampo: "Data de nascimento"
    },
    {
        statusDoCampo: typeof (telefone),
        nomeDoCampo: "Telefone"
    },
    {
        statusDoCampo: typeof (email),
        nomeDoCampo: "E-mail"
    },
    {
        statusDoCampo: typeof (senha),
        nomeDoCampo: "Senha"
    }];

    //Verificando se os campos obrigatorios foram preenchidos
    for (i of camposObrigatorios) {
        if (i.statusDoCampo === "undefined") {
            return res.status(400).json({ mensagem: `${i.nomeDoCampo} é um campo obrigatório.` });
        }
    };

    const conta = buscaConta(contas, numeroConta);
    // Verificando se a conta informada encontra-e no banco de dados
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta bancária não localizada." });
    };

    //Verificando se o cpf e o email fornecidos já foram cadastrados
    for (let conta of contas) {
        if (conta.usuario.cpf == cpf && Number(conta.numero) !== Number(numeroConta)) {
            return res.status(403).json({ mensagem: `CPF já cadastrado em outra conta.` });  //checar isso aqui
        }
        if (conta.usuario.email == email && Number(conta.numero) !== Number(numeroConta)) {
            return res.status(403).json({ mensagem: `E-mail já cadastrado em outra conta.` });  //checar isso aqui
        }
    };

    // Atualizando os dados do usuário de uma conta bancária
    conta.usuario.nome = nome;
    conta.usuario.cpf = cpf;
    conta.usuario.data_nascimento = data_nascimento;
    conta.usuario.telefone = telefone;
    conta.usuario.email = email;
    conta.usuario.senha = senha;
    return res.status(204).send();
};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = buscaConta(contas, numeroConta);
    // Verificando se a conta informada encontra-e no banco de dados
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta bancária não localizada." });
    };

    // Verificando se o saldo da conta esta zerado
    if (conta.saldo !== 0) {
        return res.status(404).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    };

    contas = contas.filter((a) => { return a.numero !== Number(numeroConta); });
    return res.status(204).send();
};

const depositarEmContaBancaria = (req, res) => {
    const { numero_conta, valor } = req.body;
    const camposObrigatorios = [{
        statusDoCampo: typeof (numero_conta),
        nomeDoCampo: "Número da conta"
    },
    {
        statusDoCampo: typeof (valor),
        nomeDoCampo: "Valor"
    }];

    //Verificando se os campos obrigatorios foram preenchidos
    for (i of camposObrigatorios) {
        if (i.statusDoCampo === "undefined") {
            return res.status(400).json({ mensagem: `${i.nomeDoCampo} é um campo obrigatório.` });
        }
    };

    const conta = buscaConta(contas, numero_conta);

    // Verificando se a conta informada encontra-e no banco de dados
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta bancária não localizada." });
    };

    // Verificando se o valor do deposito não é negativo ou zero
    if (valor <= 0) {
        return res.status(400).json({ mensagem: "Valor inválido. O valor do depósito deve ser maior do que zero." });
    };

    // Somar o valor de depósito ao saldo da conta encontrada
    conta.saldo += valor;
    let momentoDaTransacao = new Date();
    depositos.push({ momentoDaTransacao, numero_conta, valor });
    return res.status(204).send();
};

const sacarDeContaBancaria = (req, res) => {
    const { numero_conta, valor } = req.body;
    const camposObrigatorios = [{
        statusDoCampo: typeof (numero_conta),
        nomeDoCampo: "Número da conta"
    },
    {
        statusDoCampo: typeof (valor),
        nomeDoCampo: "Valor"
    }
    ];

    //Verificando se os campos obrigatorios foram preenchidos
    for (i of camposObrigatorios) {
        if (i.statusDoCampo === "undefined") {
            return res.status(400).json({ mensagem: `${i.nomeDoCampo} é um campo obrigatório.` });
        }
    };

    const conta = buscaConta(contas, numero_conta);

    // Verificando se o valor do saque não é negativo ou zero
    if (valor <= 0) {
        return res.status(400).json({ mensagem: "Valor inválido. O valor do depósito deve ser maior do que zero." });
    };
    // Verificando se o valor do saque nao e maior do que o saldo
    if (valor > conta.saldo) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" });
    };

    // Subtrair o valor do saldo da conta encontrada
    conta.saldo -= valor;
    let momentoDaTransacao = new Date();
    saques.push({ momentoDaTransacao, numero_conta, valor });
    return res.status(204).send();
};

const tranferirEntreContasBancarias = (req, res) => {
    const { numero_conta, numero_conta_destino, valor } = req.body;
    numero_conta_origem = numero_conta;
    const camposObrigatorios = [{
        statusDoCampo: typeof (numero_conta_origem),
        nomeDoCampo: "Número da conta de origem"
    },
    {
        statusDoCampo: typeof (numero_conta_destino),
        nomeDoCampo: "Número da conta de destino"
    },
    {
        statusDoCampo: typeof (valor),
        nomeDoCampo: "Valor"
    }];

    //Verificando se os campos obrigatorios foram preenchidos
    for (i of camposObrigatorios) {
        if (i.statusDoCampo === "undefined") {
            return res.status(400).json({ mensagem: `${i.nomeDoCampo} é um campo obrigatório.` });
        }
    };

    const contaOrigem = buscaConta(contas, numero_conta_origem);
    const contaDestino = buscaConta(contas, numero_conta_destino);;

    // Verificando se as contas informadas encontram-e no banco de dados
    if (!contaOrigem) {
        return res.status(404).json({ mensagem: "Conta bancária de origem não localizada." });
    };
    if (!contaDestino) {
        return res.status(404).json({ mensagem: "Conta bancária de destino não localizada." });
    };

    // Verificando se o valor da transferencia não é negativo ou zero
    if (valor <= 0) {
        return res.status(400).json({ mensagem: "Valor inválido. O valor do depósito deve ser maior do que zero." });
    };
    // Verificando se o valor da transferencia nao e maior do que o saldo
    if (valor > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" });
    };

    // Transferindo valores
    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;
    let momentoDaTransacao = new Date();
    transferencias.push({ momentoDaTransacao, numero_conta_origem, numero_conta_destino, valor });
    return res.status(204).send();
};

const consultarSaldoDeContaBancaria = (req, res) => {
    const { numero_conta } = req.query;
    const camposObrigatorios = [{
        statusDoCampo: typeof (numero_conta),
        nomeDoCampo: "Número da conta"
    }];

    //Verificando se os campos obrigatorios foram preenchidos
    for (i of camposObrigatorios) {
        if (i.statusDoCampo === "undefined") {
            return res.status(400).json({ mensagem: `${i.nomeDoCampo} é um campo obrigatório.` });
        }
    };

    const conta = buscaConta(contas, numero_conta);
    // Verificando se a conta informada encontra-e no banco de dados
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta bancária não localizada." });
    };

    //Emitindo saldo
    return res.status(200).json({ saldo: conta.saldo });
};

const emitirExtratoDaContaBancaria = (req, res) => {
    const { numero_conta } = req.query;
    const camposObrigatorios = [{
        statusDoCampo: typeof (numero_conta),
        nomeDoCampo: "Número da conta"
    }];

    //Verificando se os campos obrigatorios foram preenchidos
    for (i of camposObrigatorios) {
        if (i.statusDoCampo === "undefined") {
            return res.status(400).json({ mensagem: `${i.nomeDoCampo} é um campo obrigatório.` });
        }
    };

    const conta = buscaConta(contas, numero_conta);
    // Verificando se a conta informada encontra-e no banco de dados
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta bancária não localizada." });
    };

    // Emitindo extrato
    const depositosNaConta = depositos.filter(a => { return Number(a.numero_conta) === Number(numero_conta) });
    const saquesDaConta = saques.filter(a => { return Number(a.numero_conta) === Number(numero_conta) });
    const transferenciasEnviadas = transferencias.filter(a => { return Number(a.numero_conta_origem) === Number(numero_conta) });
    const transferenciasRecebidas = transferencias.filter(a => { return Number(a.numero_conta_destino) === Number(numero_conta) });

    return res.status(200).json({
        depositos: depositosNaConta,
        saques: saquesDaConta,
        transferenciasEnviadas,
        transferenciasRecebidas
    });
};


module.exports = {
    criarContaBancaria,
    listarContasBancarias,
    atualizarContaDoUsuario,
    excluirConta,
    depositarEmContaBancaria,
    sacarDeContaBancaria,
    tranferirEntreContasBancarias,
    consultarSaldoDeContaBancaria,
    emitirExtratoDaContaBancaria
};