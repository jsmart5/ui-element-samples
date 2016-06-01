'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const notify = require("gulp-notify");
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const del = require('del');

//Handles html files
gulp.task('html', function () {
  return gulp.src('app/index.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//Converts SCSS to compressed CSS with gulp-sass
gulp.task('sass', function () {
  return gulp.src('app/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'nested'
      })
      .on('error', notify.onError(function (err) {
        return {
          title: 'u got an error',
          message: err.message
        };
      })))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions']
    })]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//Handle js files
gulp.task('useref', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//Optimizes images with no-repeating
gulp.task('images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', function () {
  gulp.watch('app/*.html', gulp.series('html', 'useref'))
  gulp.watch('app/scss/**/*.scss', gulp.series('sass'))
  gulp.watch('app/scripts/**/*.js', gulp.series('useref'))
  gulp.watch('app/images/**/*.+(png|jpg|jpeg|gif|svg)', gulp.series('images'));
});

//Spins up a web server with live-reloading
gulp.task('serve', function () {
  browserSync.init({
    server: 'dist'
  });
});

//Cleans up build folder
gulp.task('clean', function () {
  return del('dist');
});

//Build task
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('html', 'sass', 'useref', 'images')));

//Default gulp task
gulp.task('default',
  gulp.series('build', gulp.parallel('watch', 'serve'))
);
