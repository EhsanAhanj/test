const Joi = require("@hapi/joi");

function validatePutBody(body) {
  const schema = {
    userName: Joi.string(),
    name: Joi.string()
      .min(3)
      .max(50),
    phoneNumber: Joi.string()
      .min(7)
      .max(13),
    district: Joi.string(),
    biography: Joi.string(),
    linksOut: Joi.array(),
    avatarImage: Joi.string().uri(),
    address: Joi.string(),
    category: Joi.object()
  };

  return Joi.validate(body, schema);
}

module.exports.validatePutBody = validatePutBody;
