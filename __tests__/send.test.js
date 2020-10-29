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
    const message = {
      heading: {
        en: 'Example',
      },
      content: {
        en: 'This is an example',
        es: 'Este es un ejemplo',
      }
    }
  
    async function sendNotification() {
      let body;
      try {
        body = (await onesignal.sendNotification(message)).body;
      } catch(err) {
        throw new Error(err.details[0].message);
      }
    }

    await expect(sendNotification()).rejects.toThrowError("\"heading.es\" is required");
  });
  
  test('Should send a notification for Test - Default options', async () => {
    const message = {
      heading: {
        en: 'Example Default Segment',
        es: 'Ejemplo Segmento Default',
      },
      content: {
        en: 'This is an example for default segment',
        es: 'Este es un ejemplo para el segmento por default',
      }
    }
  
    const body = (await onesignal.sendNotification(message)).body;

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('external_id');
    expect(body).toHaveProperty('recipients');
    expect(body.recipients).toBeGreaterThan(0);
  });

  test('Should send a test notification and return his sended', async () => {
    const message = {
      heading: {
        en: 'Example Explicit Segment',
        es: 'Ejemplo Segmento Explicito',
      },
      content: {
        en: 'This is an example for Test segment explicitly',
        es: 'Este es un ejemplo para el segmento Test de forma explícita',
      }
    }

    const targets = {
      to: {
        type: 'segments',
        value: [ 'Test' ]
      }
    };
  
    const body = (await onesignal.sendNotification(message, { targets })).body;

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('external_id');
    expect(body).toHaveProperty('recipients');
    expect(body.recipients).toBeGreaterThan(0);
  });

  test('Should send a notification only to the developer', async () => {
    const message = {
      heading: {
        en: 'Example Developer Only',
        es: 'Ejemplo Únicamente Desarrollador',
      },
      content: {
        en: 'This notification should only be send to the developers cellphone',
        es: 'Esta notificacion debería de enviarse únicamente al celular del desarrollador',
      }
    };

    const opt = {
      targets: {
        to: {
          type: 'externals',
          value: ['1130745'],
        }
      }
    }
  
    const body = (await onesignal.sendNotification(message, opt)).body;

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('external_id');
    expect(body).toHaveProperty('recipients');
    expect(body.recipients).toBeGreaterThan(0);
  });

  test('Should schedule and cancel a notification', async () => {
    const message = {
      heading: {
        en: 'Example Scheduled Notification',
        es: 'Ejemplo Notificación Agendada',
      },
      content: {
        en: 'This is an test for schedule and cancel notifications',
        es: 'Esta es una prueba para agendar y cancelar notificationes',
      }
    }

    const extra = {
      send_after: tomorrow(),
    };
    
    let body = (await onesignal.sendNotification(message, { extra })).body;
    expect(body).toHaveProperty('id');

    body = (await onesignal.cancelNotification(body.id)).body;
    expect(body).toHaveProperty('success', true);
  });
  
});