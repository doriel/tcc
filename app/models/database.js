const Sequelize = require('sequelize');

module.exports.init = () => {

	const sequelize = new Sequelize('mysql://root:tosh@localhost/jobz_portal_de_empregos');

	sequelize.authenticate()
	.then(() => {
		console.log('Database is successfully connected to the application.');
	})
	.catch((err) => {
		console.log(`There was an unexpected erro: ${err}`);
	});

}