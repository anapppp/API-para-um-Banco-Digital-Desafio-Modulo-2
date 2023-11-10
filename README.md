# API para um Banco Digital

<img src="https://media.tenor.com/MsfP29DA8C8AAAAC/south-park-bank.gif" width="300"/>


Este é o exercício desenvolvido durante o Desafio Módulo 2 do curso de desenvolvimento de software com foco em backend da [Cubos Academy](https://cubos.academy/cursos/desenvolvimento-de-software). É um protótipo de uma API para banco digital. Nesse módulo ainda não haviamos aprendido a fazer verificação de senha criptografada, nem conexão com banco de dados, por isso, essa API não utiliza esses recursos e os dados ficam persistidos na memória. Mas deixo aqui para verificar minha evolução. 

## Estrutura do código fonte 

Na pasta principal você encontrará os arquivos `.gitignore`, `package.json`, `package-lock.json`, além do presente `README.md`. Os arquivos do código fonte se encontram na pasta [`src`](./src/):

- [`./src/index.js`](./src/index.js)
  - arquivo principal a ser executado com Node.JS 
  ```
  node ./src/index.js
  ```
- [`./src/bancodedados.js`](./src/bancodedados.js)
  - arquivo inicial com o banco de dados em formato json com a seguinte estrutura:
  
  ```javascript
  {
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],}
    ```

-[`./src/rotas.js`](./src/rotas.js)
  -  arquivo onde são estabelecidas as rotas, controladores e intermediários.

-[./src/controladores/contasbancarias.js](./src/controladores/contasbancarias.js)
  - arquivo onde estão todos os controladores de conta bancária.

-[`./src/intermediarios/autenticacao.js`](./src/intermediarios/autenticacao.js)
  - aquivo onde estão os intermediários para autenticação do usuário.


## Endpoints

Esta API tem as seguintes funcionalidades:

-   [Criar conta bancária](#criar-conta-bancária)
-   [Listar contas bancárias](#listar-contas-bancárias)
-   [Atualizar os dados do usuário da conta bancária](#atualizar-usuário)
-   [Excluir uma conta bancária](#excluir-conta)
-   [Depósitar em uma conta bancária](#depositar)
-   [Sacar de uma conta bancária](#sacar)
-   [Transferir valores entre contas bancárias](#tranferir)
-   [Consultar saldo da conta bancária](#saldo)
-   [Emitir extrato bancário](#extrato)


### Criar conta bancária

#### `POST` `/contas`

Cria uma conta bancária com um número único de identificação. A requisição é feita pelo body de acordo com o exemplo abaixo:

```javascript
{
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
    "senha": "12345"
}
```

### Listar contas bancárias

#### `GET` `/contas?senha_banco=Cubos123Bank`

Lista todas as contas bancárias existentes. Requer usuário e senha informados na URL.

### Atualizar usuário

#### `PUT` `/contas/:numeroConta/usuario`

Atualiza apenas os dados do usuário de uma conta bancária. Todos os dados devem ser inseridos no body da requisição, seguindo o modelo usado para [criar a conta](#criar-conta-bancária).

### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Exclui uma conta bancária existente. O numero da conta deve ser passado como parametro na URL.

### Depositar

#### `POST` `/transacoes/depositar`

Deposita um valor na conta, o qual é somado ao saldo. A requisição deve ser feita pelo body no seguinte formato:
  
```javascript
{
	"numero_conta": "1",
	"valor": 1900
}
```

O depósito fica registrado no array `depositos` inicializado no [banco de dados](#estrutura-do-código-fonte) da seguinte forma:

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

### Sacar

#### `POST` `/transacoes/sacar`

Realiza o saque de um valor em uma determinada conta bancária. A requisição deve ser feita pelo body no seguinte formato:

```javascript
{
	"numero_conta": "1",
	"valor": 1900,
        "senha": "123456"
}
```
O saque fica registrado no array `saques` inicializado no [banco de dados](#estrutura-do-código-fonte) da seguinte forma:

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

### Tranferir

#### `POST` `/transacoes/transferir`

Realiza a transferência de valores de uma conta bancária para outra. Ambas precisam estar registradas no banco de dados. A requisição deve ser feita pelo body no seguinte formato:

```javascript
// POST /transacoes/transferir
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "123456"
}
```

A transferência fica registrado no array `transferências` inicializado no [banco de dados](#estrutura-do-código-fonte) da seguinte forma:

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 10000
}
```

### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Retornar o saldo de uma conta bancária. O número da conta e a senha devem ser informados na URL. 

### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Lista as transações realizadas em uma conta. O número da conta e a senha devem ser informados na URL. O conteúdo retornado possui o seguinte formato:

```javascript
// HTTP Status 200 / 201 / 204
{
  "depositos": [
    {
      "data": "2021-08-18 20:46:03",
      "numero_conta": "1",
      "valor": 10000
    },
    {
      "data": "2021-08-18 20:46:06",
      "numero_conta": "1",
      "valor": 10000
    }
  ],
  "saques": [
    {
      "data": "2021-08-18 20:46:18",
      "numero_conta": "1",
      "valor": 1000
    }
  ],
  "transferenciasEnviadas": [
    {
      "data": "2021-08-18 20:47:10",
      "numero_conta_origem": "1",
      "numero_conta_destino": "2",
      "valor": 5000
    }
  ],
  "transferenciasRecebidas": [
    {
      "data": "2021-08-18 20:47:24",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    },
    {
      "data": "2021-08-18 20:47:26",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    }
  ]
}
```
