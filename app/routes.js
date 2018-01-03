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
const FormAcademica = require(`${CTRL}/FormacaoAcademica`);
const ExpProfissional = require(`${CTRL}/ExperienciaProfissional`);
const path = require('path');

// Outras dependências
const Validation = require('express-validation');

// Contém os campos dos formulários que serão validados
const fields = require('./fields');

// Multer é o módulo que cuida dos uploads
const multer = require('multer');
let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `${__dirname}/public/uploads`);
	},
	filename: (req, file, cb) => {
		let ext = path.extname(file.originalname);
		cb(null, file.fieldname + '-' + Date.now() + ext);
	}
});

let fileFilter = (req, file, cb) => {
	let ext = path.extname(file.originalname);
		if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
			cb(null, false);
		} else {
			cb(null, true);
		}
};

const uploads = multer({
	storage,
	fileFilter
});

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
	app.get('/login/candidato', (req, res) => {
		if(req.session.ID){
			res.redirect('/candidato');
		} else {
			res.render('login/candidato');
		}
	});
	app.post('/login/candidato', Validation(fields.login), Candidato.login);
	app.get('/logout', Candidato.logout);

	// Área privada Candidato
	app.get('/candidato', Candidato.viewHomeAreaCandidato);
	app.post('/candidato/enviar-candidatura', Candidato.enviarCandidatura);
	app.get('/candidato/cancelar-candidatura/:idCandidatura/:idVaga', Candidato.cancelarCandidatura);
	app.get('/candidato/minha-conta', Candidato.viewMinhaConta);
	app.post('/candidato/minha-conta', Candidato.actualizarMinhaConta);
	app.get('/candidato/minha-conta/formacoes-academicas', Candidato.viewFormacoesAcademicas);
	app.post('/candidato/minha-conta/formacoes-academicas', Candidato.formacoesAcademicas);
	app.get('/candidato/minha-conta/remover-formacoes-academicas/:idFormacaoAcademica', FormAcademica.Remover);
	app.get('/candidato/minha-conta/editar-formacao/:idFormacaoAcademica', FormAcademica.viewEditar);
	app.post('/candidato/minha-conta/editar-formacao', FormAcademica.Editar);
	app.get('/candidato/minha-conta/alterar-password', Candidato.viewAlterarPassword);
	app.post('/candidato/minha-conta/alterar-password', Candidato.alterarPassword);
	app.get('/candidato/minha-conta/carregar-cv', Candidato.viewCarregarCV);
	app.post('/candidato/minha-conta/carregar-cv', uploads.single('cv'), Candidato.carregarCV);
	app.get('/candidato/minha-conta/carregar-fotografia', Candidato.viewCarregarFotografia);
	app.post('/candidato/minha-conta/carregar-fotografia', uploads.single('foto'), Candidato.carregarFotografia);
	app.get('/candidato/minha-conta/experiencia-profissional', ExpProfissional.viewAddExpProfissional);
	app.post('/candidato/minha-conta/experiencia-profissional', ExpProfissional.addExpProfissional);
	app.get('/candidato/minha-conta/editar-experiencia/:idExperiencia', ExpProfissional.viewEditar);
	app.post('/candidato/minha-conta/editar-experiencia', ExpProfissional.Editar);
	app.get('/candidato/minha-conta/remover-experiencia/:idExperiencia', ExpProfissional.Remover);

	// Empregador
	app.get('/criarconta/empregador', (req, res) => {
		res.render('criarconta/empregador');
	});
	app.get('/empregador', Vagas.listarVagas);

	app.post('/criarconta/empregador', Validation(fields.empresaCriarConta), Empregador.empregadorCriarConta );
	app.get('/login/empregador', (req, res) => { 
		if(req.session.ID){
			res.redirect('/empregador');
		} else {
			res.render('login/empregador');
		}
	});
	app.post('/login/empregador', Validation(fields.login), Empregador.empregadorLogin);
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