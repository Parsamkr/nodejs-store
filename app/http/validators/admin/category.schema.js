const Joi = require("@hapi/joi");
const { MongoIDPattern } = require("../../../utils/constants");

const addCategorySchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(30)
    .error(new Error("Category title is incorrect")),
  parent: Joi.string()
    .allow("")
    .pattern(MongoIDPattern)
    .error(new Error("parent ID is wromg")),
});

module.exports = { addCategorySchema };
