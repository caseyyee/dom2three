var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var gutil = require('gulp-util');
var shell = require('gulp-shell')

var path = {
  base: './hiro-ui/'
}

var filesToMove = [
	path.base+'src/images/**/*.*',
	path.base+'src/js/**/*.js',
	path.base+'src/data/**/*.*'
];

// dom2three
var renderFrom = 'http://localhost:8000/index-layout.html'
var renderOutTo = './scrape'

gulp.task('dom2three', function() {
  gulp.src(['dom2three.js'])
    .pipe(gulp.dest(path.base+'build/js'));
});


gulp.task('styles', function() {
  gulp.src([path.base+'src/sass/**/*.scss'])
    .pipe(sass().on('error', function(err){
        gutil.log(gutil.colors.red('Error in SASS syntax'));
    }))
    .pipe(gulp.dest(path.base+'build/css'));
});

gulp.task('content', function() {
  gulp.src([path.base+'src/jade/**/*.jade', 
    '!'+path.base+'src/jade/layouts/**',
    '!'+path.base+'src/jade/modules/**'])
    .pipe(jade().on('error', function(err){
        gutil.log(gutil.colors.red(err))
    }))
    .pipe(gulp.dest(path.base+'build'))
});

gulp.task('bower', function() {
  gulp.src(['!'+path.base+'bower_components/fira{,/**}', 
    path.base+'bower_components/**/*.*'])
    .pipe(gulp.dest(path.base+'build/js'));
})


// copy fira font into appropriate folder
gulp.task('font', function() {
  gulp.src([path.base+'bower_components/fira/**/*.*'])
    .pipe(gulp.dest(path.base+'build/fonts/fira'));
})

gulp.task('copy', function() {
  gulp.src(filesToMove, { base: path.base+'src' })
  	.pipe(gulp.dest(path.base+'build'));
})

gulp.task('slimer',  shell.task([
	'./renderer/slimerjs-0.9.3/slimerjs ./renderer/script.js '+renderFrom+' '+renderOutTo
]));

gulp.task('imagemagick', shell.task([
  './renderer/makealpha.sh'
]));

gulp.task('connect', function() {
  connect.server({
  	root: path.base+'build/',
  	port: 8000
  });
});

gulp.task('render', function() {
  gulp.run('connect', 'slimer');

  // give some time to let slimer do its work, then run imagemagick
  setTimeout(function() { 
    gulp.run('imagemagick') 
  },2000);

  // give imagemagick some time before quitting.
  setTimeout(function() { 
    process.exit(0) 
  },5000);
});

gulp.task('default', function() {
  gulp.run('connect','copy', 'styles', 'content', 'font', 'bower', 'dom2three');

  gulp.watch(path.base+'src/sass/**/*.*', function(event) {
    gulp.run('styles');
  });
  gulp.watch(path.base+'src/jade/**/*.*', function(event) {
    gulp.run('content');
  });
  gulp.watch(path.base+'src/js/**/*.*', function(event) {
    gulp.run('copy');
  });
});