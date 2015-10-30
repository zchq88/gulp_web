/*global require*/
var gulp = require('gulp'),
	clean = require('gulp-clean'), //清理目标文件夹
	csso = require('gulp-csso'), //css压缩
	jshint = require('gulp-jshint'), //js检查
	uglify = require('gulp-uglify'), //js压缩
	ngAnnotate = require('gulp-ng-annotate'), //angular
	imagemin = require('gulp-imagemin'), //图片压缩
	minifyHtml = require("gulp-minify-html"), //html压缩
	rev = require('gulp-rev'), //- 对文件名加MD5后缀
	less = require('gulp-less'), //- less预编译
	revCollector = require('gulp-rev-collector'), //- 路径替换
	postcss = require('gulp-postcss'), //POstCSS处理器
	cssnext = require('cssnext'), //使用CSS未来的语法
	precss = require('precss'), //像Sass的函数
	autoprefixer = require('autoprefixer'); //处理浏览器私有前缀


//清理目标目录
var task_clean = function () {
	return gulp.src('dist', {
			read: false
		})
		.pipe(clean({
			force: true
		}));
};
gulp.task('clean', task_clean);

//资源文件复制
var copy = function () {
	return gulp.src('src/public/**/*')
		.pipe(gulp.dest('dist/public'));

};
gulp.task('copy', ['clean'], copy);

//图片压缩
var task_image = function () {
	gulp.src('src/image/**/*.jpg')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/image'));
	gulp.src('src/image/**/*.png')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/image'));
	return gulp.src('src/image/**/*.gif')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/image'));
};
gulp.task('image', task_image);

//less 预编译
var task_less = function () {
	return gulp.src('src/less/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('src/css/less2css'));
};
gulp.task('less', task_less);

//css压缩
var processors = [
  autoprefixer,
  cssnext,
  precss
];
var task_css = function () {
	return gulp.src('src/css/**/*.css')
		.pipe(postcss(processors))
		.pipe(csso())
		.pipe(rev())
		.pipe(gulp.dest('dist/css'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dist/rev/css'));
};
gulp.task('css', ['less'], task_css);

//js检查压缩
var task_js = function () {
	return gulp.src('src/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('dist/js'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dist/rev/js'));
};
gulp.task('js', task_js);

//html路径修改
var html_rev = function () {
	return gulp.src(['dist/rev/**/*.json', 'src/**/*.html'])
		.pipe(revCollector())
		.pipe(minifyHtml())
		.pipe(gulp.dest('dist'));

};
gulp.task('rev', [
    'image',
    'css',
    'js'], html_rev);

gulp.task('default', ['copy'], function () {
	gulp.run('rev');
});