var gulp = require('gulp'),
    bower = require('gulp-bower'),
    sass = require('gulp-ruby-sass'),
    connect = require('gulp-connect');

var rootWebDir = './src/main/webapp/';

var config = {
    bowerDir: rootWebDir + 'vendor/',
    sassFiles:  rootWebDir + 'sass/*.scss',
    sassInputFile: rootWebDir + 'sass/main.scss',
    cssOutputDir: rootWebDir + 'css/'
};

gulp.task('default', ['bower', 'sass']);

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
        .pipe(connect.reload());
});

gulp.task('sass', ['bower'], function () {
    return sass(config.sassInputFile)
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(connect.reload())
        .pipe(gulp.dest(config.cssOutputDir));
});

gulp.task('html', function () {
    gulp.src(rootWebDir + '/**/*.html')
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src(rootWebDir + '/**/*.js')
        .pipe(connect.reload());
});

gulp.task('watch', ['default'], function () {
    gulp.watch('./bower.json', ['bower']);
    gulp.watch(config.sassFiles, ['sass']);
    gulp.watch(rootWebDir + '/**/*.html', ['html']);
    gulp.watch(rootWebDir + '/js/*.js', ['js']);
});

gulp.task('connect', ['watch'], function() {
    connect.server({
        root: [rootWebDir],
        livereload: true,
        port: 8081
    });

    var proxy = require('redbird')({port: 8082});
    proxy.register('http://localhost:8082/api', 'http://localhost:8080/hydra/api');
    proxy.register('http://localhost:8082', 'http://localhost:8081');
});

gulp.task('dev', ['connect']);
