import express from 'express';
import homeController from '../controllers/HomeController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.post('/webhook', homeController.postWebHook);
    router.get('/webhook', homeController.getWebHook);
    return app.use('/', router);
}

export default initWebRoutes;