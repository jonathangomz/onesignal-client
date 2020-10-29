const { required } = require('joi');
const Joi = require('joi');

const validate = (obj, scheme, err) => Joi.assert(obj, scheme, err);
const validateString = (text, name) => validate(text, Joi.string().required(), new Error(`\"${name}\" is required`));

const configSchema = Joi.object({
  authKey: Joi.string().required(),
  restApiKey: Joi.string().required(),
  appId: Joi.string().guid().required(),
});

const langSchema = Joi.object({
  en: Joi.string().required(),
  es: Joi.string().required(),
});

const messageSchema = Joi.object({
  heading: langSchema.required(),
  subtitle: langSchema.optional(),
  content: langSchema.required(),
});

const targetsSchema = Joi.object({
  to: Joi.object({
    type: Joi.string().valid('segments', 'users', 'externals').required(),
    value: Joi.array().items(Joi.string()).required(),
  }).required(),
  filters: Joi.array().items(Joi.object()).optional(),
}).optional();

const optViewNotificationsSchema = Joi.object({
  limit: Joi.number(),
  offset: Joi.number(),
  kind: Joi.number(),
});

module.exports = {
  validate,
  validateString,
  configSchema,
  messageSchema,
  targetsSchema,
  optViewNotificationsSchema,
}