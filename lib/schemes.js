const Joi = require('joi');

const validate = (obj, scheme, err) => Joi.assert(obj, scheme, err);
const validateString = (text, name) => validate(text, Joi.string().required(), new Error(`\"${name}\" is required`));

const configSchema = Joi.object().keys({
  authKey: Joi.string().required(),
  restApiKey: Joi.string().required(),
  appId: Joi.string().guid().required(),
});

const messageSchema = Joi.object().keys({
  es: Joi.string().required(),
  en: Joi.string().required()
}).with('en', 'es');

const optViewNotificationsScheme = Joi.object({
  limit: Joi.number(),
  offset: Joi.number(),
  kind: Joi.number(),
});


module.exports = {
  validate,
  validateString,
  configSchema,
  messageSchema,
  optViewNotificationsScheme,
}