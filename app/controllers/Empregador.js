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
	let sqlEmail = `SELECT email_do_responsavel FROM empregador WHERE email_do_responsavel = '${email}'`;
	db.query(sqlEmail, (err, resultado) => {

		if (err) throw err;

		if (resultado.length === 0) {

			// Salvar os dados do novo candidato na base de dados
			let sql = `INSERT INTO empregador
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
				res.redirect('/empregador');
			});
		} else {
			req.session.formCriarContaErro = `Já existe um Empregador registrado com esta conta de email: ${email}.`;
			res.redirect('empregadorcriarconta');
		}
	});
}

/*
* empresaLogin: Esta função é responsável por realizar o login para os
* utilizadores do tipo Empregador
*/
module.exports.empregadorLogin = (req, res) => {

	let { email, password } = req.body;

	let sql = `SELECT email_do_responsavel, password, nome FROM empregador WHERE email_do_responsavel = '${email}'`;
	db.query(sql, (err, resultado) => {
		
		console.log(resultado);

		// Verifica se a bd retornou alguma linha
		if(resultado.length > 0){
			console.log('Comparar password');
			if(resultado[0].password == password) {

				req.session.email = email;
				req.session.nome = resultado[0].nome_do_responsavel;
				res.redirect('/empregador');

			} else {
				//req.session.
				res.redirect('/empregadorlogin');
			}
		} else {
			res.redirect('/empregadorlogin');
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