/*
* Todas as rotas da aplicação web estão definidas aqui
*/

// Dependências
const express = require('express');

// Iniciar o Router do express
let router = express.Router();

router.get('/login', (req, res) => {
	res.send('Login form');
});
