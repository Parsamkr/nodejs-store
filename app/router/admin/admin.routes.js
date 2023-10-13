const {
  verifyAccessToken,
} = require("../../http/middlewares/verifyAccessToken");
const { BlogAdminApiRoutes } = require("./blog");
const { CategoryRoutes } = require("./category");

const router = require("express").Router();

/**
 * @swagger
 * tags :
 *  -   name : Admin-Panel
 *      description : Actions of admin (add , remove , edit & ...)
 *  -   name : Category(AdminPanel)
 *      description : All methods and routes about category section
 *  -   name : Blog(AdminPanel)
 *      description : All methods and routes about Blog section
 */

router.use("/category", CategoryRoutes);
router.use("/blogs", verifyAccessToken, BlogAdminApiRoutes);

module.exports = { AdminRoutes: router };
