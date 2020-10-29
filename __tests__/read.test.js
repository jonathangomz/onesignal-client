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

  test('Should return true for key & app validation', async () => {
    const isValid = await onesignal.isValid();
    expect(isValid).toBe(true);
  });

});

describe('Read Notification requests', () => {

  test('Should return the last 5 notifications', async () => {
    const body = (await onesignal.viewNotifications({limit: 5})).body;

    expect(body).toHaveProperty('notifications');
    expect(body).toHaveProperty('limit', 5);
  });

  test('Should throw an error for invalid string on options', async () => {
    async function viewNotifications() {
      let body;
      try {
        body = (await onesignal.viewNotifications({limit: 5, offset: 'This is a text'}));
      } catch(err) {
        throw err;
      }
      return body;
    }
    
    await expect(viewNotifications()).rejects.toThrowError("\"offset\" must be a number");
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
      return body;
    }
    await expect(viewNotification()).rejects.toThrowError(new Error("\"notification_id\" is required"));
  });

  test('Should return two devices', async () => {
    const { body } = await onesignal.viewDevices({limit: 2});
    expect(body).toHaveProperty('players');
    expect(Array.isArray(body.players)).toBe(true);
  });

  test('Should return all (max 300) the devices', async () => {
    const { body } = await onesignal.viewDevices();
    expect(body).toHaveProperty('players');
    expect(Array.isArray(body.players)).toBe(true);
  });

  test('Should throw an error for invalid limit', async () => {
    const viewDevices = async () => {
      try {
        const { body } = await onesignal.viewDevices({ limit: "aasd" });
        return body;
      } catch(err) {
        throw new Error(err.details[0].message);
      }
    }
    await expect(viewDevices()).rejects.toThrowError("\"limit\" must be a number");
  });

  test('Should return the device', async () => {
    const { status, body } = await onesignal.viewDevice('107a32d0-371e-4aff-a5bf-65991e3dd47b');
    expect(body).toHaveProperty('identifier');
    expect(status).toBe(200);
  });

  test('Should throw an error for invalid player id', async () => {
    const viewDevice = async () => {
      try {
        const { body } = await onesignal.viewDevice(123123);
        return body;
      } catch(err) {
        throw err;
      }
    }
    await expect(viewDevice()).rejects.toThrowError("\"player_id\" is required");
  });
});