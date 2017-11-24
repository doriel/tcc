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