const Joi = require("@hapi/joi");
const { MongoIDPattern } = require("../../../utils/constants");
const createHttpError = require("http-errors");

const createProductSchema = Joi.object({
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
  tags: Joi.array()
    .allow("")
    .single()
    .min(0)
    .max(20)
    .error(createHttpError.BadRequest("tags cannot be more than 20")),
  category: Joi.string()
    .regex(MongoIDPattern)
    .error(createHttpError.BadRequest("Category didn't found")),
  type: Joi.string()
    .regex(/virtual|physical/i)
    .error(createHttpError.BadRequest("type is wrong")),
  supplier: Joi.string()
    .regex(MongoIDPattern)
    .error(createHttpError.BadRequest("supplier didn't found")),
  price: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted price is incorrect")),
  discount: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted discount is incorrect")),
  count: Joi.number().error(
    createHttpError.BadRequest("inputted count is incorrect")
  ),
  height: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted height is incorrect")),
  width: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted width is incorrect")),
  weight: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted weight is incorrect")),
  length: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted length is incorrect")),
  colors: Joi.array()
    .allow("")
    .single()
    .min(0)
    .max(20)
    .error(createHttpError.BadRequest("colors cannot be more than 20")),
  fileName: Joi.string()
    .regex(/(\.png|\.jpg|\.jpeg|\.webp\.gif)/i)
    .error(createHttpError.BadRequest("inputted image is incorrect")),
  fileUploadPath: Joi.allow(),
});

const updateProductSchema = Joi.object({
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
  tags: Joi.array()
    .allow("")
    .single()
    .min(0)
    .max(20)
    .error(createHttpError.BadRequest("tags cannot be more than 20")),
  category: Joi.string()
    .regex(MongoIDPattern)
    .error(createHttpError.BadRequest("Category didn't found")),
  type: Joi.string()
    .regex(/virtual|physical/i)
    .error(createHttpError.BadRequest("type is wrong")),
  supplier: Joi.string()
    .regex(MongoIDPattern)
    .error(createHttpError.BadRequest("supplier didn't found")),
  price: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted price is incorrect")),
  discount: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted discount is incorrect")),
  count: Joi.number().error(
    createHttpError.BadRequest("inputted count is incorrect")
  ),
  height: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted height is incorrect")),
  width: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted width is incorrect")),
  weight: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted weight is incorrect")),
  length: Joi.number()
    .allow("")
    .error(createHttpError.BadRequest("inputted length is incorrect")),
  colors: Joi.array()
    .allow("")
    .single()
    .min(0)
    .max(20)
    .error(createHttpError.BadRequest("colors cannot be more than 20")),
  fileName: Joi.string()
    .regex(/(\.png|\.jpg|\.jpeg|\.webp\.gif)/i)
    .error(createHttpError.BadRequest("inputted image is incorrect")),
  fileUploadPath: Joi.allow(),
});

module.exports = { createProductSchema, updateProductSchema };
