// Dependências
const db = require('../models/database');
const EnviarMail = require('./EnviarMail');
const moment = require('moment');
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');

const ExpProfissional = require(`./ExperienciaProfissional`);

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
	let codConfirmacao = Math.floor(Math.random() * (999999 - 0) + 0);

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
				/*EnviarMail({
					email: email,
					titulo: 'Código de confirmação - Portal Jobz',
					mensagem: `
						Parabéns ${primeiroNome}, o seu registro foi efectuado com sucesso!

						Use o código ${codConfirmacao} para efectuar a confirmação de e-mail. 

						Portal Jobz
					`
				});*/

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
			res.render('criarconta/candidato', {erro: `Já existe um candidato registrado com esta conta de email: ${email}.`});
		}
	});

}

/*
*	viewHomeAreaCandidato: Este módulo é responsável por renderizar a página
* 	inicial da área do candidato.
*/
module.exports.viewHomeAreaCandidato = (req, res) => {

	// Obter candidaturas
	let sql = `SELECT Vaga.idVaga, idCandidatura, cargo, data_limite, data_da_candidatura
	FROM Candidatura, Vaga
	WHERE Candidatura.idCandidato = ?
	AND Candidatura.idVaga = Vaga.idVaga;`;
	sql = db.format(sql, req.session.ID);
	db.query(sql, (err, Candidaturas) => {
		if(Candidaturas){
			if(Candidaturas.length > 0){
				Candidaturas.map((candidatura) => {
					candidatura.data_limite = moment(candidatura.data_limite).format('YYYY-MM-DD');
					candidatura.data_da_candidatura = moment(candidatura.data_da_candidatura).format('YYYY-MM-DD');
					return candidatura;
				});
				res.render('candidato/candidato-home', {Candidaturas});
			} else {
				res.render('candidato/candidato-home');
			}
		} else {
			res.render('candidato/candidato-home');
		}
	});
}

