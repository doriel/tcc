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
			res.render('empregador/empregador-home', {Vagas});
		}
	});

}

/*
*	removerVaga: Esta função é responsável por obter uma vaga com base num id
*/
module.exports.obterVaga = (req, res) => {
	// Obter o id a partir da URL. Ex: /vaga/3
	// e converter o id obtido da URL para o tipo de dados
	// number
	let ID = Number(req.params.idVaga);

	// Validação do id que é passado na URL, caso não for um número então é redirecionado para a home
	if (typeof(ID) === 'number') {
		// Query para obter uma vaga
		let sql = `SELECT idVaga, cargo, descricao, data_de_publicacao, provincia, tipo_de_contrato,
		anos_de_experiencia, Vaga.area_de_actuacao, habilidades_necessarias, salario, quantidade_de_vagas,
		nome FROM Vaga, Empregador WHERE idVaga = ? AND Empregador_idEmpregador = idEmpregador`;

		// Preparar a query
		sql = db.format(sql, ID);

		// Executar a query
		db.query(sql, (err, vaga) => {

			if(err) throw err;

			vaga.ID = vaga.idVaga;
			// Formatar a data
		
			vaga = vaga.map((v) => {
				return {
					ID: v.idVaga,
					cargo: v.cargo,
					nome: v.nome,
					descricao: v.descricao,
					dataDePublicacao: moment(v.data_de_publicacao).format('DD-MM-YYYY'),
					provincia: v.provincia,
					tipoDeContrato: v.tipo_de_contrato,
					anosDeExperiencia: v.anos_de_experiencia,
					areaDeActuacao: v.area_de_actuacao,
					habilidadesNecessarias: v.habilidades_necessarias,
					salario: v.salario.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'}),
					quantidadeDeVagas: v.quantidade_de_vagas
				}
			});

			console.log(vaga[0]);
			res.render('vaga', {Vaga: vaga[0]});
		});
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
	let ID = req.params.id;

	// Query para obter a vaga por ID
	let sql = `SELECT * FROM Vaga WHERE idVaga = ?`;
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

	});

}

/*
*	rditarVaga: Esta módulo é responsável por actualizar as informações da vaga na bd
*/
module.exports.editarVaga = (req, res) => {
	
}
