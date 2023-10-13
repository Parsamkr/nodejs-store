const Joi = require("@hapi/joi");
const { MongoIDPattern } = require("../../../utils/constants");
const createHttpError = require("http-errors");

const createBlogSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(30)
    .error(createHttpError.BadRequest("blog title is incorrect")),
  text: Joi.string().error(
    createHttpError.BadRequest("inputted text is incorrect")
  ),
  short_text: Joi.string().error(
    createHttpError.BadRequest("inputted text is incorrect")
  ),
  fileName: Joi.string()
    .pattern(/(\.png|\.jpg|\.jpeg|\.webp\.gif)/i)
    .error(createHttpError.BadRequest("inputted image is incorrect")),
  tags: Joi.array()
    .min(0)
    .max(20)
    .error(createHttpError.BadRequest("tags cannot be more than 20")),
  category: Joi.string()
    .pattern(MongoIDPattern)
    .error(createHttpError.BadRequest("Category didn't found")),
  fileUploadPath: Joi.allow(),
});

module.exports = { createBlogSchema };
