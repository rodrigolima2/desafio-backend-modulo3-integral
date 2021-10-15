const express = require('express');

const { checkLogin } = require('./middlewares/checkLogin');
const { cadastrarUsuario, loginUsuario, detalharUsuario, atualizarUsuario } = require('./controllers/usuarios');
const { listarProdutos, detalharProduto, cadastrarProduto, atualizarProduto, deletarProduto } = require('./controllers/produtos');

const routes = express();

//usuarios - cadastro e login
routes.post('/usuario', cadastrarUsuario);
routes.post('/login', loginUsuario);

//checar autorizacao
routes.use(checkLogin);

//usuarios
routes.get('/usuario', detalharUsuario);
routes.put('/usuario', atualizarUsuario);

//produtos
routes.get('/produtos', listarProdutos);
routes.get('/produtos/:id', detalharProduto);
routes.post('/produtos', cadastrarProduto);
routes.put('/produtos/:id', atualizarProduto);
routes.delete('/produtos/:id', deletarProduto);

module.exports = routes;