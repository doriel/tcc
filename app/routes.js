/*
* Todas as rotas da aplicação web estão definidas aqui
*/

// Caminho base dos controllers do portal
const CTRL = './controllers';

// Dependências: Importa controllers
const Candidato = require(`${CTRL}/Candidato.js`);
const Empregador = require(`${CTRL}/Empregador.js`);
const Vagas = require(`${CTRL}/Vagas.js`);
const Paginas = require(`${CTRL}/Paginas.js`);

// Outras dependências
const Validation = require('express-validation');

// Contém os campos dos formulários que serão validados
const fields = require('./fields');

// Exporta as rotas da API do portal
module.exports = (app) => {

	app.get('/', Paginas.homePage);

	app.post('/procurar-vagas', Paginas.procurarVagas)

	// Candidato

	app.get('/criarconta/candidato', (req, res) => { res.render('criarconta/candidato'); });
	app.post('/criarconta/candidato', Validation(fields.criarConta), Candidato.criarConta);

	app.get('/criarconta/sucesso', (req, res) => {
		if (req.session.email) {
			res.render('criarconta/sucesso', {
				tipoUtilizador: req.session.tipoUtilizador
			});
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
	app.get('/candidato', Candidato.viewHomeAreaCandidato);
	app.post('/candidato/enviar-candidatura', Candidato.enviarCandidatura);
	app.get('/candidato/minha-conta', Candidato.viewMinhaConta);

	// Empregador
	app.get('/criarconta/empregador', (req, res) => {
		res.render('criarconta/empregador');
	});
	app.get('/empregador', Vagas.listarVagas);

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
	app.get('/empregador/minha-conta', Empregador.minhaConta);
	app.post('/empregador/minha-conta', Empregador.actualizarMinhaConta);
	app.get('/empregador/minha-conta/alterar-password', Empregador.viewAlterarPassword)
	app.post('/empregador/minha-conta/alterar-password', Empregador.alterarPassword)
	app.get('/empregador/pesquisar-candidatos', Candidato.listarCandidatos);

	// Vagas
	app.get('/vaga/:idVaga', Vagas.obterVaga)
	app.get('/empregador/publicar-vaga', (req, res) => { res.render('empregador/publicar-vaga'); })
	app.post('/empregador/publicar-vaga', Empregador.publicarVaga);
	app.get('/empregador/remover-vaga/:id', Vagas.removerVaga);
	app.get('/empregador/editar-vaga/:id', Vagas.viewEditarVaga);
	app.post('/empregador/editar-vaga/', Vagas.editarVaga);

	// 404
	app.get('*', (req, res) => { res.redirect('/'); });

}