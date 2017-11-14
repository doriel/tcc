/*
* Todas as rotas da aplicação web estão definidas aqui
*/


// Exporta o script
module.exports = (app) => {

	app.get('/', (req, res) => {
		res.send('Base do meu TCC');
	});

	app.get('/login', (req, res) => {
		res.render('login');
	});

}