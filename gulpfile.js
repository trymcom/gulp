/* =========================================================
 VARIABLE
========================================================= */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    cssnext = require('postcss-cssnext'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    documentRoot = './';

var src = {
      'scss': documentRoot + '**/css/',
      'css': documentRoot
    };

/* =========================================================
 BROWSER SYNC
========================================================= */
var serveOptions = {
      open: 'external',
      port: 3000,
      ui: false,
      server: {
        baseDir: documentRoot
      }
    };

gulp.task('serve', () => {
  browserSync.init(serveOptions);
});

/* =========================================================
 SASS
========================================================= */
var sassOptions = {
      errLogToConsole: true,
      outputStyle: 'compressed'
    };

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
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write(src.css))
    .pipe(gulp.dest(src.css))
    .pipe(browserSync.reload({stream: true}))
});

/* =========================================================
 WATCH
========================================================= */
var watchOptions = [
      documentRoot + '**/*.html',
      documentRoot + '**/*.php'
    ];

gulp.task('watch', () => {

  // scssファイルが変更されたらsassタスクを実行
  gulp.watch(src.scss + '**/*.scss', ['sass']);
  // phpファイルとcssファイルが変更されたら、ブラウザをリロード
  gulp.watch(watchOptions).on('change', browserSync.reload);
});

gulp.task('default', ['serve', 'watch']);