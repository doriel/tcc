// Dependências
const db = require('../models/database');
const EnviarMail = require('./EnviarMail');
const moment = require('moment');
const bcrypt = require('bcrypt-nodejs');

/*
*	Este módulo é responsável por remover um item do tipo formacao academica conforme o seu ID
*	@params {Number} ID da formacao academica.
*/
module.exports.Remover = (req, res) => {
	let sql = `DELETE FROM FormacaoAcademica WHERE idFormacaoAcademica = ?`;
	sql = db.format(sql, req.params.idFormacaoAcademica);

	db.query(sql, (err, info) => {
		if(err) throw err;

		res.redirect('/candidato/minha-conta');
	});
}

/*
*	Este módulo é responsável rendereizar a view do form das formações academicas
*/
module.exports.viewEditar = (req, res) => {

	let sql = `SELECT * FROM FormacaoAcademica WHERE idFormacaoAcademica = ?`;
	sql = db.format(sql, req.params.idFormacaoAcademica);

	db.query(sql, (err, Formacao) => {
		if(err) throw err;

		res.render('candidato/editar-formacao', {Formacao: Formacao[0]});
	});
}

/*
*	Este módulo é responsável por actualizar as formações academicas.
*/
module.exports.Editar = (req, res) => {

	let { nomeDaInstituicao,
		tituloObtido,
		anoDeInicio,
		anoDeTermino,
		idFormacaoAcademica
	} = req.body;

	// Campos
	let campos = [nomeDaInstituicao,
		tituloObtido,
		anoDeInicio,
		anoDeTermino,
		idFormacaoAcademica];

	// Query para actualizar os campos na BD
	let sql = `UPDATE FormacaoAcademica
	SET nome_da_instituicao = ?, titulo_obtido = ?, ano_de_inicio = ?, ano_de_termino = ?
	WHERE idFormacaoAcademica = ?`;
	// Preparar os campos da query
	sql = db.format(sql, campos);

	// Processar a query
	db.query(sql, (err, info) => {
		if (err) throw err;

		res.redirect('/candidato/minha-conta');
	});

}