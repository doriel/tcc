/*
*	Script de configuração da Base de Dados
*/

// Dependências
const mysql = require('mysql');

// Dados do servidor de base de dados
let connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'tosh',
	database: 'jobz_portal_de_empregos'
});

// Exporta o objecto connection para o uso nos controllers
module.exports = connection;

// Exporta o script de conexão com a base de dados
module.exports.init = () => {
	
	// Iniciar a conexão com a base de dados
	connection.connect((error)=>{
		if (error) {
			console.log('Erro ao se conectar com o servidor de base de dados');
		} else {
			console.log('Base de dados conectada com sucesso');
		}
	});
}