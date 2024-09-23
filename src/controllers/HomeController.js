
import dotenv from 'dotenv';
dotenv.config();

const getHomePage = (req, res) => {
    return res.render("homepage.ejs"); 
};

const postWebHook = (req, res) => {
    let body = req.body;

    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body, { depth: null });
    if (body.object === "page") {
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
};

const getWebHook = (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
};

export default {
    getHomePage,
    postWebHook,
    getWebHook,
};