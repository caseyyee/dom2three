var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var gutil = require('gulp-util');
var shell = require('gulp-shell')
var runSequence = require('run-sequence');

var path = {
  base: './hiro-ui/'
}

var filesToMove = [
  path.base + 'src/images/**/*.*',
  path.base + 'src/js/**/*.js',
  path.base + 'src/data/**/*.*',
  path.base + 'src/fonts/**/*.*'
];

// dom2three

/*
slimer is used to rasterize the page layout.
the saved image is the texture file which dom2three will load into three.js as a texture map.

[path to slimer] render/script.js [page url] [save location]
*/
var slimer = './renderer/slimerjs-0.9.3/slimerjs renderer/script.js ';

var scrapes = [
  slimer + 'http://localhost:8000/hiro-ui/build/index-hud.html ' +
    path.base + 'dom2three/hud',
  slimer + 'http://localhost:8000/hiro-ui/build/index-title.html ' +
    path.base + 'dom2three/title'
];


/*
slimer does not export the rasterized pages with alpha channels, so we will need to generate the
alpha channel manually.   To do this, we export two images for each page.   One with a #ffff00
(yellow) background and one with a #0000ff (blue) background.   Using these two images with known
background colours, we use imagmagick to composite a new image with proper alpha channel.

[imagemagick script] [#ffff00 image] [#0000ff image] [save location]

this technique was found on the imagemagick page: http://www.imagemagick.org/Usage/masking/#known_bgnd
slimer github issue: https://github.com/laurentj/slimerjs/issues/154
*/

var imagemagick = './renderer/makealpha.sh ';
var alpha = [
  imagemagick + path.base + 'dom2three/hud/index-ffff00.png ' +
    path.base + 'dom2three/hud/index-0000ff.png ' +
    path.base + 'dom2three/hud/index.png',

  imagemagick + path.base + 'dom2three/title/index-ffff00.png ' +
    path.base + 'dom2three/title/index-0000ff.png ' +
    path.base + 'dom2three/title/index.png'];


gulp.task('slimer', shell.task(scrapes));

gulp.task('makealpha', shell.task(alpha));


// everything else

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

gulp.task('copy', function() {
  gulp.src(filesToMove, { base: path.base+'src' })
    .pipe(gulp.dest(path.base+'build'));
})

gulp.task('connect', function() {
  connect.server({
    port: 8000
  });
});

gulp.task('render', function() {
  runSequence('connect', 'slimer', 'makealpha', function() {
    process.exit(0)
  });
});

gulp.task('default', function() {
  gulp.run('connect','copy', 'styles', 'content');

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