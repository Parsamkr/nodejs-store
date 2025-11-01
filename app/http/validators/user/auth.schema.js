const Joi = require("@hapi/joi");

const getOtpSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error("phone number is incorrect")),
});

const checkOtpSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(new Error("phone number is incorrect")),
  code: Joi.string().min(4).max(6).error(new Error("code is incorrect")),
});

module.exports = { getOtpSchema, checkOtpSchema };
