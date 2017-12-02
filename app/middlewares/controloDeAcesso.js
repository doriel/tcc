module.exports = (req, res, next) => {

	// Utilizador autorizado com sessão iniciada
	let utilizadorAutorizado = req.session.email;

	if (!utilizadorAutorizado) {
		res.redirect('/login');
	} else {
		next();
	}

}