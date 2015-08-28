var gulp = require('gulp'),
    clean = require('gulp-clean'), //清理目标文件夹
    csso = require('gulp-csso'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    uglify = require('gulp-uglify'), //js压缩
    ngAnnotate = require('gulp-ng-annotate'), //angular
    imagemin = require('gulp-imagemin'), //图片压缩
    rev = require('gulp-rev'), //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'); //- 路径替换

//清理目标目录
task_clean = function () {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean({
            force: true
        }));
}
gulp.task('clean', task_clean);

//资源文件复制
copy = function () {
    return gulp.src('public/**/*')
        .pipe(gulp.dest('dist/public'));

}

gulp.task('copy', ['clean'], copy);

//图片压缩
task_image = function () {
    gulp.src('src/image/**/*.jpg')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/image'))
    gulp.src('src/image/**/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/image'))
    return gulp.src('src/image/**/*.gif')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/image'))
}
gulp.task('image', task_image);

//css压缩
task_css = function () {
    return gulp.src('src/css/**/*.css')
        .pipe(csso())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css'));
}
gulp.task('css', task_css);

//js检查压缩
task_js = function () {
    return gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/js'));
}

gulp.task('js', task_js);

//html路径修改
html_rev = function () {
    return gulp.src(['dist/rev/**/*.json', 'src/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist'));
}
gulp.task('rev', [
    'image',
    'css',
    'js'], html_rev);

gulp.task('default', ['copy'], function () {
    gulp.run('rev');
});