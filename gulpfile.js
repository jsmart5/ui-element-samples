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

// Converts SCSS to compressed CSS with gulp-sass
gulp.task('sass', function(){
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
});

// Handle js files
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}));
});

//Optimizes images with no-repeating
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(gulp.dest('dist/images'))
  .pipe(browserSync.reload({stream: true}));
});

// //Watches files for changes and runs the right task
// gulp.task('default', ['browserSync', 'sass', 'images', 'html','useref'], function(){
//   gulp.watch('app/scss/**/*.scss', ['sass']);
//   gulp.watch('app/js/**/*.js', ['useref']);
//   gulp.watch('app/*.html', ['html']);
//   gulp.watch('app/img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
//   gulp.watch('app/js/**/*.js', browserSync.reload);
// });

//Cleans up build folder
gulp.task('clean', function(){
  return del('dist');
});

// //Gulp default task
// gulp.task('build',
//   gulp.series('clean', gulp.parallel('browserSync', 'sass', 'images', 'html', 'useref')));
//
//   // Watches for changes
//   gulp.task('watch', function () {
//     gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
//     gulp.watch('app/*.html', gulp.series('html'));
//   });
//
// gulp.task('default', gulp.series('build', 'watch'));


///////////////////////////////////////////////////////////////////

gulp.task('html', function() {
  return gulp.src('app/index.html')
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('html', 'sass', 'useref', 'images'))
);

gulp.task('watch', function() {
  gulp.watch('app/*.html', gulp.series('html', 'useref'))
  gulp.watch('app/scss/**/*.scss', gulp.series('sass'))
  gulp.watch('app/scripts/**/*.js', gulp.series('useref'))
  gulp.watch('app/images/**/*.+(png|jpg|jpeg|gif|svg)', gulp.series('images'));
});

//Spins up a web server with live-reloading
gulp.task('serve', function() {
  browserSync.init({
    server: 'dist'
  });
});

gulp.task('default',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);
