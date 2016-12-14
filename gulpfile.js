const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const exec = require('child_process').exec;
const nodemon = require('gulp-nodemon');
const flow = require('gulp-flowtype');

const paths = {
  allSrcJs: 'src/**/*.js',
  libDir: 'lib',
};

gulp.task('clean', () => {
  return del(paths.libDir);
});

gulp.task('check', () => {
  return gulp
    .src(paths.allSrcJs)
    .pipe(flow({abort : true}));
});

gulp.task('build', ['clean', 'check'], () => {
  const stream = gulp
    .src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir));
  return stream;
});

// /!\ : don't put this task as dependency of another task : nodemon run permanently
gulp.task('main', ['build'], (callback) => {
  nodemon({
    script: `${paths.libDir}/server`,
    watch: [`${paths.allSrcJs}`],
    tasks: ['build']
  });
});


gulp.task('default', ['main']);