// Controlo de acesso para os candidatos
module.exports.Candidatos = (req, res, next) => {

	// Utilizador autorizado com sessão iniciada
	let utilizadorAutorizado = req.session.email;

	if (!utilizadorAutorizado) {
		res.redirect('/login/candidato');
	} else {
		next();
	}

}

// Controlo de acesso para os Empregadores
module.exports.Empregadores = (req, res, next) => {

	// Utilizador autorizado com sessão iniciada
	let utilizadorAutorizado = req.session.email;

	if (!utilizadorAutorizado) {
		res.redirect('/login/empregador');
	} else {
		next();
	}

}