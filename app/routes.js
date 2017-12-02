/*
* Todas as rotas da aplicação web estão definidas aqui
*/

// Caminho base dos controllers do portal
const CTRL = './controllers';

// Dependências: Importa controllers
const Candidato = require(`${CTRL}/Candidato.js`);
const Empregador = require(`${CTRL}/Empregador.js`);

// Outras dependências
const Validation = require('express-validation');

// Contém os campos dos formulários que serão validados
const fields = require('./fields');

// Exporta as rotas da API do portal
module.exports = (app) => {

	app.get('/', (req, res) => { res.render('index'); });

	// Candidato

	app.get('/criarconta/candidato', (req, res) => { res.render('criarconta/candidato'); });
	app.post('/criarconta/candidato', Validation(fields.criarConta), Candidato.criarConta);

	app.get('/criarconta/sucesso', (req, res) => {
		if (req.session.email) {
			res.render('criarconta/sucesso');
		} else {
			res.redirect('/');
		}
	});

	app.get('/confirmarconta', (req, res) => { res.render('criarconta/confirmarconta'); });
	app.post('/confirmarconta', Candidato.confirmarConta);
	app.get('/login/candidato', (req, res) => { res.render('login/candidato'); });
	app.post('/login/candidato', Validation(fields.login), Candidato.login);
	app.get('/logout', Candidato.logout);

	// Área privada Candidato
	app.get('/candidato', (req, res) => { 

		console.log(req.session.primeiroNome);

		res.render('candidato/candidato-home', {
			nome: req.session.primeiroNome
		});
	});

	// Empresas
	app.get('/criarconta/empregador', (req, res) => {
		let formCriarContaErro = req.session.formCriarContaErro;
		res.render('criarconta/empregador', {formCriarContaErro});
	});
	app.get('/empregador', (req, res) => {
		res.render('empregador/empregador-home', {
			nome: req.session.nome
		});
	});

	app.post('/criarconta/empregador', Validation(fields.empresaCriarConta), Empregador.empregadorCriarConta );
	app.get('/login/empregador', (req, res) => { 
		let formLogin = req.session.formLogin;
		res.render('login/empregador', {formLogin});
	});
	app.post('/login/empregador', Validation(fields.login), Empregador.empregadorLogin);
	app.get('/empregador', (req, res) => {
		let nome = req.session.nome;
		res.render('empregador/empregador-home', {nome: nome});
	});

	// 404
	app.get('*', (req, res) => { res.redirect('/'); });

}