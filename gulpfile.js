const del = require('del');
const {src, dest, series} = require('gulp');

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

exports.clean = clean;
exports.html = html;
exports.media = media;
exports.javascript = javascript;
exports.css = css;
exports.default = series(clean, html, media, javascript, css);