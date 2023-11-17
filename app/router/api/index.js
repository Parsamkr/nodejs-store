const router = require("express").Router();
const {
  HomeController,
} = require("../../http/controllers/api/home.controller");
const {
  verifyAccessToken,
} = require("../../http/middlewares/verifyAccessToken");

/**
 * @swagger
 * tags :
 *  name : IndexPage
 *  description : IndexPage routes
 */

/**
 * @swagger
 * /:
 *  get :
 *    summary : index of routes
 *    tags : [IndexPage]
 *    description : get all data for index page
 *    responses :
 *      200:
 *        description : success
 *      404:
 *        description : not found
 */

router.get("/", verifyAccessToken, HomeController.indexPage);

module.exports = { HomeRoutes: router };
