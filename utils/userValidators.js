const Joi = require('joi');

exports.createUserDataValidator = (data, isPutRequest = false) => {
  let schema;
  if (isPutRequest) {
    schema = Joi.object()
      .options({ abortEarly: false })
      .keys({
        name: Joi.string().min(3).max(12),
        email: Joi.string().email(),
        phone: Joi.string().regex(/^\d{10}$/),
      });
  } else {
    schema = Joi.object()
      .options({ abortEarly: false })
      .keys({
        name: Joi.string().min(3).max(12).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().regex(/^\d{10}$/).required(),
      })
      .messages({
        'string.min': '"{#label}" must be a string',
        'string.max': '"{#label}" must be a string',
        'string.email': '"{#label}" must be a string',
        'string.pattern.base': '"{#label}" must be a string',
        'any.required': 'Missing required {#label} field',
      });
  }

  const validationResult = schema.validate(data, { abortEarly: false });

  if (validationResult.error) {
    const messages = validationResult.error.details.map((detail) => {
      if (detail.type === 'string.base') {
        return `"${detail.context.label}" must be a string`;
      } else {
        return `Missing required ${detail.context.label} field`;
      }
    });

    return { messages: messages.length === 1 ? messages[0] : messages };
  } else {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
  }
};
