var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngmin = require('gulp-ngmin');
var uglify = require('gulp-strip-debug');
var stripDebug = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-minify-css');
var clean = require('gulp-clean');
var imagemin = require('gulp-imagemin');
var minifyCss = require('gulp-minify-css');

var paths = {
    dist: 'dist',
    sass: ['./scss/**/*.scss']
};
var htmlOptions = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true
};

gulp.task('default', ['clean'], function () {
    gulp.start('img', 'lib', 'fonts', 'platform-js', 'app-js', 'html-platform', 'html-templates', 'html-index', 'js', 'css');
});


gulp.task("clean", function () {
    return gulp.src(paths.dist)
        .pipe(clean({dynamic: false}));
});

gulp.task('html-platform', function () {
    gulp.src('./platform/**/*.html')
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest('./dist/platform/'));
});
gulp.task('html-templates', function () {
    gulp.src('./templates/**/*.html')
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest('./dist/templates/'));
});

gulp.task('html-index', function () {
    gulp.src('./index-dist.html')
        .pipe(htmlmin(htmlOptions))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function () {
    return gulp.src('./js/**/*.js')
        .pipe(ngmin({dynamic: false}))
        .pipe(stripDebug())
        .pipe(uglify({outSourceMap: false}))
        .pipe(gulp.dest('./dist/js/'))
});
gulp.task('app-js', function () {
    return gulp.src('./app.js')
        .pipe(ngmin({dynamic: false}))
        .pipe(stripDebug())
        .pipe(uglify({outSourceMap: false}))
        .pipe(gulp.dest('./dist/'))
});
gulp.task('platform-js', function () {
    return gulp.src('./platform/**/*.js')
        .pipe(ngmin({dynamic: false}))
        .pipe(stripDebug())
        .pipe(uglify({outSourceMap: false}))
        .pipe(gulp.dest('./dist/platform/'))
});
gulp.task('css', function () {
    return gulp.src('./css/**/*.css').pipe(cssmin())
        .pipe(gulp.dest('./dist/css/'))
});
gulp.task('fonts', function () {
    return gulp.src('./css/fonts/**/*.*')
        .pipe(gulp.dest('./dist/css/fonts/'))
});
gulp.task('lib', function () {
    return gulp.src('./lib/**/*.*')
        .pipe(gulp.dest('./dist/lib/'))
});
gulp.task('img', function () {
    return gulp.src('./img/**/*.{png,jpg,gif,jpeg}')
        .pipe(imagemin({
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        })).pipe(gulp.dest('./dist/img/'))
});


gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./css/'))
        .on('end', done);
});

gulp.task('watch', ['sass'], function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
