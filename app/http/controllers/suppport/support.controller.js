const Controller = require("../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");

class SupportController extends Controller {
  renderChatRoom(req, res, next) {
    try {
      return res.render("chat", { title: "Chat Room - Support" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { SupportController: new SupportController() };
