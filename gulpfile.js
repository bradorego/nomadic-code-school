// Assigning modules to local variables
var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var del = require('del');



// Default task
gulp.task('default', ['less', 'copy']);

// Less task to compile the less files 
gulp.task('less', function() {
    return gulp.src('less/grayscale.less')
        .pipe(less())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'))
})

// Copy jQuery core files from node_modules to vendor directory
gulp.task('jquery', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))
})

// Copy Font Awesome core files from node_modules to vendor directory
gulp.task('fontawesome', function() {
    return gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'))
})

// Copy all dependencies from node_modules
gulp.task('copy', ['bootstrap', 'jquery', 'fontawesome']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})
gulp.task('browserSync-deploy', function() {
    browserSync.init({
        server: {
            baseDir: prodRoot
        },
    })
})

var prodRoot = "./deploy";
var minifyCSS = require('gulp-minify-css'),
  minifyHTML = require('gulp-minify-html'),
  usemin = require('gulp-usemin'),
  rev = require('gulp-rev');
///usemin
gulp.task('usemin', function() {
  del.sync([prodRoot]);
  return gulp.src('./index.html')
    .pipe(usemin({
      css: [ rev() ],
      html: [ minifyHTML({ empty: true }) ],
      js: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinecss: [ minifyCSS(), 'concat' ]
    }))
    .pipe(gulp.dest(prodRoot));
});

gulp.task('deploy-img', function () {
  del.sync([prodRoot + '/img']);
  return gulp.src('./img/**/*.*')
    .pipe(gulp.dest(prodRoot + '/img'));
});

gulp.task('deploy', ['usemin', 'deploy-img']);

// Watch Task that compiles LESS and watches for HTML or JS changes and reloads with browserSync
gulp.task('dev', ['browserSync', 'less'], function() {
    gulp.watch('less/*.less', ['less']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});
