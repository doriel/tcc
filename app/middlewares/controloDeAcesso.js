// Controlo de acesso para os candidatos
module.exports.Candidatos = (req, res, next) => {

	// Utilizador autorizado com sessão iniciada
	let utilizadorAutorizado = req.session.email;

	if (utilizadorAutorizado && req.session.tipoUtilizador == 'candidato') {
		next();
	} else {
		res.redirect('/login/candidato');
	}

}

// Controlo de acesso para os Empregadores
module.exports.Empregadores = (req, res, next) => {

	// Utilizador autorizado com sessão iniciada
	let utilizadorAutorizado = req.session.email;

	if (utilizadorAutorizado && req.session.tipoUtilizador == 'empregador') {
		next();
	} else {
		res.redirect('/login/empregador');
	}

}