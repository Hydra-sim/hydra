var gulp = require('gulp'),
    bower = require('gulp-bower');

var config = {
    bowerDir: './src/main/webapp/js/vendor/'
};

gulp.task('default', ['bower']);

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir));
});

