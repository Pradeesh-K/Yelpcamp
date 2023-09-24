const baseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),
  price: Joi.number().required().min(0),
  // image:Joi.string().required(),
  location: Joi.string().required().escapeHTML(),
  description: Joi.string().required().escapeHTML(),
  deleteImages: Joi.array(),
}).required();

module.exports.reviewSchema = Joi.object({
  body: Joi.string().required().escapeHTML(),
  rating: Joi.number().required().min(1).max(5),
}).required();

module.exports.userSchema = Joi.object({
  email: Joi.string().required().escapeHTML(),
  username: Joi.string().required().escapeHTML(),
  password: Joi.string().required().escapeHTML(),
}).required();
