var gulp = require('gulp');
var qunits = require('gulp-qunits');

gulp.task('test', function () {
    return gulp.src('testrunner.js')
        .pipe(qunits())
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        });
});

