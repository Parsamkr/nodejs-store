const Joi = require("@hapi/joi");
const { MongoIDPattern } = require("../../../utils/constants");

const addRoleSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(30)
    .error(new Error("Role title is incorrect")),
  description: Joi.string()
    .min(0)
    .max(100)
    .error(new Error("Role description is incorrect")),
  permissions: Joi.array()
    .items(Joi.string().regex(MongoIDPattern))
    .error(new Error("permissions are incorrect")),
});

const addPermissionSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .error(new Error("permission name is incorrect")),
  description: Joi.string()
    .min(0)
    .max(100)
    .error(new Error("permission description is incorrect")),
});

module.exports = { addRoleSchema, addPermissionSchema };
