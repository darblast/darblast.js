const gulp = require('gulp');
const typescript = require('gulp-typescript');
const merge = require('merge-stream');
const umd = require('gulp-umd');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const typedoc = require('gulp-typedoc');

gulp.task('compile', function () {
  const project = typescript.createProject('tsconfig.json');
  const tsResult = gulp.src(['src/**/*.ts'])
      .pipe(project());
  return merge(tsResult, tsResult.js.pipe(umd()))
      .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function () {
  return gulp.src('dist/darblast.js')
      .pipe(uglify())
      .pipe(rename('darblast.min.js'))
      .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series(['compile', 'uglify']));

gulp.task('watch', function () {
  return gulp.watch('src/**/*.ts', gulp.series(['compile']));
});

gulp.task('doc', function () {
  return gulp.src('src/**/*.ts')
      .pipe(typedoc({
        tsconfig: 'tsconfig.json',
        out: 'doc',
      }));
});

gulp.task('all', gulp.series(['default', 'doc']));

gulp.task('clean', function () {
  return del(['dist', 'doc']);
});
