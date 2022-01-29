const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')


app.use(morgan('dev')) //Monitora toda a execução e gera Logs
app.use(bodyParser.urlencoded({extended: false})) //Apenas dados Simples
app.use(bodyParser.json()) //Só vai aceitar json de entrada no body

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //CORS - Controla de onde a API pode ser acessada, * = todos
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    ) //O que minha API vai aceitar de cabeçalho

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }

    next()
})

app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)

//Quando não encontrar nenhuma rota, nenhuma das anteriores foi chamada
app.use((req, res, next) => {
    const erro = new Error('Não encontrado')
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app