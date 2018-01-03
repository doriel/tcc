// Dependências
const db = require('../models/database');
const EnviarMail = require('./EnviarMail');
const moment = require('moment');

/*
*	homePage: Este módulo é reponsável pela renderização da home page
*/
module.exports.homePage = (req, res) => {

	let sql = `SELECT idVaga, cargo, data_de_publicacao, provincia, nome
	FROM Vaga, Empregador WHERE estado = 'Activo' AND Empregador_idEmpregador = idEmpregador
	ORDER BY data_de_publicacao DESC`;

	db.query(sql, (err, vagas) => {

		if(err) throw err;

		// console.log(vagas);

		if (vagas.length > 0){

			vagas = vagas.map((v) => {
				return {
					ID: v.idVaga,
					cargo: v.cargo,
					data_de_publicacao: moment(v.data_de_publicacao).format('DD/MM/YYYY'),
					nome: v.nome,
					provincia: v.provincia
				}
			});

			res.render('index', {Vagas: vagas}); 
		} else {
			res.render('index', {semVagas: 'Ainda não foi publicado nenhuma vaga no portal!'});
		}

	});

}

module.exports.procurarVagas = (req, res) => {

	let pesquisa = '%' + req.body.pesquisa + '%';
	let provincia = '%' + req.body.provincias + '%';

	// Consulta SQL para realizar a busca das vagas
	let sql = `SELECT idVaga, cargo, data_de_publicacao, provincia, nome
	FROM Vaga, Empregador WHERE cargo LIKE ?
	AND provincia LIKE ?
	AND estado = 'Activo'
	AND Empregador_idEmpregador = idEmpregador`;

	sql = db.format(sql, [pesquisa, provincia]);

	db.query(sql, (err, vagas) => {

		if(err) throw err;

		vagas = vagas.map((v) => {
			return {
				ID: v.idVaga,
				cargo: v.cargo,
				data_de_publicacao: moment(v.data_de_publicacao).format('DD/MM/YYYY'),
				nome: v.nome,
				provincia: v.provincia
			}
		});

		if(vagas.length > 0){
			res.render('procurar-vagas', {Vagas: vagas, termoDaPesquisa: req.body.pesquisa});
		} else {
			res.render('procurar-vagas', {
				semVagas: 'Nenhum resultado encontrado. Tente com outras palavras',
				termoDaPesquisa: req.body.pesquisa
			});
		}

	});

}