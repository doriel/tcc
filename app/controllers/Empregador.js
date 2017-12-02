// Dependências
const db = require('../models/database');
const EnviarMail = require('./EnviarMail');
const moment = require('moment');

/* EmpresaCriarConta: Esta função é responsável por criar uma nova conta de
* utilizador do tipo empresa
*/
module.exports.empregadorCriarConta = (req, res)=>{

	// Limpa os erros da sessão
	req.session.formCriarContaErro = "";
	req.session.formLogin = "";

	let {
		nome,
		nomeDoResponsavel,
		anoDeFundacao,
		areaDeActuacao,
		email,
		password
	} = req.body;

	// Verificar se já existe uma conta empresa com o email provido pelo utilizador
	let sqlEmail = `SELECT email_do_responsavel FROM Empregador WHERE email_do_responsavel = '${email}'`;
	db.query(sqlEmail, (err, resultado) => {

		if (err) throw err;

		if (resultado.length === 0) {

			// Salvar os dados do novo candidato na base de dados
			let sql = `INSERT INTO Empregador
			(nome, nome_do_responsavel, area_de_actuacao, ano_de_fundacao, email_do_responsavel, password)
			VALUES ('${nome}', '${nomeDoResponsavel}', '${areaDeActuacao}', '${anoDeFundacao}', '${email}', '${password}')`;

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

				//req.session.formLogin = "Conta Empregador criada com sucesso!";
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
* empresaLogin: Esta função é responsável por realizar o login para os
* utilizadores do tipo Empregador
*/
module.exports.empregadorLogin = (req, res) => {

	let { email, password } = req.body;

	let sql = `SELECT email_do_responsavel, password, nome FROM Empregador WHERE email_do_responsavel = '${email}'`;
	db.query(sql, (err, resultado) => {
		
		console.log(resultado);

		// Verifica se a bd retornou alguma linha
		if(resultado.length > 0){

			if(resultado[0].password == password) {

				req.session.email = email;
				req.session.nome = resultado[0].nome_do_responsavel;
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
*	Logout: Esta função é responsável por realizar o logout no sistema
*/

module.exports.logout = (req, res) => {
	req.session.destroy();
	res.redirect('/');
}