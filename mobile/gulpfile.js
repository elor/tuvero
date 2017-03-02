var gulp = require("gulp");

gulp.task("clean", function () {
    return gulp.src("test.py")
        .pipe(gulp.dest("test2.py"));
});
