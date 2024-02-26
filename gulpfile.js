const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const purgecss = require('gulp-purgecss')

function buildStyles() {
  return src('assets/scss/*.scss')
    .pipe(sass())
    .pipe(purgecss({ content: ['*.html'] }))
    .pipe(dest('assets/css'))
}

function watchTask() {
  watch(['assets/scss/**/*.scss', '*.html'], buildStyles)
}

exports.default = series(buildStyles, watchTask)