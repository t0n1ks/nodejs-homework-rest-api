const Joi = require('joi');

exports.createUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(12).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().regex(/^\d{10}$/).required(),
    })
    .validate(data);
