'use strict';

var pkg = require('./package.json'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect'),
  browserify = require('gulp-browserify'),
  jade = require('gulp-jade'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  del = require('del'),
  through = require('through'),
  opn = require('opn'),
  ghpages = require('gh-pages'),
  path = require('path'),
  inject = require('gulp-inject'),
  ts = require('gulp-typescript'),
  isDist = process.argv.indexOf('serve') === -1;

gulp.task('js', ['clean:js'], function() {
  return gulp.src('src/scripts/main.js')
    .pipe(isDist ? through() : plumber())
    .pipe(browserify({ transform: ['debowerify'], debug: !isDist }))
    .pipe(through())
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
});

gulp.task('inject', ['injectheader', 'injectfooter']);

gulp.task('injectheader', function () {
  var target = gulp.src('./src/header.incl');
  var sources = gulp.src(['./src/public/**/*.css'], {read: false});

  return target.pipe(inject(sources, {ignorePath: 'src'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('injectfooter', function () {
  var target = gulp.src('./src/footer.incl');
  var sources = gulp.src(['./src/public/**/*.js'], {read: false});

  return target.pipe(inject(sources, {ignorePath: 'src'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy', ['clean:copy'], function () {
    return gulp.src(['src/public/**/*'], {
        base: 'src'
    }).pipe(gulp.dest('dist'));
});

gulp.task('typescript', ['clean:typescript'], function () {
  var tsResult = gulp.src('src/scripts/*.ts')
    .pipe(isDist ? through() : plumber())
    .pipe(connect.reload())
    .pipe(ts({
      target: "ES5",
      module: "commonjs",
      sourceMap: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      removeComments: false,
      noImplicitAny: false
      }));
  return tsResult.js
    .pipe(gulp.dest('dist/js'));
});

gulp.task('html', ['clean:html'], function() {
  return gulp.src('src/**/*.jade')
    .pipe(isDist ? through() : plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function() {
  return gulp.src('src/styles/*.styl')
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({
      // Allow CSS to be imported from node_modules and bower_components
      'include css': true,
      'paths': ['./node_modules', './bower_components']
    }))
    .pipe(autoprefixer('last 2 versions', { map: false }))
    .pipe(isDist ? csso() : through())
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('images', ['clean:images'], function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
});

gulp.task('clean', function(done) {
  del('dist', done);
});

gulp.task('clean:html', function(done) {
  del('dist/index.html', done);
});

gulp.task('clean:js', function(done) {
  del('dist/js/*.js', done);
});

gulp.task('clean:css', function(done) {
  del('dist/css/*.css', done);
});

gulp.task('clean:images', function(done) {
  del('dist/images', done);
});

gulp.task('clean:typescript', function(done) {
  del('dist/js', done);
});

gulp.task('clean:copy', function(done) {
  del('dist/publish/*.*', done);
});

gulp.task('connect', ['build'], function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('open', ['connect'], function (done) {
  opn('http://localhost:8080', done);
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.jade', ['html']);
  gulp.watch('src/**/images', ['images']);
  gulp.watch('src/styles/**/*.styl', ['css']);
  gulp.watch('src/scripts/**/*.ts', ['typescript']);
});

gulp.task('deploy', ['build'], function(done) {
  ghpages.publish(path.join(__dirname, 'dist'), { logger: gutil.log }, done);
});

gulp.task('build', ['js', 'css', 'typescript', 'inject', 'html', 'images', 'copy']);

gulp.task('serve', ['open', 'watch']);

gulp.task('default', ['build']);
