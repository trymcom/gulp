/* =========================================================
 VARIABLE
========================================================= */
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const htmlbeautify = require('gulp-html-beautify');
const browserSync = require('browser-sync').create();
const ssi = require("browsersync-ssi");
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const documentRoot = './';

const src = {
  'html': documentRoot + '**.html',
  'scss': documentRoot + '**/css/',
  'css' : documentRoot
}

const options = {

  serve : {
    open: 'external',
    port: 3000,
    ui: false,
    middleware: ssi({
      baseDir: documentRoot,
      ext: '.html',
      version: '1.4.0'
    }),
    server: {
      baseDir: documentRoot
    }
  },

  sass : {
    errLogToConsole: true,
    outputStyle: 'compressed'
  },

  watch : [
    documentRoot + '**/*.html',
    documentRoot + '**/*.php',
    documentRoot + '**/*.css',
    documentRoot + '**/*.js'
  ]

}

/* =========================================================
 BROWSER SYNC
========================================================= */
gulp.task('serve', () => {
  browserSync.init(options.serve);
});

/* =========================================================
 SASS
========================================================= */
gulp.task('sass', () => {
  return gulp
    .src(src.scss + '**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(sass(options.sass).on('error', sass.logError))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer({
      browsers: [
        'last 2 version',
        'Explorer >= 11',
        'iOS >= 8.1',
        'Android >= 4.4'
      ],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(src.css))
    .pipe(browserSync.reload({stream: true}))
});


/* =========================================================
 HTML BEAUTIFY
========================================================= */
gulp.task('htmlbeautify', ()=> {
  gulp.src(src.html)
    .pipe(htmlbeautify({
      'indent_size': 2,
      'indent_char': ' ',
      'max_preserve_newlines': 1
    }))
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(gulp.dest(documentRoot))
});

/* =========================================================
 WATCH
========================================================= */
gulp.task('watch', () => {

  // htmlファイルが変更されたらhtmlbeautifyタスクを実行
  gulp.watch(src.html, ['htmlbeautify']);
  // scssファイルが変更されたらsassタスクを実行
  gulp.watch(src.scss + '**/*.scss', ['sass']);
  // watchファイルが変更されたら、ブラウザをリロード
  gulp.watch(options.watch).on('change', browserSync.reload);
});

gulp.task('default', ['serve', 'watch']);