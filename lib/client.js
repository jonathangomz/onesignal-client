const Request = require('superagent');
const { validate, validateString, configSchema, messageSchema } = require('./schemes');
const util = require ('./util');

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
   * @param  {Object} message - An object with the message for multiple idioms
   * @param  {string} message.en - The message on english
   * @param  {string} message.es - The message on spanish
   * @param  {Object} options - Options for the notification. _See https://documentation.onesignal.com/reference/create-notification_.
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

  /**
   * Retrieve a list of notifications
   * @param  {Object} options - An object with the parameters options. _See https://documentation.onesignal.com/reference/view-notifications_.
   * @param  {string} options.limit - How many notifications to return. Max is 50. Default is 10.
   * @param  {number} options.offset - Page offset. Default is 0. Results are sorted by queued_at in descending order. queued_at is a representation of the time that the notification was queued at.
   * @param  {number} options.kind - Kind of notifications returned. Default (not set) is all notification types. Dashboard only is 0. API only is 1. Automated only is 3.
   */
  async viewNotifications(options) {
    options = options || {
      limit: 10
    };
    options.app_id = this.appId;

    const pathParams = util.generatePathParams(options);

    const path = `${API_URL}/notifications`;
    return await Request
      .get(`${path}?${pathParams}`)
      .set('Authorization', `Basic ${this.restApiKey}`)
      .send();
  }

  /**
   * Retrieve a single notifications
   * @param  {string} notification_id - The id of the notification.
   */
  async viewNotification(notification_id) {
    validateString(notification_id, 'notification_id');

    const pathParams = util.generatePathParams({app_id: this.appId});

    const path = `${API_URL}/notifications/${notification_id}`;
    return await Request
      .get(`${path}?${pathParams}`)
      .set('Authorization', `Basic ${this.restApiKey}`)
      .send();
  }
}

module.exports = OneSignal;
