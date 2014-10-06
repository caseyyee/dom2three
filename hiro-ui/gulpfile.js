var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var gutil = require('gulp-util');

gulp.task('scripts', function() {
  gulp.src(['src/scripts/**/*.js'])
    .pipe(gulp.dest('build/js'));
});

gulp.task('styles', function() {
  gulp.src(['src/sass/**/*.scss'])
    .pipe(sass().on('error', function(err){
        gutil.log(gutil.colors.red('Error in SASS syntax'));
    }))
    .pipe(gulp.dest('build/css'));
});

gulp.task('markdown', function() {
  gulp.src(['src/docs/*.md'])
    .pipe(markdown())
    .pipe(gulp.dest('src/docs'))
  gulp.src(['src/docs/images/**/*.jpg','src/docs/images/**/*.png','src/docs/images/**/*.gif'])
    .pipe(gulp.dest('build/images'))
});

gulp.task('content', function() {
  gulp.src(['src/jade/**/*.jade', '!src/jade/layouts/**'])
    .pipe(jade().on('error', function(err){
        gutil.log(gutil.colors.red(err))
    }))
    .pipe(gulp.dest('build'))
});

gulp.task('bower', function() {
  gulp.src(['!bower_components/fira{,/**}','bower_components/**/*.*'])
    .pipe(gulp.dest('build/js'));
})


// copy fira font into appropriate folder
gulp.task('font', function() {
  gulp.src(['bower_components/fira/**/*.*'])
    .pipe(gulp.dest('build/fonts'));
})

gulp.task('copy', function() {
  gulp.src(['src/data/*.*'],{ base: './src' })
    .pipe(gulp.dest('build'));
})



gulp.task('default', function() {
  gulp.run('scripts', 'styles', 'content', 'font', 'copy', 'bower');

  gulp.watch('src/sass/**/*.*', function(event) {
    gulp.run('styles');
  });
  gulp.watch('src/jade/**/*.*', function(event) {
    gulp.run('content');
  });
  gulp.watch('src/scripts/**/*.*', function(event) {
    gulp.run('scripts');
  });


});