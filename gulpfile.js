const {
    src,
    dest,
    watch,
    series
} = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const browser = require('browser-sync').create();
const rename = require('gulp-rename');
const strip = require('gulp-strip-comments');
const stripCssComments = require('gulp-strip-css-comments');
const inlineCss = require('gulp-inline-css');



function doThatGoodStuff(path) {
    console.log(`path: ${path}`);

    if (!path)
        path = 'src/email/*.nunjucks';

    src(path, {
            base: './'
        })
        .pipe(nunjucksRender({
            path: 'src/templates'
        }))
        .pipe(rename(function (path) {
            if (path.dirname) path.dirname += "/../../";
        }))
        .pipe(strip({
            safe: "<!--[if"
        }))
        .pipe(stripCssComments())
        .pipe(inlineCss({
            // applyStyleTags: true,
            // applyLinkTags: true,
            removeStyleTags: false,
            // removeLinkTags: true
    }))
        .pipe(dest('./dist/'));
}


function startServer(done) {
    browser.init({
        server: {
            directory: true,
            baseDir: './dist',
        },
    });

    done();
}

function watchTemplate(done) {
    // All events will be watched
    const watcher = watch('src/email/*.nunjucks');

    watcher.on('change', function (path, stats) {
        doThatGoodStuff(path);
        browser.reload();
    });

    done();
}

function build(done) {
    doThatGoodStuff(undefined);
    done();
}

exports.build = build;
exports.default = series(build, startServer, watchTemplate);