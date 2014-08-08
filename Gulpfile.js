var gulp = require('gulp');
var typescript = require('gulp-typescript');

gulp.task('default', function () {
    return gulp.src('src/**/*.ts')
        .pipe(typescript())
        .pipe(gulp.dest('dist'));
});