// const Joi = require ('joi');

// exports.createUserDataValidator = (data) =>
// Joi
// .object()
// .options({abortEarly: false})
// .keys({
//     name: Joi.string().min(3).max(12).required(),
//     year: Joi.number().min(1920).max(2230),
// })
// .validate(data);

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
