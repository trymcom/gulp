/* =========================================================
 VARIABLE
========================================================= */
var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var documentRoot = './';

var src = {
  'scss': documentRoot + '**/css/',
  'css' : documentRoot
}

var options = {

  serve : {
    open: 'external',
    port: 3000,
    ui: false,
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
    documentRoot + '**/*.php'
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
  var processors = [
    cssnext({browsers: ['last 2 version']})
  ];
  return gulp
    .src(src.scss + '**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(sass(options.sass).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write(src.css))
    .pipe(gulp.dest(src.css))
    .pipe(browserSync.reload({stream: true}))
});

/* =========================================================
 WATCH
========================================================= */
gulp.task('watch', () => {

  // scssファイルが変更されたらsassタスクを実行
  gulp.watch(src.scss + '**/*.scss', ['sass']);
  // phpファイルとcssファイルが変更されたら、ブラウザをリロード
  gulp.watch(options.watch).on('change', browserSync.reload);
});

gulp.task('default', ['serve', 'watch']);