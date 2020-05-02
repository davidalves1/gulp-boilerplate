'use strict';

// Load plugins
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cssnano = require('cssnano');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");

const paths = {
  source: './src',
  build: './dist'
};

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: `${paths.build}/`
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
// function browserSyncReload(done) {
//   browsersync.reload();
//   done();
// }

// Clean assets
function clean() {
  return del([`${paths.build}`]);
}

// Optimize Images
function images() {
  return gulp
    .src(`${paths.source}/assets/img/**/*`)
    .pipe(newer(`${paths.build}/assets`))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest(`${paths.build}/assets`));
}

// CSS task
function css() {
  return gulp
    .src(`${paths.source}/scss/**/*.scss`)
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(paths.build))
    .pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(['.src/js/**/*', './gulpfile.js'])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Transpile, concatenate and minify scripts
function scripts() {
  return browserify({
      entries: [`${paths.source}/js/main.js`],
      transform: [babelify.configure({ presets: ['@babel/preset-env'] })],
    })
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.build))
    .pipe(browsersync.stream());
}

function html() {
  return (
    gulp
      .src([`${paths.source}/index.html`])
      .pipe(htmlmin())
      .pipe(gulp.dest(paths.build))
      .pipe(browsersync.stream())
  );
}

// Watch files
function watchFiles() {
  build();
  gulp.watch(`${paths.source}/scss/**/*`, css);
  gulp.watch(`${paths.source}/js/**/*`, gulp.series(scriptsLint, scripts));
  gulp.watch(`${paths.source}/assets/**/*`, images);
  gulp.watch(`${paths.source}/index.html`, html);
}

// define complex tasks
const js = gulp.series(scriptsLint, scripts);
const build = gulp.parallel(css, images, js, html);
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images = images;
exports.css = css;
exports.js = js;
exports.html = html;
exports.clean = clean;
exports.build = gulp.series(clean, build);
exports.watch = watch;
exports.default = build;
