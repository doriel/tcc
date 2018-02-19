// Dependências
const db = require('../models/database');
const EnviarMail = require('./EnviarMail');
const moment = require('moment');

// Alterar idioma do módulo Momentjs
moment.locale('pt');

/*
*	ListarVagas: Esta função é responsável por listar as vagas com base num id
*/
module.exports.listarVagas = (req, res) => {

	let ID = req.session.ID;

	let sql = `SELECT * FROM Vaga WHERE Empregador_idEmpregador = ?`;
		sql = db.format(sql, ID);
	db.query(sql, (err, resultado) => {

		if(resultado){
			if(resultado.length > 0){
				// Gerar um novo array com os dados da vaga
				var Vagas = resultado.map((vaga) => {
					
					/* Dias restantes a partir da data limite e da 
						data de publicacao
					 */ 
					let dataDePublicacao = moment(vaga.data_de_publicacao);
					let dataLimite = moment(vaga.data_limite);
					let diasRestantes = dataLimite.from(dataDePublicacao, true);

					return {
						ID: vaga.idVaga,
						cargo: vaga.cargo,
						dataDePublicacao: moment(vaga.data_de_publicacao).format('DD-MM-YYYY'),
						estado: vaga.estado,
						diasRestantes: diasRestantes
					}

				});

				res.render('empregador/empregador-home', {Vagas});
			} else {
				res.render('empregador/empregador-home');	
			}

		} else {
			res.render('empregador/empregador-home');
		}
	});

}

/*
* __checkCandidatura: Esta função é responsável verificar se o utilizador já efectuou a 
* candidatura sobre uma determinada vaga.
* @params {Number} IDcand
* @params {Number} idVaga
*/
function __checkCandidatura(IDcand, idVaga) {
	return new Promise((resolve, reject) => {
		let sql = `SELECT idCandidato FROM Candidatura WHERE idCandidato = ?
		AND idVaga = ?`;
		sql = db.format(sql, [IDcand, idVaga]);
		db.query(sql, (err, idCandidato) => {
			if(err) {reject(err);}
			console.log(idCandidato);
			resolve(idCandidato[0]);
		});
	});
}

/*
* __obterVaga: Esta função é responsável por consultar uma vaga na base de dados
* @params {Number} ID
*/
function __obterVaga(ID) { // Query para obter uma vaga

	let sql = `SELECT idVaga, Empregador_idEmpregador, cargo, descricao, data_de_publicacao, provincia, tipo_de_contrato,
	anos_de_experiencia, Vaga.area_de_actuacao, habilidades_necessarias, salario, quantidade_de_vagas, idiomas,
	data_limite, nome, nivel_academico
	FROM Vaga, Empregador
	WHERE idVaga = ?
	AND Empregador_idEmpregador = idEmpregador`;

	// Preparar a query
	sql = db.format(sql, ID);

	return new Promise((resolve, reject) => {

		// Executar a query
		db.query(sql, (err, vaga) => {

			if(err) { reject(err); }

			if(vaga.length > 0){
				// Formatar campo data de publicação
				vaga[0].data_de_publicacao = moment(vaga[0].data_de_publicacao).format('DD-MM-YYYY');
				resolve(vaga[0]);
			} else {
				reject();
			}

		});

	});
}

