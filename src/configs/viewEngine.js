import express from 'express';

let configViewEngine = (app) => {
    app.use(express.static('./src/public'));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
};
// tim cac file ejs in views
module.exports = configViewEngine;