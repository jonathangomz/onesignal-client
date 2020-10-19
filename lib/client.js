const Request = require('superagent');
const { validate, validateString, configSchema, messageSchema, optViewNotificationsSchema } = require('./schemes');
const util = require ('./util');

const API_URL = 'https://onesignal.com/api/v1';
  
/**
 * @typedef Response
 * @property {string} text - Contains the unparsed response body string.
 * @property {Object} body - The parsed object for the response body. By default using "application/json" and "application/x-www-form-urlencoded".
 * @property {Object} header - Object of parsed header fields.
 * @property {string} type - The Content-Type of the response.
 * @property {string} charset - The Charset of the response.
 * @property {number} status - The status code of the response.
 */

class OneSignal {

  /**
   * The auth key of the user
   * @type {string}
   * @private
   */
  authKey;

  /**
   * The REST API key for the app
   * @type {string}
   * @private
   */
  restApiKey;

  /**
   * The id of the app
   * @type {string}
   * @private
   */
  appId;

  /**
   * Creates a new OneSignal client.
   * @param  {Object} config - An object with the keys needed.
   * @param  {string} config.authKey - The auth key of the user.
   * @param  {string} config.restApiKey - The REST API key for your app.
   * @param  {string} config.appId - The appId for your app.
   * @return {Object} The initialized client.
   * @throws Will throw an error if any config attribute is not included, if any key is not a string or if the appId is not an guid.
   */
  constructor(config) {
    validate(config, configSchema);

    const {
      authKey,
      restApiKey,
      appId
    } = config;
    
    this.authKey = authKey;
    this.restApiKey = restApiKey;
    this.appId = appId;
  }

  /**
   * Validate that the app exist in the provider.
   * @returns {boolean} True if the app exist in the provider. False if not found.
   * @throws Will throw an error if an error occur on the call that is not 404.
   */
  async isValid() {
    const path = `${API_URL}/apps/${this.appId}`;
    let res;
    try {
      res = await Request
        .get(path)
        .set('Authorization', `Basic ${this.authKey}`)
        .send();
      return res.body.id === this.appId;
    } catch (error) {
      if(error.status == 404)
        return false;
      throw new Error(error);
    }
  }

  /**
   * View the details of a single OneSignal app.
   * _For more information go to https://documentation.onesignal.com/reference/view-an-app_.
   * @returns {Promise<Response>} A promise with the response for the call. _See properties on https://visionmedia.github.io/superagent/#response-properties_.
   */
  async getApp() {
    const path = `${API_URL}/apps/${this.appId}`;
    return await Request
      .get(path)
      .set('Authorization', `Basic ${this.authKey}`)
      .send();
  }

  /**
   * Sends notifications to your users.
   * _For more information go to https://documentation.onesignal.com/reference/create-notification_.
   * @param  {Object} message - An object with the message for multiple idioms.
   * @param  {string} message.en - The message on english.
   * @param  {string} message.es - The message on spanish.
   * @param  {Object} [options] - Options for the notification. If `included_segments` not provided will send to "Test" segment by default.
   * @returns {Promise<Response>} A promise with the response for the call. _See properties on https://visionmedia.github.io/superagent/#response-properties_.
   * @throws Will throw an error if the message not include 'en' & 'es' attributes or if they are not string.
   */
  async sendNotification(message, options) {
    validate(message, messageSchema);
    
    options = options || {};
    
    if(!options.included_segments)
      options.included_segments = [ 'Test' ];

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
   * Stop a scheduled or currently outgoing notification.
   * _For more information go to https://documentation.onesignal.com/reference/cancel-notification_.
   * @param  {string} notification_id - The id of the notification.
   * @returns {Promise<Response>} A promise with the response for the call. _See properties on https://visionmedia.github.io/superagent/#response-properties_.
   * @throws Will throw an error if the 'notification_id' parameter is not presented or is not a string.
   */
  async cancelNotification(notification_id) {
    validateString(notification_id, 'notification_id');

    const pathParams = util.generatePathParams({app_id: this.appId});

    const path = `${API_URL}/notifications/${notification_id}`;
    return await Request
      .delete(`${path}?${pathParams}`)
      .set('Authorization', `Basic ${this.restApiKey}`)
      .send();
  }

  /**
   * View the details of multiple notifications.
   * _For more information go to https://documentation.onesignal.com/reference/view-notifications_.
   * @param  {Object} [options] - An object with the parameters options.
   * @param  {number} [options.limit] - How many notifications to return.
   * Max is 50. Default is 10.
   * @param  {number} [options.offset] - Page offset.
   * Default is 0. Results are sorted by queued_at in descending order. queued_at is a representation of the time that the notification was queued at.
   * @param  {number} [options.kind] - Kind of notifications returned.
   * Default (not set) is all notification types. Dashboard only is 0. API only is 1. Automated only is 3.
   * @returns {Promise<Response>} A promise with the response for the call. _See properties on https://visionmedia.github.io/superagent/#response-properties_.
   * @throws Will throw an error if any options attribute is not a number.
   */
  async viewNotifications(options) {
    validate(options, optViewNotificationsSchema);

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
   * View the details of a single notification and outcomes associated with it.
   * _For more information go to https://documentation.onesignal.com/reference/view-notification_.
   * @param  {string} notification_id - The id of the notification.
   * @returns {Promise<Response>} - A promise with the response for the call. _See properties on https://visionmedia.github.io/superagent/#response-properties_.
   * @throws Will throw an error if the 'notification_id' parameter is not presented or is not a string.
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
