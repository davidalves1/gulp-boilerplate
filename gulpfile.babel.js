'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import watch from 'gulp-watch';
import plumber from 'gulp-plumber';
import cleanCss from 'gulp-clean-css';
import concat from 'gulp-concat';
import babel from 'gulp-babel';

// Minificação dos arquivos .js
gulp.task('minjs', function() {
    return gulp
        // Define a origem dos arquivos .js
        .src(['src/js/**/*'])
        // Prevençãao de erros
        .pipe(plumber())
        // Suporte para o padrão ES6 
        .pipe(babel({
            presets: ['es2015']
        }))
        // Realiza minificação
        .pipe(uglify())
        // Altera a extenção do arquivo
        .pipe(concat('app.min.js'))
        // Salva os arquivos minificados na pasta de destino
        .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function() {
    return gulp
        // Define a origem dos arquivos .scss
        .src('src/sass/**/*')
        // Prevençãao de erros
        .pipe(plumber())
        // Realiza o pré-processamento para css
        .pipe(sass())
        // Realiza a minificação do css
        .pipe(cleanCss())
        // Altera a extenção do arquivo
        .pipe(concat('style.min.css'))
        // Salva os arquivos processados na pasta de destino
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
    gulp.start('default')
    gulp.watch('src/js/**/*.js', ['minjs'])
    gulp.watch('src/sass/**/*.scss', ['sass'])
});

gulp.task('default', ['minjs', 'sass']);
