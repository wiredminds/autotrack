var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var lazypipe = require('lazypipe');
var tar = require('gulp-tar');
var bower = require('gulp-bower');
var rename = require('gulp-rename');
var package = require('./package.json');

var paths = {
  scripts: ['src/wm_autotrack.js']
};

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
            .pipe(jshint(
                    {
                      'undef': true,
                      'unused': true
                    }))
            .pipe(jshint.reporter('default'));
});

gulp.task('cs', ['lint'], function() {
  return gulp.src(paths.scripts)
            .pipe(jscs()).pipe(jscs.reporter('console'));
});

gulp.task('clear-build', ['cs'], function () {
    return gulp.src('dist/*.js', {read: false})
            .pipe(clean())
            ;
});

gulp.task('compress', ['clear-build'], function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

//gulp.task('bower', function() {
//  return bower()
//    .pipe(gulp.dest('lib/'));
//});

gulp.task('default', ['compress'], function() {
  // place code for your default task here
});
