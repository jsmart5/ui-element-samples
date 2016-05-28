'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var notify = require("gulp-notify");
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var del = require('del');

// Converts SCSS to compressed CSS with gulp-sass
function sass() {
  return gulp.src('app/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'})
    .on('error', notify.onError(function(err) {
      return {
        title: 'sass task got error',
        message: err.message
      };
    })))
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}));
}

//Handle scripts files
function scripts() {
  return gulp.src('app/*.html', { sourcemaps: true })
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}));
}

//Copying oprimized images
function images(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(gulp.dest('dist/images'))
  .pipe(browserSync.reload({stream: true}));
}

//Copying html files
function html() {
  return gulp.src('app/index.html')
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.reload({stream: true}));
}

//Cleans up dist folder
function clean() {
  return del('dist');
}

gulp.task('default',
  gulp.series(build, gulp.parallel(serve, watch))
);

function build() {
  gulp.series(clean, gulp.parallel(sass, scripts, images, html));
}

function watch() {
  gulp.watch('app/*.html', gulp.series(html))
  gulp.watch('app/scss/**/*.scss', gulp.series(sass))
  gulp.watch('app/scripts/**/*.js', gulp.series(scripts))
  gulp.watch('app/images/**/*.+(png|jpg|jpeg|gif|svg)', gulp.series(images));
}

//Spins up a web server with live-reloading
function serve() {
  browserSync.init({
    server: 'build'
  });
}
