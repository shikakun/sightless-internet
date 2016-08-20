var gulp          = require('gulp');
var apply         = require('postcss-apply');
var atImport      = require('postcss-import');
var autoprefixer  = require('autoprefixer');
var browserSync   = require('browser-sync');
var csso          = require('postcss-csso');
var customMedia   = require('postcss-custom-media');
var customProp    = require('postcss-custom-properties');
var ghPages       = require('gulp-gh-pages');
var htmlmin       = require('gulp-htmlmin');
var nested        = require('postcss-nested');
var postcss       = require('gulp-postcss');
var runSequence   = require('run-sequence');
var watch         = require('gulp-watch');

var paths = {
  dist: 'public',
  src : 'src'
};

gulp.task('build:html', function() {
  return gulp.src(paths.src + '/**/*.html')
    .pipe(htmlmin({
      'collapseBooleanAttributes': true,
      'collapseInlineTagWhitespace': true,
      'collapseWhitespace': true,
      'minifyCSS': true,
      'minifyJS': true,
      'removeAttributeQuotes': true,
      'removeComments': true,
      'removeEmptyElements': true,
      'removeOptionalTags': true,
      'removeRedundantAttributes': true,
      'removeScriptTypeAttributes': true,
      'removeStyleLinkTypeAttributes': true,
      'sortAttributes': true,
      'sortClassName': true,
      'useShortDoctype': true
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:css', function() {
  return gulp.src(paths.src + '/style.css')
    .pipe(postcss([
      atImport(),
      customProp(),
      apply(),
      customMedia(),
      nested(),
      autoprefixer({
        browsers: ['last 2 versions']
      }),
      csso()
    ]))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', function(callback) {
  runSequence('build:html', 'build:css', callback);
});

gulp.task('server', function() {
  browserSync.init({
    files: paths.src,
    server: {
      baseDir: paths.dist
    }
  });
});

gulp.task('deploy:gh-pages', function() {
  return gulp.src(paths.dist + '/**/*')
    .pipe(ghPages());
});

gulp.task('deploy', function(callback) {
  runSequence('build', 'deploy:gh-pages', callback);
});

gulp.task('watch:html', ['build:html'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('watch:css', ['build:css'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('default', ['server'], function() {
  gulp.watch(paths.src + '/**/*.html', ['watch:html']);
  gulp.watch(paths.src + '/**/*.css', ['watch:css']);
});
