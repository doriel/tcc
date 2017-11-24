/*
* Todas as rotas da aplicação web estão definidas aqui
*/

// Caminho base dos controllers do portal
const CTRL = './controllers';

// Dependências: Importa controllers
const Candidato = require(`${CTRL}/Candidato.js`);

// Outras dependências
const Validation = require('express-validation');

// Contém os campos dos formulários que serão validados
const fields = require('./fields');

// Exporta as rotas da API do portal
module.exports = (app) => {

	app.get('/criarconta', (req, res) => { res.render('criarconta'); });
	app.post('/criarconta', Validation(fields.criarConta), Candidato.criarConta);
	app.get('/confirmarconta', (req, res) => { res.render('confirmarconta'); });
	app.post('/confirmarconta', Candidato.confirmarConta);

	app.get('/login', (req, res) => {
		res.render('login');
	});

}