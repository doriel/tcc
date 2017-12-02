// Dependências
const db = require('../models/database');
const EnviarMail = require('./EnviarMail');
const moment = require('moment');

/*
*	CriaConta: É responsável por criar uma nova conta de
*	utilizador profissional no Portal
*/
module.exports.criarConta = (req, res) => {

	// Obter dados do front-end
	let { primeiroNome,
		ultimoNome,
		email,
		password,
		dataDeNascimento,
		genero,
		nacionalidade,
		naturalidade,
		provinciaOndeReside,
		morada,
		telefone,
		telefoneAlternativo
	} = req.body;

	console.log(dataDeNascimento);
	dataDeNascimento = moment(dataDeNascimento).format('YYYY-MM-DD');
	console.log(dataDeNascimento);

	// Gerar código de confirmação aleatório segundo o MDN 
	let codConfirmacao = Math.floor(Math.random() * (999999 - 0) + 0);

	// Consultar se já existe um utilizador na base de dados
	sqlEmail = `SELECT email FROM Candidato WHERE email = '${email}'`;
	db.query(sqlEmail, (err, resultado) => {

		if(resultado.length === 0){

			// Salvar os dados do novo Candidato na base de dados
			let sql = `INSERT INTO Candidato
				(primeiro_nome, ultimo_nome, email, password, codigo_de_confirmacao, data_de_registo,
				data_de_nascimento, genero, nacionalidade, naturalidade, provincia_onde_reside, morada,
				telefone, telefone_alternativo)
				VALUES ('${primeiroNome}', '${ultimoNome}', '${email}', '${password}',
				'${codConfirmacao}', CURDATE(), '${dataDeNascimento}', '${genero}', '${nacionalidade}',
				'${naturalidade}', '${provinciaOndeReside}', '${morada}', '${telefone}', '${telefoneAlternativo}')`;

			// Inser os dados do utilizador na base de dados
			db.query(sql, (err, resultado) => {
				if(err) throw err;

				console.log(email);

				// Enviar o código de confirmação no mail do candidato
				EnviarMail({
					email: email,
					titulo: 'Código de confirmação - Portal Jobz',
					mensagem: `
						Parabéns ${primeiroNome}, o seu registro foi efectuado com sucesso!

						Use o código ${codConfirmacao} para efectuar a confirmação de e-mail. 

						Portal Jobz
					`
				});

				/*res.json({
					message: "A sua conta foi criada com sucesso"
				});*/
				// Redireciona para a página de confirmar conta
				//res.redirect('/confirmarconta');
				// Salva os dados da sessão
				req.session.email = email;
				req.session.primeiroNome = primeiroNome;
				req.session.tipoUtilizador = 'candidato';
				res.redirect('/criarconta/sucesso');
			});

		} else {
			/*res.json({
				message: 'Já existe um candidato registrado com esta conta de email'
			});*/
			res.render('criarconta', {erro: `Já existe um candidato registrado com esta conta de email: ${email}.`});
		}
	});

}

/*
*	Confirmar a conta com o código de confirmação
*/
module.exports.confirmarConta = (req, res) => {

	let { codigoDeConfirmacao } = req.body;
	
	let sql = `SELECT codigo_de_confirmacao, email FROM Candidato WHERE codigo_de_confirmacao = '${codigoDeConfirmacao}'`;
	db.query(sql, (err, resultado) => {

		// Comparar os códigos de confirmações 
		if (resultado[0].codigo_de_confirmacao == codigoDeConfirmacao) {

			let emailDB = resultado[0].email;

			// Actualizar o campo codigo_de_confirmacao na base de dados
			let sqlConfirmacao = `UPDATE Candidato SET codigo_de_confirmacao = '0' WHERE email = '${emailDB}'`;
			db.query(sqlConfirmacao, (err, resultado) => {
				if(err) throw err;

				// Redireciona para a página de login
				req.session.email = email;
				req.session.primeiroNome = resultado[0].primeiro_nome;
				res.redirect('/login');
			});

		} else {
			// Caso o código não for semelhante então mostrar o form para 
			// 
			res.redirect('/reenviarcodigo');
		}

		//res.send(resultado);
	});

}

/*
*	Login: Esta função é responsável por realizar o login 
*/

module.exports.login = (req, res) => {

	let { email, password } = req.body;

	let sql = `SELECT email, password, primeiro_nome FROM Candidato WHERE email = '${email}'`;
	db.query(sql, (err, resultado) => {
	
		console.log(resultado[0]);

		// Verifica se a bd retornou alguma linha
		if(resultado.length > 0){
			console.log('Comparar password');
			if(resultado[0].password == password) {

				req.session.email = email;
				req.session.nome = resultado[0].primeiro_nome;
				req.session.tipoUtilizador = 'candidato';
				res.redirect('/candidato');

			} else {
				//req.session.
				res.render('login/candidato', {formError: 'A password não está correcta!'});
			}
		} else {
			res.render('login/candidato', {formError: 'Lamentamos, mas esta conta não existe! Crie uma conta para poder fazer login.'});
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