const Request = require('superagent');
const { validate, validateString, configSchema, messageSchema, optViewNotificationsSchema, targetsSchema } = require('./schemes');
const { mapTargetsToOS, mapMessageToOS } = require('./util');
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
   * @typedef LangObject
   * @property {string} en - The string on english.
   * @property {string} es - The string on spanish.
   *
   *
   * @typedef Targets
   * @property {Object} [to] - An object with the targets and/or the filters.
   * If not provided send the notification to 'Test' segment.
   * @property  {string} [to.type] - The type of the target.
   * 'segments' to select by segments. 'users' to select by OneSignal users ids. 'external' to select by your own users ids.
   * @property  {Array<string>} [to.value] - An array with the segments or with the ids.
   * @property  {Array<Object>} [filters] - An array with the filters. **Only work with segments**.
   *
   * 
   * Sends notifications to your users.
   * _For more information go to https://documentation.onesignal.com/reference/create-notification_.
   * @param  {Object} message - An object with the message attributes on multiple idioms.
   * @param  {LangObject} message.heading - An object containing the message header on different languages.
   * @param  {LangObject} message.subtitle - An object containing the message subtitle on different languages.
   * @param  {LangObject} message.content - An object containing the message content on different languages.
   * @param  {Object} [options] - An object with the targets and/or extra options
   * @param  {Targets} [options.targets] - An object with the targets and/or the filters.
   * If not provided send the notification by default to 'Test' segment.
   * @param  {Object} [options.extra] - Extra OneSignal configuration for the notification.
   * _Any attributes that are declared in the above parameters will be overridden from this setting_.
   * @returns {Promise<Response>} A promise with the response for the call. _See properties on https://visionmedia.github.io/superagent/#response-properties_.
   * @throws Will throw an error if the parameters for the message or the targets are not valid.
   */
  async sendNotification(message, options) {
    options = options || {};

    validate(message, messageSchema);
    const os_message = mapMessageToOS(message);

    let os_targets = { included_segments: 'Test' };
    if(options.targets) {
      validate(options.targets, targetsSchema);
      os_targets = mapTargetsToOS(options.targets);
    }
    
    const extra = options.extra || {};

    const payload = {
      ...extra,
      ...os_targets,
      ...os_message,
      app_id: this.appId,
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
