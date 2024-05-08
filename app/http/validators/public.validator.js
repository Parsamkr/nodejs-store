const Joi = require("@hapi/joi");
const { MongoIDPattern } = require("../../utils/constants");
const createHttpError = require("http-errors");

const ObjectIdValidator = Joi.object({
  id: Joi.string()
    .pattern(MongoIDPattern)
    .error(new Error(createHttpError.BadRequest("id is incorrect"))),
});

module.exports = { ObjectIdValidator };
