// Dependências
const Joi = require('joi');

// Validar Formulário criar conta
module.exports.criarConta = {
	body: {
		primeiroNome: Joi.string().required(),
		ultimoNome: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required()
	}
}

module.exports.empresaCriarConta = {
	body: {
		nome: Joi.string().required(),
		nomeDoResponsavel: Joi.string().required(),
		areaDeActuacao: Joi.string().required(),
		anoDeFundacao: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required()
	}
}

module.exports.login = {
	body: {
		email: Joi.string().email().required(),
		password: Joi.string().required()
	}
}