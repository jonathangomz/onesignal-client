require('dotenv').config();
const supertest = require('supertest');
const OneSignal = require('../lib/client');

const onesignal = new OneSignal({
  authKey: process.env.AUTH_KEY,
  restApiKey: process.env.REST_API_KEY,
  appId: process.env.APP_ID,
});

function tomorrow() {
  let result = new Date();
  result.setDate(result.getDate() + 1);
  return result;
}

describe('Send Notifications requests', () => {

  test("Should throw an error for 'es' property missing", async () => {
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
  
    async function sendNotification() {
      let body;
      try {
        body = (await onesignal.sendNotification(message, opt)).body;
      } catch(err) {
        throw new Error(err.details[0].message);
      }
    }

    await expect(sendNotification()).rejects.toThrowError("\"es\" is required");
  });
  
  test('Should send a notification for all - Default options', async () => {
    const message = {
      en: 'This is an example for default segment',
      es: 'Este es un ejemplo para el segmento por default',
    }
  
    const body = (await onesignal.sendNotification(message)).body;

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('external_id');
    expect(body).toHaveProperty('recipients');
    expect(body.recipients).toBeGreaterThan(0);
  });

  test('Should send a test notification and return his sended', async () => {
    const opt = {
      headings: {
        en: 'Example',
        es: 'Ejemplo',
      },
      included_segments: [
        'Test',
      ]
    };
  
    const message = {
      en: 'This is an example',
      es: 'Este es un ejemplo',
    }
  
    const body = (await onesignal.sendNotification(message, opt)).body;

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('external_id');
    expect(body).toHaveProperty('recipients');
    expect(body.recipients).toBeGreaterThan(0);
  });

  test('Should schedule and cancel a notification', async () => {
    const opt = {
      headings: {
        en: 'Example',
        es: 'Ejemplo',
      },
      included_segments: [
        'Test',
      ],
      send_after: tomorrow(),
    };

    const message = {
      en: 'This is an example',
      es: 'Este es un ejemplo',
    }
  
    let body = (await onesignal.sendNotification(message, opt)).body;
    expect(body).toHaveProperty('id');

    body = (await onesignal.cancelNotification(body.id)).body;
    expect(body).toHaveProperty('success', true);

  });
  
});