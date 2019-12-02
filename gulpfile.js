const gulp = require("gulp");
const browserSync = require('browser-sync').create();
const sass = require("gulp-sass");
const concat = require('gulp-concat');
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const minify = require('gulp-minify');
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');


function bs() {

    sassTask();

    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });

    gulp.watch("src/sass/**/*.sass").on('change', sassTask);

    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("src/css/*.css").on('change', browserSync.reload);
    gulp.watch("src/js/*.js").on('change', browserSync.reload);


};

function sassTask() {
    return gulp.src('src/sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
};

// такс для продакшена

function prod() {

    // минимизируем css и перемещаем в dist
    gulp.src('src/css/style.css')
    .pipe(cleancss({
        level: 2
    }))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css/'));

    //перемещаем style.css, css.map и все sass в dist
    gulp.src('src/css/style.css')
    .pipe(gulp.dest('dist/css/'));

    gulp.src('src/css/style.css.map')
    .pipe(gulp.dest('dist/css/'));

    gulp.src('src/sass/*.sass')
    .pipe(gulp.dest('dist/sass/'));

    //минимизируем html

    gulp.src('src/index.html')
    .pipe(htmlmin({
        collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/'));

    // минимизируем js и перемещаем в dist
    gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('script.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(minify({
        compress: true,
        ext: '.min.js'
    }))
    .pipe(gulp.dest('dist/js/'));

    //минимизируем изображения
    return gulp.src('src/img/**')
    .pipe(imagemin([
        imagemin.gifsicle({
            interlaced: true,
            optimizationLevel: 3
        }),
        imagemin.jpegtran({
            progressive: true
        }),
        imagemin.optipng({
            optimizationLevel: 7
        }),
        imagemin.svgo({
            plugins: [{
                    removeViewBox: true
                },
                {
                    cleanupIDs: true
                }
            ]
        })
    ]))
    .pipe(gulp.dest('dist/img/'))
};

exports.serve = bs;
exports.prod = prod;