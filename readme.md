# JOBZ.COM

A small job board for IT, Design and Digital Marketing professionals. JOBZ.COM is part of my final project to graduate myself in Computer Engineering.

## The stack

This project combines Node.js, Express.js, Pug.js, Stylus and MySQL.

## How to run it

1 - Clone this repository into your machine:

	git clone git@github.com:flowck/tcc.git

2 - Install all the dependecies

	cd tcc

	sudo npm install && sudo npm install gulp-cli -g

3 - Edit the database config file in `tcc/app/models/database.js` and change the current password to your MySQL password:

	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'YOUR-MYSQL-PASSWORD-HERE',
		port: 3306,
		database: 'jobz_portal_de_empregos'
	});

4 - Create an database and then import the SQL file in `tcc/dump/database.sql` directory

5 - Run gulp

	gulp

6 - Go to [http://localhost:3005]()

## Will add more info soon :) Thanks.
