const {
  verifyAccessToken,
} = require("../../http/middlewares/verifyAccessToken");
const { AdminApiBlogRouter } = require("./blog");
const { AdminApiCategoryRouter } = require("./category");
const { AdminApiProductRouter } = require("./product");

const router = require("express").Router();

/**
 * @swagger
 * tags :
 *  -   name : Admin-Panel
 *      description : Actions of admin (add , remove , edit & ...)
 *  -   name : Product(AdminPanel)
 *      description : All methods and routes about Product section
 *  -   name : Category(AdminPanel)
 *      description : All methods and routes about category section
 *  -   name : Blog(AdminPanel)
 *      description : All methods and routes about Blog section
 */

router.use("/category", AdminApiCategoryRouter);
router.use("/blogs", AdminApiBlogRouter);
router.use("/product", AdminApiProductRouter);

module.exports = { AdminRoutes: router };
