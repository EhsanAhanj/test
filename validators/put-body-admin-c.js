const Joi = require("@hapi/joi");

function validatePutBody(body) {
  const schema = {
    title: Joi.string(),
    category: Joi.object(),
    realPrice: Joi.number(),
    newPrice: Joi.number(),
    images: Joi.array(),
    owner: Joi.object(),
    description: Joi.object(),
    expireDate: Joi.string()
  };

  return Joi.validate(body, schema);
}

module.exports.validatePutBody = validatePutBody;
