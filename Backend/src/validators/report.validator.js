const Joi = require("joi");

const createReportSchema = Joi.object({
  identifier: Joi.string()
    .trim()
    .required(),

  identifierType: Joi.string()
    .valid(
      "PHONE",
      "UPI",
      "URL",
      "EMAIL",
      "SOCIAL_MEDIA"
    )
    .required(),

  message: Joi.string()
    .trim()
    .min(5)
    .max(5000)
    .required(),

  location: Joi.object({
    city: Joi.string()
      .trim()
      .allow("", null)
      .optional(),

    state: Joi.string()
      .trim()
      .allow("", null)
      .optional(),

    latitude: Joi.number()
      .min(-90)
      .max(90)
      .allow(null)
      .optional(),

    longitude: Joi.number()
      .min(-180)
      .max(180)
      .allow(null)
      .optional(),
  }).optional(),
});

module.exports = {
  createReportSchema,
};