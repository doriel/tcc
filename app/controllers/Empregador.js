// Dependências
const db = require('../models/database');
const EnviarMail = require('./EnviarMail');
const moment = require('moment');

/*
*	empregadorCriarConta: Esta função é responsável por criar uma nova conta de
*	utilizador do tipo empresa
*/
module.exports.empregadorCriarConta = (req, res)=>{

	let {
		nome,
		nomeDoResponsavel,
		anoDeFundacao,
		areaDeActuacao,
		email,
		password
	} = req.body;

	let campoSelect = [email];
	// Verificar se já existe uma conta empresa com o email provido pelo utilizador
	let sqlEmail = `SELECT email_do_responsavel FROM Empregador WHERE email_do_responsavel = ?`;
	sqlEmail = db.format(sqlEmail, campoSelect);
	db.query(sqlEmail, (err, resultado) => {

		if (err) throw err;

		if (resultado.length === 0) {

			// Salvar os dados do novo candidato na base de dados
			let campos = [nome, nome_do_responsavel, area_de_actuacao,
			ano_de_fundacao, email_do_responsavel, password];
			let sql = `INSERT INTO Empregador
			(nome, nome_do_responsavel, area_de_actuacao, ano_de_fundacao, email_do_responsavel, password)
			VALUES (?, ?, ?, ?, ?, ?)`;
			// Formatar os campos e preparar devidamente a query
			sql = db.format(sql, campos);

			db.query(sql, (err, resultado) => {
				if (err) throw err;

				EnviarMail({
					email: email,
					titulo: 'Código de confirmação da conta Empregador - Portal Jobz',
					mensagem: `
						Parabéns ${nomeDoResponsavel}, a conta da ${nome} criada com sucesso!

						Use o código 00000 para efectuar a confirmação de e-mail. 

						Portal Jobz
					`
				});

				// Gravar os dados na sessão
				req.session.email = email;
				req.session.nome = nomeDoResponsavel;
				req.session.tipoUtilizador = 'empregador';
				res.redirect('/empregador');
			});
		} else {
			res.render('criarconta/empregador', {
				formError: 'Já existe uma conta Empregador registrado com este endereço de email: ${email}.'
			});
		}
	});
}

/*
*	empregadorLogin: Esta função é responsável por realizar o login para os
*	utilizadores do tipo Empregador
*/
module.exports.empregadorLogin = (req, res) => {

	let { email, password } = req.body;

	let sql = `SELECT email_do_responsavel, password, nome, idEmpregador FROM Empregador WHERE email_do_responsavel = ?`;
	let campos = [email, password];
	sql = db.format(sql, campos);
	db.query(sql, (err, resultado) => {
		
		console.log(resultado);

		// Verifica se a bd retornou alguma linha
		if(resultado.length > 0){

			if(resultado[0].password == password) {

				// Gravar os dados na sessão
				req.session.email = email;
				req.session.nome = resultado[0].nome_do_responsavel;
				req.session.ID = resultado[0].idEmpregador;
				req.session.tipoUtilizador = 'empregador';
				res.redirect('/empregador');

			} else {
				//req.session.
				res.render('login/empregador', {formError: 'A password não está correcta!'});
			}
		} else {
			res.render('login/empregador', {formError: 'Lamentamos, mas esta conta não existe! Crie uma conta para poder fazer login.'});
		}

		//res.send(resultado);
	});

}

/*
*	logout: Esta função é responsável por realizar o logout no sistema
*/

module.exports.logout = (req, res) => {
	req.session.destroy();
	res.redirect('/');
}

/*
*	publicarVaga: Esta função é responsável por públicar vagas
*/

module.exports.publicarVaga = (req, res) => {

	// Campos do formulário
	let { cargo, tipoDeContrato, anosDeExperiencia,
		salario, areaDeActuacao, provincias, descricao,
		habilidadesNecessarias, quantidadeDeVagas, dataLimite,
		idiomas, nivelAcademico
	} = req.body;

	// Transforma o array com os idiomas numa string normal
	let idiomasString = "";
	for(var i = 0; i < idiomas.length; i++){
		if(i == (idiomas.length - 1)){
			idiomasString += idiomas[i];
		} else {
			idiomasString += `${idiomas[i]}, `;
		}
	}

	let campos = [req.session.ID, cargo, tipoDeContrato, anosDeExperiencia,
		salario, areaDeActuacao, provincias, descricao,
		habilidadesNecessarias, quantidadeDeVagas, dataLimite,
		idiomasString, nivelAcademico];

	// Query
	let sql = `INSERT INTO Vaga (Empregador_idEmpregador, cargo, tipo_de_contrato,
	anos_de_experiencia, salario, area_de_actuacao, provincia, descricao, habilidades_necessarias,
	quantidade_de_vagas, data_limite, idiomas, nivel_academico, estado, data_de_publicacao)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Activo', CURDATE())`;

	// Preparar os campos para previnir injeção SQL
	sql = db.format(sql, campos);

	db.query(sql, (err, resultado) => {

		if(err) throw err;

		// Redireciona para a rota empregador
		res.redirect('/empregador');
	});

}

/*
*	minhaConta: Este módulo é reponsável por mostrar os dados da
*	conta empresa na página minha conta
*/

module.exports.minhaConta = (req, res) => {

	let campos = req.session.ID;
	let sql = `SELECT * FROM Empregador WHERE idEmpregador = ?`;
	// Preparar devidamente a query
	sql = db.format(sql, campos);
	// Executar a query
	db.query(sql, (err, resultado) => {

		if(err) throw err;

		res.render('empregador/minha-conta', {Empregador: resultado[0]});
	});

}

/*
*	minhaConta: Este módulo é reponsável por mostrar os dados da
*	conta empresa na página minha conta
*/
module.exports.actualizarInformacoesMinhaConta = (req, res) => {

	// Campos do formulário
	let {
		nome, anoDeFundacao,
		numeroDeFuncionarios, nomeDoResponsavel,
		emailDoResponsavel, email,
		contacto, biografia 
	} = req.body;

	let campos = [
		nome, anoDeFundacao,
		numeroDeFuncionarios, nomeDoResponsavel,
		emailDoResponsavel, email,
		contacto, biografia,
		req.session.ID
	];

	// Preparar a query
	let sql = `UPDATE Empregador SET nome = ?, ano_de_fundacao = ?, numero_de_funcionarios = ?,
	nome_do_responsavel = ?, email_do_responsavel = ?, email = ?, contacto = ?, biografia = ?
	WHERE idEmpregador = ?`;
	sql = db.format(sql, campos);

	db.query(sql, (err, resultado) => {
		if(err) throw err;

		res.redirect('/empregador');
	});
}

/*
*	editarMinhaConta: Este módulo é reponsável editar as informações da
*	conta empregador
*/

module.exports.editarMinhaConta = (req, res) => {

	

}

