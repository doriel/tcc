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

/*
*	Este módulo é responsável por listar as experiências profissionais
*	do candidato através do seu ID.
*	@params {Number} ID
*/
module.exports.listarExperiencias = (ID) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM ExperienciaProfissional
		WHERE Candidato_idCandidato = ?`;
		sql = db.format(sql, ID);

		db.query(sql, (err, Experiencias) => {
			if(err) { reject(err); }

			resolve(Experiencias);
		});
	});
}