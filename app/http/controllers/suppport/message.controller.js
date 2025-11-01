const Controller = require("../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");

class MessageController extends Controller {
  async sendMessage(req, res, next) {
    try {
      const { message } = req.body;
      const messages = await MessageModel.create({ message });
      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { message } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { MessageController: new MessageController() };
