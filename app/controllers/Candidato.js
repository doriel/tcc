// Dependências
const db = require('../models/database');
const EnviarMail = require('./EnviarMail');
const moment = require('moment');
const bcrypt = require('bcrypt-nodejs');

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
	
	dataDeNascimento = moment(dataDeNascimento).format('YYYY-MM-DD');

	// Gerar código de confirmação aleatório segundo o MDN 
	//let codConfirmacao = Math.floor(Math.random() * (999999 - 0) + 0);

	// Consultar se já existe um utilizador na base de dados
	let sqlEmail = `SELECT email FROM Candidato WHERE email = ?`;
	let campos = [email];
	sqlEmail = db.format(sqlEmail, campos);
	db.query(sqlEmail, (err, resultado) => {

		if(resultado.length === 0){

			// Encriptar a password
			password = bcrypt.hashSync(password);

			// Salvar os dados do novo Candidato na base de dados
			let sql = `INSERT INTO Candidato
				(primeiro_nome, ultimo_nome, email, password, codigo_de_confirmacao, data_de_registo,
				data_de_nascimento, genero, nacionalidade, naturalidade, provincia_onde_reside, morada,
				telefone, telefone_alternativo) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?)`;
			let camposInsert = [primeiroNome, ultimoNome, email,
			password, codConfirmacao, dataDeNascimento, genero,
			nacionalidade, naturalidade, provinciaOndeReside,
			morada, telefone, telefoneAlternativo]
			// Formatar os campos e preparar devidamente a query
			sql = db.format(sql, camposInsert);
			// Inser os dados do utilizador na base de dados
			db.query(sql, (err, resultado) => {
				if(err) throw err;

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
*	viewHomeAreaCandidato: Este módulo é responsável por renderizar a página
* 	inicial da área do candidato.
*/
module.exports.viewHomeAreaCandidato = (req, res) => {

	// Obter candidaturas
	let sql = `SELECT cargo, data_limite, data_da_candidatura
	FROM Candidatura, Vaga
	WHERE Candidatura.idCandidato = ?
	AND Candidatura.idVaga = Vaga.idVaga;`;
	sql = db.format(sql, req.session.ID);
	db.query(sql, (err, Candidaturas) => {
		if(Candidaturas){
			Candidaturas.map((candidatura) => {
				candidatura.data_limite = moment(candidatura.data_limite).format('YYYY-MM-DD');
				candidatura.data_da_candidatura = moment(candidatura.data_da_candidatura).format('YYYY-MM-DD');
				return candidatura;
			});
			res.render('candidato/candidato-home', {Candidaturas});
		} else {
			res.render('candidato/candidato-home');
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

	// Obter os campos da requisição
	let { email, password } = req.body;

	// Prepara a query sql
	let sql = `SELECT idCandidato, email, password, primeiro_nome FROM Candidato WHERE email = ?`;
	let campos = [email, password];
	// Formatar os campos e preparar devidamente a query
	sql = db.format(sql, campos);
	db.query(sql, (err, resultado) => {
	
		// Verifica se a bd retornou alguma linha
		if(resultado.length > 0){
			// Comparar as password usando o método bcrypt.compareSync
			if(bcrypt.compareSync(password, resultado[0].password) == true) {

				req.session.email = email;
				req.session.nome = resultado[0].primeiro_nome;
				req.session.tipoUtilizador = 'candidato';
				req.session.ID = resultado[0].idCandidato;
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

/*
*	ListarCandidatos: Este módulo é responsável por listar todos os candidatos
*/

module.exports.listarCandidatos = (req, res) => {

	let sql = `SELECT * FROM Candidato`;
	db.query(sql, (err, resultado) => {
		if(err) throw err;

		res.render('empregador/pesquisar-candidatos', {Candidatos: resultado});
	});

}

/*
*	enviarCandidatura: Este módulo é responsável candidatar o utilizador
*	numa determinada vaga.
*/

module.exports.enviarCandidatura = (req, res) => {

	// Obter o ID da vaga e o ID do empregador a partir dos campos ocultos
	let { idVaga, idEmpregador, quantidadeDeVagas } = req.body;

	let campos = [req.session.ID, idVaga, idEmpregador];

	// Registar uma nova candidatura na base de dados
	let sql = `INSERT INTO Candidatura 
	(data_da_candidatura, Candidatura.idCandidato, Candidatura.idVaga, Candidatura.idEmpregador)
	VALUES (CURDATE(), ?, ?, ?)`;
	sql = db.format(sql, campos);
	db.query(sql, (err, resultado) => {
		if(err) throw err;

		// Decrementa na quantidade de vagas
		quantidadeDeVagas--;

		// Actualizar quantidades de vagas restantes
		let sqlVagasRestantes = `UPDATE Vaga SET quantidade_de_vagas = ? WHERE idVaga = ?`;
		sqlVagasRestantes = db.format(sqlVagasRestantes, [quantidadeDeVagas, idVaga]);
		db.query(sqlVagasRestantes, (err, resultado) => {
			if(err) throw err;

			res.redirect('/candidato');
		});
	});
}

/*
*	minhaConta
*/

function __minhaConta(ID) {
	return new Promise((resolve, reject) => {

		let sql = `SELECT * FROM Candidato WHERE idCandidato = ?`;
		sql = db.format(sql, ID);
		db.query(sql, (err, Candidato) => {
			if (err) {
				reject(err);
			}
			Candidato[0].data_de_nascimento = moment(Candidato[0].data_de_nascimento).format('YYYY-MM-DD');
			resolve(Candidato[0]);
		})

	});
}

module.exports.viewMinhaConta = (req, res) => {
	
	__minhaConta(req.session.ID)
	.then(
		(Candidato) => {
			res.render('candidato/minha-conta', {Candidato});
		}
	);
	
}