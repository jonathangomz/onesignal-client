const Joi = require('joi');

const validate = (obj, scheme) => Joi.assert(obj, scheme);

const configSchema = Joi.object().keys({
  authKey: Joi.string().required(),
  restApiKey: Joi.string().required(),
  appId: Joi.string().guid().required(),
});

const messageSchema = Joi.object().keys({
  es: Joi.string().required(),
  en: Joi.string().required()
}).with('en', 'es');

module.exports = {
  validate,
  configSchema,
  messageSchema,
}