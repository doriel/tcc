// Dependências
const db = require('../models/database');
const EnviarMail = require('./EnviarMail');
const moment = require('moment');

// Alterar idioma do módulo Momentjs
moment.locale('pt');

/*
*	ListarVagas: Esta função é responsável por listar as vagas com base num id
*/
module.exports.listarVagas = (req, res) => {

	let ID = req.session.ID;

	let sql = `SELECT * FROM Vaga WHERE Empregador_idEmpregador = ?`;
		sql = db.format(sql, ID);
	db.query(sql, (err, resultado) => {
		if(resultado.length > 0){

			// Gerar um novo array com os dados da vaga
			var Vagas = resultado.map((vaga) => {
				/* Dias restantes a partir da data limite e da 
					data de publicacao
				 */ 
				let dataDePublicacao = moment(vaga.data_de_publicacao);
				let dataLimite = moment(vaga.data_limite);
				let diasRestantes = dataLimite.from(dataDePublicacao, true);

				return {
					ID: vaga.idVaga,
					cargo: vaga.cargo,
					dataDePublicacao: moment(vaga.data_de_publicacao).format('DD-MM-YYYY'),
					estado: vaga.estado,
					diasRestantes: diasRestantes
				}
			});

			res.render('empregador/empregador-home', {Vagas});

		} else {
			res.render('empregador/empregador-home', {Vagas});
		}
	});

}

module.exports.removerVaga = (req, res) => {

	// Id da vaga
	let campos = [req.params.id]

	// Query para remover a vaga na tabela
	let sql = `DELETE FROM Vaga WHERE idVaga = ?`;
	// Prepara devidamente a query
	sql = db.format(sql, campos);
	// Executa a query
	db.query(sql, (err, resultado) => {
		if(err) throw err;

		res.redirect('/empregador');
	});

}