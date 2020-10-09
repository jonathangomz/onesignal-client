require('dotenv').config();
const supertest = require('supertest');
const OneSignal = require('../lib/client');

const onesignal = new OneSignal({
  authKey: process.env.AUTH_KEY,
  restApiKey: process.env.REST_API_KEY,
  appId: process.env.APP_ID,
});

describe('App requests', () => {

  test('Should return the app information', async () => {
    const body = (await onesignal.getApp()).body;
    expect(body).toHaveProperty('id', process.env.APP_ID);
  });

});

describe('Read Notification requests', () => {

  test('Should return the last 5 notifications', async () => {
    const body = (await onesignal.viewNotifications({limit: 5})).body;

    expect(body).toHaveProperty('notifications');
    expect(body).toHaveProperty('limit', 5);
  });

  test('Should return the information of the last notifications', async () => {
    const notifications = (await onesignal.viewNotifications({limit: 1})).body;
    expect(notifications).toHaveProperty('notifications');

    const body = (await onesignal.viewNotification(notifications.notifications[0].id)).body;
    expect(body).toHaveProperty('id');
  });

  test('Should throw a error for no notification_id', async () => {
    async function viewNotification() {
      let body;
      try {
        body = (await onesignal.viewNotification()).body;
      } catch(err) {
        throw err;
      }
    }
    await expect(viewNotification()).rejects.toThrowError(new Error(`notification_id is required`));
  });

});