/*
*	viewMeuPerfil: Este módulo é responsável por renderizar a página
* 	meu perfil do candidato.
*/
module.exports.viewMeuPerfil = (req, res) => {

	if (req.session.tipoUtilizador == "candidato") {
		let { ID } = req.session;
	}else {
		let { ID } = req.params.id
	}

	// Consultar o candidato candidato
	__getCandidato(ID).then((Candidato) => {

		__getFormacaoAcademica(ID)
		.then((Formacao) => {
			console.log(Formacao);
			ExpProfissional.listarExperiencias(ID)
			.then((Experiencias) => {
				res.render('candidato/meu-perfil', {
					Candidato,
					Formacao,
					Experiencias
				});
			});

		});

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
*	enviarCandidatura: Este módulo é responsável candidatar o utilizador
*	numa determinada vaga.
*/
module.exports.cancelarCandidatura = (req, res) => {

	let sql = `DELETE FROM Candidatura WHERE idCandidatura = ?`;
	sql = db.format(sql, req.params.idCandidatura);

	// Executa a query para eliminar a candidatura e em seguida actualiza
	// o valo do campo quantidade de vagas da vaga.
	db.query(sql, (err, info) => {
		if(err) throw err;

		// Consulta o valor do campo quantidade de vagas disponíveis
		let sqlQuantVaga = `SELECT quantidade_de_vagas FROM Vaga
		WHERE idVaga = ?`;
		sqlQuantVaga = db.format(sqlQuantVaga, req.params.idVaga);
		db.query(sqlQuantVaga, (err, vaga) => {
			
			// Incrementa 1 a quantidade de vagas restantes visto que o candidato cancelou
			// a candidatura
			vaga.quantidade_de_vagas += 1;

			// Executa a query para actualizar o campo quantidade de vagas.
			let sqlUpdateQuant = `UPDATE Vaga SET quantidade_de_vagas = ? WHERE idVaga = ?`;
			sqlUpdateQuant = db.format(sqlUpdateQuant, [vaga.quantidade_de_vagas, req.params.idVaga]);
			db.query(sql, (err, info) => {
				res.redirect('/candidato');
			});

		});	
	});
}

/*
*	minhaConta: Este módulo é responsável por mostrar as informações da conta
*	do profissional num formulário.
*/

function __getCandidato(ID) {
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

function __getFormacaoAcademica(idCandidato) {
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM FormacaoAcademica WHERE Candidato_idCandidato = ?`;
		sql = db.format(sql, idCandidato);

		db.query(sql, (err, Institutos) => {

			if(err) { reject(err); }

			resolve(Institutos);
		});
	});
}

module.exports.viewMinhaConta = (req, res) => {
	
	let ID = req.session.ID;

	// Função que obtem as informações do candidato
	__getCandidato(ID)
	.then(
		(Candidato) => {

			// Função que consulta as experiencias academicas do candidato
			__getFormacaoAcademica(ID).then((Institutos) => {

				// Módulo responsável por listar as experiências
				ExpProfissional.listarExperiencias(ID)
				.then((Experiencias) => {
					/* 
					*	Renderiza a view para editar as informações da conta e
					*	envia os dados do candidato e as suas experiências academicas
					*/
					let { notificacao } = req.session;
					req.session.notificacao = "";
					res.render('candidato/minha-conta', {
						Candidato,
						Institutos,
						Experiencias,
						notificacao
					});
				});

			});
		}
	);
	
}

/*
*	Este módulo é responsável por processar o form para actualizar a conta de utilizador
*	do candidato.
*/
module.exports.actualizarMinhaConta = (req, res) => {

	let {
		primeiroNome, ultimoNome,
		dataDeNascimento, genero,
		nacionalidade, naturalidade,
		provinciaOndeReside, morada,
		disposicaoDeRealocacao, anosDeExperiencia,
		areaDePreferencia, email,
		telefone, telefoneAlternativo,
	} = req.body;

	let campos = [primeiroNome, ultimoNome,
		dataDeNascimento, genero,
		nacionalidade, naturalidade,
		provinciaOndeReside, morada,
		disposicaoDeRealocacao, anosDeExperiencia,
		areaDePreferencia, email,
		telefone, telefoneAlternativo,
		req.session.ID];

	let sql = `UPDATE Candidato
	SET primeiro_nome = ?, ultimo_nome = ?, data_de_nascimento = ?, genero = ?, nacionalidade = ?,
	naturalidade= ?, provincia_onde_reside = ?, morada = ?, disposicao_de_realocacao= ?,
	anos_de_experiencia = ?, area_de_preferencia = ?, email = ?, telefone = ?, telefone_alternativo = ?
	WHERE idCandidato = ?`;

	sql = db.format(sql, campos);
	db.query(sql, (err, info) => {
		if(err) throw err;

		req.session.notificacao = "Informações actualizadas com sucesso!";
		res.redirect('/candidato/minha-conta');
	});
}

/*
*	viewAlterarPassword: Este módulo é responsável renderizar o form para editar
* 	a password.
*/

module.exports.viewAlterarPassword = (req, res) => {
	res.render('candidato/alterar-password');
}

/*
*	alterarPassword: Este módulo é responsável por processar o formulário para
*	altera a password do candidato
*/

module.exports.alterarPassword = (req, res) => {
	// Campos do formulário
	let { passwordActual, novaPassword } = req.body;
	const ID = req.session.ID;

	// Consulta para procurar o utilizador
	let sqlUtilizador = `SELECT password FROM Candidato WHERE idCandidato = ?`;
	// Preparar a query
	sqlUtilizador = db.format(sqlUtilizador, ID);
	db.query(sqlUtilizador, (err, resultado) => {

		if(resultado.length > 0){

			// Compara a password
			if(bcrypt.compareSync(passwordActual, resultado[0].password) == true) {

				// Encripta e actualiza na base de dados
				novaPassword = bcrypt.hashSync(novaPassword);
				// Query para actualizar os campos
				sqlActualizar = `UPDATE Candidato SET password = ? WHERE idCandidato = ?`;
				// Formatar a query
				sqlActualizar = db.format(sqlActualizar, [novaPassword, ID]);
				// Executar a query
				db.query(sqlActualizar, (err, data) => {
					if(err) throw err;

					res.render('candidato/alterar-password', {notificacao: 'Password alterada com sucesso!'});
				});

			} else {
				res.render('candidato/alterar-password', {
					formError: 'A password actual não corresponde com a password desta conta. Tente novamente.'
				});
			}

		} else {
			res.redirect('/candidato');
		}
	});
}


/*
*	Módulo para rendereizar o formulário para adicionar/editar as informações academicas
*/
module.exports.viewFormacoesAcademicas = (req, res) => {
	res.render('candidato/formacoes-academicas');
}

/*
*	Módulo para processar o formulário de inserção das formações acadêmicas
*/
module.exports.formacoesAcademicas = (req, res) => {
	
	let {
		nomeDaInstituicao,
		tituloObtido,
		anoDeInicio,
		anoDeTermino
	} = req.body;

	let campos = [nomeDaInstituicao,
		tituloObtido,
		anoDeInicio,
		anoDeTermino,
		req.session.ID];

	let sql = `INSERT INTO FormacaoAcademica
	(nome_da_instituicao, titulo_obtido, ano_de_inicio, ano_de_termino, Candidato_idCandidato)
	VALUES (?, ?, ?, ?, ?)`;

	sql = db.format(sql, campos);

	db.query(sql, (err, resultado) => {
		if (err) throw err;

		res.redirect('/candidato/minha-conta');
	});

}

/*
*	Módulo para renderizar a view para carregar o cv do candidato
*/
module.exports.viewCarregarCV = (req, res) => {

	let notificacao = req.session.cvNotificacao;
	// Limpar a notificação da sessão
	req.session.cvNotificacao = "";
	res.render('candidato/carregar-cv', {notificacao});
}

/*
*	Módulo para processar o formulário de envio do CV do candidato.
*/
module.exports.carregarCV = (req, res) => {

	let cv = req.file;
	
	if(cv){

		let sql = `UPDATE Candidato SET curriculum_vitae = ? WHERE idCandidato = ?`;
		sql = db.format(sql, [cv.filename, req.session.ID]);
		db.query(sql, (err, info) => {
			if(err) throw err;

			req.session.cvNotificacao = 'O seu curriculum foi carregado com sucesso';
			res.redirect('/candidato/minha-conta/carregar-cv');
		});

	} else {
		res.render('candidato/carregar-cv', {
			formError: 'O formato do ficheiro não é suportado. Faça upload de ficheiros .pdf'
		});
	}

}

/*
*	Módulo para renderizar a view para carregar o cv do candidato
*/
module.exports.viewCarregarFotografia = (req, res) => {

	let notificacao = req.session.ftNotificacao;
	// Limpar a notificação da sessão
	req.session.ftNotificacao = "";
	res.render('candidato/carregar-fotografia', {notificacao});
}

/*
*	Módulo para processar o formulário de envio do CV do candidato.
*/
module.exports.carregarFotografia = (req, res) => {

	let foto = req.file;
	
	if(foto){

		let sql = `UPDATE Candidato SET foto_de_perfil = ? WHERE idCandidato = ?`;
		sql = db.format(sql, [foto.filename, req.session.ID]);
		db.query(sql, (err, info) => {
			if(err) throw err;

			req.session.ftNotificacao = 'O sua fotografia foi carregada com sucesso!';
			res.redirect('/candidato/minha-conta/carregar-fotografia');
		});

	} else {
		res.render('candidato/carregar-fotografia', {
			formError: 'O formato do ficheiro não é suportado. Faça upload de ficheiros .jpg/.png'
		});
	}

}