import express from 'express';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import viewEngine from './configs/viewEngine';
import webRoutes from './routes/web';
dotenv.config();
let app = express();

//config view engine
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
webRoutes(app);
let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('listening on port: ' + port);
})