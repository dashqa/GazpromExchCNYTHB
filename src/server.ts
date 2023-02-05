import express from 'express';
import * as bodyParser from 'body-parser';
// import axios from 'axios';

const app = express();
app.use(bodyParser.json());

const start = async (PORT: string) => {
  try {
    app.listen(PORT || 5000, async () => {
      console.log('🚀 app running on port', PORT || 5000);
    });
  } catch (err) {
    console.log(err);
  }
};

// const init = async (BOT_TOKEN: string, SERVER_URL: string) => {
//   const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
//   const URI = `/webhook/${BOT_TOKEN}`;
//   const WEBHOOK_URL = SERVER_URL + URI;

//   await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
// };

// const start = async (BOT_TOKEN: string, SERVER_URL: string, PORT: string) => {
//   try {
//     app.listen(PORT || 5000, async () => {
//       console.log('🚀 app running on port', PORT || 5000);
//       await init(BOT_TOKEN, SERVER_URL);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

export default start;
