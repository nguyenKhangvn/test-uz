
import dotenv from 'dotenv';
//import axios from 'axios';
import request from 'request';
dotenv.config();

const getHomePage = (req, res) => {
    return res.render("homepage.ejs"); 
};

const postWebHook = (req, res) => {
  let body = req.body;
  console.log('Received body:', body);

  if (body.object === 'page') {
      body.entry.forEach(entry => {
          let webhook_event = entry.messaging[0];
          console.log(webhook_event);

          let sender_psid = webhook_event.sender.id;
          console.log('Sender PSID: ' + sender_psid);

          if (webhook_event.message) {
              handleMessage(sender_psid, webhook_event.message);
          } else if (webhook_event.postback) {
              handlePostback(sender_psid, webhook_event.postback);
          }
      });

      res.status(200).send('EVENT_RECEIVED');
  } else {
      console.error('Invalid object received:', body.object);
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

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;
  
  // Checks if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
    
    // Sends the response message
    callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
      console.log('Response:', body);
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

// Sends response messages via the Send API
// function callSendAPI(sender_psid, response) {
//   // Construct the message body
//   let request_body = {
//       "recipient": {
//           "id": sender_psid
//       },
//       "message": response
//   };

//   // Send the HTTP request to the Messenger Platform using axios
//   axios({
//       method: 'post',
//       url: 'https://graph.facebook.com/v2.6/me/messages',
//       params: { "access_token": process.env.PAGE_ACCESS_TOKEN },  // Thay qs bằng params
//       data: request_body  // Thay json bằng data
//   })
//   .then((res) => {
//       console.log('Message sent successfully:', res.data);
//   })
//   .catch((err) => {
//       console.error('Unable to send message:', err);
//   });
// }


export default {
    getHomePage,
    postWebHook,
    getWebHook,
};