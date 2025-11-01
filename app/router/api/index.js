const router = require("express").Router();
const {
  HomeController,
} = require("../../http/controllers/api/home.controller");
const {
  verifyAccessToken,
} = require("../../http/middlewares/verifyAccessToken");

router.get("/", verifyAccessToken, HomeController.indexPage);

module.exports = { HomeRoutes: router };
