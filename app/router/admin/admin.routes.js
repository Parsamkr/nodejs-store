const { CategoryRoutes } = require("./category");

const router = require("express").Router();

/**
 * @swagger
 * tags :
 *  name : Admin-Panel
 *  description : Actions of admin (add , remove , edit & ...)
 */

router.use("/category", CategoryRoutes);

module.exports = { AdminRoutes: router };
