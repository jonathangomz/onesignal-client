require('dotenv').config();
const OneSignal = require('./client');

const onesignal = new OneSignal({
  authKey: process.env.AUTH_KEY,
  restApiKey: process.env.REST_API_KEY,
  appId: process.env.APP_ID,
})

function testGetApp() {
  const opt = {
    headings: {
      es: 'Ejemplo',
      en: 'Example'
    },
    included_segments: [
      'All',
    ]
  };

  onesignal.getApp()
    .then(r => console.log(r.body))
    .catch(e => {
      console.log(e.response.error);
    });
}

function testSendNotification() {
  const opt = {
    headings: {
      en: 'Example',
    },
    included_segments: [
      'All',
    ]
  };

  const message = {
    en: 'This is an example',
  }

  onesignal.sendNotification(message, opt)
    .then(r => console.log(r.body))
    .catch(console.log);
}

(function main() {
  testGetApp();
  // testSendNotification();
})();