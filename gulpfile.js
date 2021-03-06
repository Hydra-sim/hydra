var gulp = require('gulp'),
    bower = require('gulp-bower'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    ngAnnotate = require('gulp-ng-annotate'),
    concat = require('gulp-concat'),
    redbird = require('redbird');

var rootWebDir = './src/main/webapp/';

var config = {
    bowerDir: rootWebDir + 'vendor/',
    sassFiles:  rootWebDir + 'sass/**/*.scss',
    sassInputFile: rootWebDir + 'sass/main.scss',
    cssOutputDir: rootWebDir + 'css/',
    htmlFiles: rootWebDir + '/**/*.html',
    jsFiles: rootWebDir + '/js/**/*.js'
};

var vendorJsFiles = [
    config.bowerDir + 'angular/angular.js',
    config.bowerDir + 'angular-bootstrap/ui-bootstrap-tpls.min.js',
    config.bowerDir + 'angular-loading-bar/build/loading-bar.min.js',
    config.bowerDir + 'angular-resource/angular-resource.js',
    config.bowerDir + 'angular-route/angular-route.js',
    config.bowerDir + 'angular-zeroclipboard/src/angular-zeroclipboard.js',
    config.bowerDir + 'angular-animate/angular-animate.min.js',
    config.bowerDir + 'd3/d3.min.js',
    config.bowerDir + 'ng-file-upload/FileAPI.min.js',
    config.bowerDir + 'ng-file-upload/ng-file-upload-shim.min.js',
    config.bowerDir + 'ng-file-upload/ng-file-upload.min.js',
    config.bowerDir + 'underscore/underscore-min.js',
    config.bowerDir + 'zeroclipboard/dist/ZeroClipboard.min.js',
    config.bowerDir + 'calc-polyfill/calc.min.js'
];


gulp.task('default', ['bower', 'sass', 'vendor.js', 'js']);

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
        .pipe(connect.reload());
});

gulp.task('vendor.js', ['bower'], function() {
   return gulp.src(vendorJsFiles)
       .pipe(sourcemaps.init())
            .pipe(concat('vendor.js'))
       .pipe(sourcemaps.write())
       .pipe(gulp.dest(config.bowerDir));
});

gulp.task('sass', ['bower'], function () {
    return gulp.src(config.sassInputFile)
        .pipe(sass())
        .pipe(gulp.dest(config.cssOutputDir))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    return gulp.src(config.htmlFiles)
        .pipe(connect.reload());
});

gulp.task('js', function () {
    return gulp.src(config.jsFiles)
        .pipe(sourcemaps.init())
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(concat('default.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.bowerDir))
        .pipe(connect.reload());
});

gulp.task('watch', ['default'], function () {
    gulp.watch('./bower.json', ['bower']);
    gulp.watch(config.sassFiles, ['sass']);
    gulp.watch(config.htmlFiles, ['html']);
    gulp.watch(config.jsFiles, ['js']);
});

gulp.task('connect', ['watch'], function() {
    connect.server({
        root: [rootWebDir],
        livereload: true,
        port: 8081
    });

    var proxy = redbird({port: 8082});
    proxy.register('http://localhost:8082/api', 'http://localhost:8080/hydra/api');
    proxy.register('http://localhost:8082', 'http://localhost:8081');
});

gulp.task('dev', ['connect']);
