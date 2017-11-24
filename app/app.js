/*
* Script principal do Projecto
*/

// Dependências do projecto
const express = require('express');
const conexaoBD = require('./models/database.js');
const router = require('./routes');
const bodyParser = require('body-parser');
const multer = require('multer');

// Iniciar o express
const app = express();

// Iniciar a base de dados
conexaoBD.init();

// Definições gerais da aplicação
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Iniciar o script das rotas
router(app);

// Escutar o servidor de aplicação numa porta
const port = 3000;
app.listen(port, () => {
	console.log(`Servidor de Aplicação a correr na porta: ${port}`);
});