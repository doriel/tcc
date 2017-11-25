/*
*	Gulp: Automatizador de tarefas
*/

// Dependências
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const watch = require('gulp-watch');
const eslint = require('gulp-eslint');

// Configs
let filesToWatch = [
	'app/public/styl/*.styl',
	'app/public/styl/**/*.styl'
];

// Tarefas
gulp.task('stylus', (cb) => {
	gulp.src('./app/public/styl/*.styl')
		.pipe(stylus({compress: true}))
		.pipe(gulp.dest('app/css'));
});

gulp.task('watch', () => {
	watch(filesToWatch, ['stylus']);
});

// Tarefa padrão
gulp.task('default', ['watch']);