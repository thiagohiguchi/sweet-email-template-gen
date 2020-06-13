const {
    src,
    dest,
    watch
} = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const browser = require('browser-sync').create();
const rename = require("gulp-rename");
const strip = require('gulp-strip-comments');
const stripCssComments = require('gulp-strip-css-comments');


exports.default = function () {

    browser.init({
        server: './dist'
    });

    // All events will be watched
    // const watcher = watch('src/email/*.+(html|nunjucks)');
    const watcher = watch('src/email/*.nunjucks');

    watcher.on('change', function (path, stats) {
        // styles(); //styles task
        console.log(`path: ${path}`);

        src(path)
            .pipe(nunjucksRender({
                path: 'src/templates'
            }))
            .pipe(rename(function (path) {
                path.dirname += "/../../";
            }))
            .pipe(strip({safe: "<!--[if"}))
            .pipe(stripCssComments())
            .pipe(dest('dist/'));

        browser.reload();
    });
    // watch('src/email/*.+(html|nunjucks)', {
    //     events: 'all'
    // }, function () {

    //     gulp.src('src/email/*.+(html|nunjucks)')
    //         .pipe(nunjucksRender({
    //             path: ['src/templates/'] // String or Array
    //         }))
    //         .pipe(gulp.dest('dist'));

    //     browser.reload();
    //     /*
    //             // return pipe(nunjucksRender({
    //             //         path: ['src/templates/'] // String or Array
    //             //     }))
    //             //     .pipe(gulp.dest('dist'));*/
    // })
};