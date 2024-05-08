const createHttpError = require("http-errors");
const { authSchema } = require("../../validators/user/auth.schema");
const Controller = require("../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");

class HomeController extends Controller {
  async indexPage(req, res, next) {
    try {
      return res.status(httpStatus.OK).send("Index page of store");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { HomeController: new HomeController() };
