// Dependências
const db = require('../models/database');

/*
*	Este módulo é responsável por renderizar o form para
*	adicionar uma nova experiência profissional
*/
module.exports.viewAddExpProfissional = (req, res) => {
	res.render('candidato/experiencia-profissional');
}

/*
*	Este módulo é responsável por processar o formulário de registo
*	de uma nova experiência profissional.
*/
module.exports.addExpProfissional = (req, res) => {

	let {
		nomeDaEmpresa,
		funcao,
		anoDeInicio,
		anoDeTermino
	} = req.body;

	let campos = [
		nomeDaEmpresa,
		funcao,
		anoDeInicio ? anoDeInicio : null,
		anoDeTermino ? anoDeTermino : null,
		req.session.ID
	];

	console.log(campos);

	let sql = `INSERT INTO ExperienciaProfissional
	(nome_da_empresa, funcao, ano_de_inicio, ano_de_termino, Candidato_idCandidato)
	VALUES (?, ?, ?, ?, ?)`;
	sql = db.format(sql, campos);

	db.query(sql, (err, info) => {
		if(err) throw err;

		res.redirect('/candidato/minha-conta');
	});
}