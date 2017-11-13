/*
* Script principal do Projecto
*/

// Dependências do projecto
const express = require('express');
const router = require('./routes');

// Iniciar o express
const app = express();

// Definições gerais da aplicação
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/public`));

// Rotas
app.get('/', (req, res) => {
	res.send('Olá Mundo');
});

// Escutar o servidor de aplicação numa porta
const port = 3000;
app.listen(port, () => {
	console.log(`Servidor de Aplicação a correr na porta: ${port}`);
});