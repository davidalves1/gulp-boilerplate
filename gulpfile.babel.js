'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import stylus from 'gulp-stylus';
import watch from 'gulp-watch';
import plumber from 'gulp-plumber';
import cleanCss from 'gulp-clean-css';
import concat from 'gulp-concat';
import babel from 'gulp-babel';

// Minificação dos arquivos .js
gulp.task('minjs', function() {
    return gulp
        // Define a origem dos arquivos .js
        .src(['src/js/**/*.js'])
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
        .pipe(gulp.dest('dist/js'));
});

gulp.task('stylus', function() {
    return gulp
        // Define a origem dos arquivos .scss
        .src('src/stylus/**/*.styl')
        // Prevençãao de erros
        .pipe(plumber())
        // Realiza o pré-processamento para css
        .pipe(stylus())
        // Realiza a minificação do css
        .pipe(cleanCss())
        // Altera a extenção do arquivo
        .pipe(concat('style.min.css'))
        // Salva os arquivos processados na pasta de destino
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
    gulp.start('default')
    gulp.watch('src/js/**/*.js', ['minjs'])
    gulp.watch('src/stylus/**/*.styl', ['stylus'])
});

gulp.task('default', ['minjs', 'stylus']);
