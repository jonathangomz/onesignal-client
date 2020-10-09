const Request = require('superagent');
const { validate, configSchema, messageSchema } = require('./schemes');

const API_URL = 'https://onesignal.com/api/v1';

class OneSignal {

  authKey;
  restApiKey;
  appId;

  /**
   * Creates a new OneSignal client
   * @param  {Object} credentials - An object with the credentials needed
   * @param  {string} credentials.authKey - The auth key of the user
   * @param  {string} credentials.restApiKey - The REST API key for your app
   * @param  {string} credentials.appId - The appId for your app
   * @return {Object} The initialized client
   */
  constructor({
    authKey,
    restApiKey,
    appId
  }) {
    validate({
      authKey,
      restApiKey,
      appId
    }, configSchema);


    this.authKey = authKey;
    this.restApiKey = restApiKey;
    this.appId = appId;
  }

  /**
   * Get the application information
   */
  async getApp() {
    const path = `${API_URL}/apps/${this.appId}`;
    return await Request
      .get(path)
      .set('Authorization', `Basic ${this.authKey}`)
      .send();
  }

  /**
   * Send a notification to all
   * @param  {object} message - An object with the message for multiple idioms
   * @param  {object} options - Options for the notification. _See https://documentation.onesignal.com/reference/create-notification_.
   */
  async sendNotification(message, options) {
    validate(message, messageSchema);

    options = options || {};

    const payload = {
      ...options,
      app_id: this.appId,
      contents: {
        es: message.es,
        en: message.en,
      }
    };

    const path = `${API_URL}/notifications`;
    return await Request
      .post(path)
      .set('Authorization', `Basic ${this.restApiKey}`)
      .send(payload);
  }
}

module.exports = OneSignal;
