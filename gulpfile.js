const gulp = require('gulp');
const pug = require('gulp-pug');
const prettify = require('gulp-html-prettify');

gulp.task('pug', function() {
    return gulp.src(['src/**/*.pug', '!src/pages/includes/**/*.pug', '!src/pages/layout/**/*.pug'])
        .pipe(pug())
        .pipe(prettify({ indent_char: ' ', indent_size: 4 }))
        .pipe(gulp.dest('public'));
});