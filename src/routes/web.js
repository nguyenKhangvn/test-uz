import express from 'express';
import homeController from '../controllers/HomeController';

const router = express.Router();

const initWebRoutes = (app) => {
    // router.get('./', homeController.getHomePage);
    router.get("/", (req, res) => {
        return res.send("hello khang ND")    
    });
    router.post('/webhook', homeController.postWebHook);
    router.get('/webhook', homeController.getWebHook);
    return app.use('/', router);
}

export default initWebRoutes;