// Dependência
const nodemailer = require('nodemailer');


/*
*	Script para o envio do mail de confirmação
*/
module.exports = (dadosDoMail) => {

	// Configurações da conta de email transportadora do email
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'jobz.empregos@gmail.com',
			pass: 'tcc_ugs_angola'
		}
	});

	let opcoesDoMail = {
		from: 'Portal Jobz <jobz.empregos@gmail.com>',
		to: dadosDoMail.email,
		subject: dadosDoMail.titulo,
		text: dadosDoMail.mensagem
	}

	transporter.sendMail(opcoesDoMail, (error, info) => {

		if(error) throw error;

		console.log('Mensagem enviada com sucesso');

	});

}