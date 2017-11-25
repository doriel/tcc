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
	sqlEmail = `SELECT email FROM candidato WHERE email = '${email}'`;
	db.query(sqlEmail, (err, resultado) => {

		if(resultado.length === 0){

			// Salvar os dados do novo candidato na base de dados
			let sql = `INSERT INTO candidato
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
				res.redirect('/confirmarconta');
			});

		} else {
			res.json({
				message: 'Já existe um candidato registrado com esta conta de email'
			});
		}
	});

}

/*
*	Confirmar a conta com o código de confirmação
*/
module.exports.confirmarConta = (req, res) => {

	let { codigoDeConfirmacao } = req.body;
	
	let sql = `SELECT codigo_de_confirmacao, email FROM candidato WHERE codigo_de_confirmacao = '${codigoDeConfirmacao}'`;
	db.query(sql, (err, resultado) => {

		// Comparar os códigos de confirmações 
		if (resultado[0].codigo_de_confirmacao === codigoDeConfirmacao) {

			let emailDB = resultado[0].email;

			// Actualizar o campo codigo_de_confirmacao na base de dados
			let sqlConfirmacao = `UPDATE candidato SET codigo_de_confirmacao = '0' WHERE email = '${emailDB}'`;
			db.query(sqlConfirmacao, (err, resultado) => {
				if(err) throw err;

				// Redireciona para a 
			});

		} else {
			// Caso o código não for semelhante então mostrar o form para 
			// 
			res.redirect('/reenviarcodigo');
		}

		res.send(resultado);
	});

}