/*
* __obterCandidatos: Esta função é responsável por obter os candidatos de uma determinada
* vaga.
* @params {Number} ID
*/
function __obterCandidatos(ID) {
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM Candidato, Candidatura WHERE Candidatura.idVaga = ?
		AND Candidatura.idCandidato = Candidato.idCandidato`;
		sql = db.format(sql, ID);

		db.query(sql, (err, Candidatos) => {
			if(err) {reject(err);};
			resolve(Candidatos);
		});
	});
}

module.exports.obterVaga = (req, res) => {
	// Obter o id a partir da URL. Ex: /vaga/3
	// e converter o id obtido da URL para o tipo de dados
	// number
	let ID = Number(req.params.idVaga);

	// Validação do id que é passado na URL, caso não for um número então é redirecionado para a home
	if (typeof(ID) === 'number') {
		/* Invoca a função responsável por obter uma única vaga e armazena o retorno numa
		variável */
		__obterVaga(ID)
		.then(
			(Vaga) => {
				// Formatar o número inteiro
				Vaga.salario = Vaga.salario.toLocaleString("pt-PT", {style: 'currency', currency: 'AOA'});
				if(req.session.ID && req.session.tipoUtilizador == 'candidato') {
					/* Invoca a função para verificar se o uitlizador já se candidatou a mesma vaga */
					__checkCandidatura(req.session.ID, ID)
					.then((idCandidato) => {
						res.render('vaga', {Vaga, idCandidato});
					});
				} else {
					res.render('vaga', {Vaga});
				}
			},
			(err) => {
				res.render('404');
			}
		)
	} else {
		res.redirect('/')
	}
}


/*
*	removerVaga: Esta função é responsável por remover a vaga com base num id
*/
module.exports.removerVaga = (req, res) => {

	// Id da vaga
	let campos = [req.params.id]

	// Query para remover a vaga na tabela
	let sql = `DELETE FROM Vaga WHERE idVaga = ?`;
	// Prepara devidamente a query
	sql = db.format(sql, campos);
	// Executa a query
	db.query(sql, (err, resultado) => {
		if(err) throw err;

		res.redirect('/empregador');
	});

}

/*
*	viewEditarVaga: Esta função é responsável por renderizar a view editarVaga
*/

module.exports.viewEditarVaga = (req, res) => {

	// ID da vaga
	let ID = Number(req.params.id);

	__obterVaga(ID)
	.then(
		(Vaga) => {
			Vaga.data_limite = moment(Vaga.data_limite).format('YYYY-MM-DD');
			__obterCandidatos(ID)
			.then(
				(Candidatos) => {
					res.render('empregador/editar-vaga', {Vaga, Candidatos});
				}
			);
		},
		(err) => {
			res.render('404');
		}
	);

	//res.render('empregador/editar-vaga', {Vaga});

	// Query para obter a vaga por ID
	/*let sql = `SELECT * FROM Vaga WHERE idVaga = ?`;
		sql = db.format(sql, ID);

	db.query(sql, (err, vaga) => {

		if(err) throw err;

		// Verifica se o ID existe na base de dados
		if (vaga.length > 0) {

			vaga[0].data_limite = moment(vaga[0].data_limite).format('YYYY-MM-DD');
			res.render('empregador/editar-vaga', {Vaga: vaga[0]})

		} else {
			// Se o ID não constar na base de dados então retorna para a home do empregador
			res.redirect('/empregador');
		}

	});*/

}

/*
*	rditarVaga: Esta módulo é responsável por actualizar as informações da vaga na bd
*/
module.exports.editarVaga = (req, res) => {
	// Campos do formulário
	let { cargo, tipoDeContrato, anosDeExperiencia,
		salario, areaDeActuacao, provincias, descricao,
		habilidadesNecessarias, quantidadeDeVagas, dataLimite,
		idiomas, nivelAcademico, ID
	} = req.body;

	let campos = [cargo, tipoDeContrato, anosDeExperiencia,
		salario, areaDeActuacao, provincias, descricao,
		habilidadesNecessarias, quantidadeDeVagas, dataLimite,
		idiomas, nivelAcademico, ID];

	let sqlUpdate = `UPDATE Vaga SET cargo = ?, tipo_de_contrato = ?, anos_de_experiencia = ?,
	salario = ?, area_de_actuacao = ?, provincia = ?, descricao = ?, habilidades_necessarias = ?,
	quantidade_de_vagas = ?, data_limite = ?, idiomas = ?, nivel_academico = ?
	WHERE idVaga = ?`;

	sqlUpdate = db.format(sqlUpdate, campos);
	db.query(sqlUpdate, (err, resultado) => {
		if(err) throw err;

		res.render('empregador/editar-vaga', {
			Vaga: {
				cargo: cargo,
				tipo_de_contrato: tipoDeContrato,
				anos_de_experiencia: anosDeExperiencia,
				salario: salario,
				area_de_actuacao: areaDeActuacao,
				provincia: provincias,
				descricao: descricao,
				habilidades_necessarias: habilidadesNecessarias,
				quantidade_de_vagas: quantidadeDeVagas,
				data_limite: dataLimite,
				idiomas: idiomas,
				nivel_academico: nivelAcademico,
				idVaga: ID
			},
			notificacao: 'As alterações foram gravadas com sucesso.'
		})
	});
}
