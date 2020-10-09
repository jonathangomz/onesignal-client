require('dotenv').config();
const supertest = require('supertest');
const OneSignal = require('../lib/client');

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
  
});