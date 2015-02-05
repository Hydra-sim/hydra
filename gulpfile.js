var gulp = require('gulp'),
    bower = require('gulp-bower'),
    sass = require('gulp-sass');

var config = {
    bowerDir: './src/main/webapp/vendor/',
    sassFiles:  './src/main/webapp/sass/*.scss',
    cssOutputDir: './src/main/webapp/css/'
};

gulp.task('default', ['bower', 'sass']);

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir));
});

gulp.task('sass', function () {
    return gulp.src(config.sassFiles)
        .pipe(sass())
        .pipe(gulp.dest(config.cssOutputDir));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('./bower.json', ['bower']);
    gulp.watch(config.sassFiles, ['sass']);
})