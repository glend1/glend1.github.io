const del = require('del');
const {src, dest, series, parallel, watch} = require('gulp');

function clean(cb) {
    del('public/**', {force:true});
    cb();
}

function html(cb) {
    src('private/index.html').pipe(dest('public'));
    cb();
}

function media(cb) {
    src('private/media/**').pipe(dest('public/media'));
    cb();
}

function javascript(cb) {
    src('private/script/**').pipe(dest('public/script'));
    cb();
}

function css(cb) {
    src('private/style/**').pipe(dest('public/style'));
    cb();
}

function watcher(cb) {
    watch('private/index.html').on('change', series(html));
    watch('private/media/**').on('change', series(media));
    watch('private/script/**').on('change', series(javascript));
    watch('private/style/**').on('change', series(css));
    cb();
};

exports.clean = clean;
exports.html = html;
exports.media = media;
exports.javascript = javascript;
exports.css = css;
exports.watcher = watcher;
exports.build = series(clean, parallel(html, media, javascript, css));
exports.auto = series(exports.build, watcher);
exports.default = exports.auto;