var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var minify = require('gulp-minify');


var paths = {
  sass: 'sass/styles.scss',
  jsdata: [
    'js/jquery-1.9.1.min.js',
    'js/lodash.min.js',
    'select2/select2.min.js',
    'js/data/pokedex.js',
    'js/data/setdex_sm.js',
    'js/data/setdex_xy.js',
    'js/data/setdex_bw.js',
    'js/data/setdex_dpp.js',
    'js/data/setdex_rse.js',
    'js/data/setdex_gsc.js',
    'js/data/setdex_rby.js',
    'js/data/stat_data.js',
    'js/data/type_data.js',
    'js/data/nature_data.js',
    'js/data/ability_data.js',
    'js/data/item_data.js',
    'js/data/move_data.js',
  ],
  jsscript: [
    'js/shared_controls.js',
    'js/index_controls.js',
    'js/damage.js',
    'js/damage_dpp.js',
    'js/damage_rse.js',
    'js/damage_gsc.js',
    'js/damage_rby.js',
    'js/ko_chance.js',
    'js/moveset_import.js',
  ],
  html: 'public/**/*.html',
};

// Server Connect
gulp.task('connect', function(){
  connect.server({
    root: 'public',
    livereload: true
  });
});

// Html reloader
gulp.task('html', function(){
  gulp.src(paths.html)
    .pipe(connect.reload())
});

/*Sass & Css tasks*/
gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .pipe(connect.reload())
});

/*Java Script tasks*/
gulp.task('js', ['js:data','js:script']);

gulp.task('js:data', function(){
  gulp.src(paths.jsdata)
    .pipe(concat('data.js'))
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        }
    }))
    .pipe(gulp.dest('public/js'))
});
gulp.task('js:script', function(){
  gulp.src(paths.jsscript)
    .pipe(concat('script.js'))
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        }
    }))
    .pipe(gulp.dest('public/js'))
    .pipe(connect.reload())
});


// Building the app
gulp.task('build', ['html','sass','js']);


// Watching for changes
gulp.task('watch', function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch('./sass/*.scss', ['sass']);
  gulp.watch(paths.jsscript, ['js:script']);
  gulp.watch(paths.jsdata, ['js']);
});

/*Default Gulp action*/
gulp.task('default', ['build','connect','watch']);