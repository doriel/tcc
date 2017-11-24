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
	'app/styl/*.styl',
	'app/styl/**/*.styl'
]

// Tarefas
gulp.task('stylus', () => {
	return gulp.src('app/styl/*.js')
		.pipe(stylus())
		.pipe(gulp.dest('app/css'));
});

gulp.task('eslint', () => {
	return gulp.src(['app/**/*.js', 'app/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('watch', () => {
	//watch(filesToWatch, ['stylus']);
	watch('app/app.js', 'eslint');
});

// Tarefa padrão
gulp.task('default', ['watch']);