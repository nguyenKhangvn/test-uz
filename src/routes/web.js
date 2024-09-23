import express from "express";
import homeController from "../controllers/HomeController";

let router = express.Router();

let initWebRoutes = (app) => {
    //router.get("/", homeController.getHomePage);
    router.get("/", (req, res) => {
        return res.send("hello khang ND")    
    });

    router.post('/webhook', homeController.postWebhook);
    router.get('/webhook', homeController.getWebhook)
    return app.use('/', router);
}

module.exports = initWebRoutes;