/*
*	Gulp: Automatizador de tarefas
*/

// Dependências
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const watch = require('gulp-watch');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');

// Configs
let filesToWatch = [
	'app/public/styl/*.styl',
	'app/public/styl/**/*.styl'
];

// Tarefas
gulp.task('stylus', (cb) => {
	return gulp.src('app/public/styl/*.styl')
		.pipe(stylus({compress: true}))
		.pipe(gulp.dest('app/public/css/'));
});

gulp.task('watch', () => {
	gulp.watch(filesToWatch, ['stylus']);
	gulp.watch(['app/views/**/*.pug', 'app/views/*.pug'], ['stylus']);
});

// Browser Sync
gulp.task('browserSync', ['nodemon', 'watch'], () => {
	browserSync.init(null, {
		proxy: 'http://localhost:3000',
		files: filesToWatch,
		browser: 'google chrome',
		port: 3005
	});
});

// Nodemon
gulp.task('nodemon', (cb) => {

	let started = false;

	return nodemon({
		script: 'app/app.js'
	}).on('start', () => {
		if(!started) {
			cb();
			started = true;
		}
	});

});

// Tarefa padrão
gulp.task('default', ['browserSync']);