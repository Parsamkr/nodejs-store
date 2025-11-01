const createHttpError = require("http-errors");
const { ConversationModel } = require("../../../models/conversation");
const Controller = require("../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");

class NamespaceController extends Controller {
  async addNamespace(req, res, next) {
    try {
      const { title, endpoint } = req.body;
      await this.findNamespaceWithEndpoint(endpoint);
      await ConversationModel.create({ title, endpoint });
      return res.status(httpStatus.CREATED).json({
        statusCode: httpStatus.CREATED,
        data: { message: "namespace added successfully" },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllNamespaces(req, res, next) {
    try {
      const namespaces = await ConversationModel.find({}, { rooms: 0 });
      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { namespaces } });
    } catch (error) {
      next(error);
    }
  }
  async findNamespaceWithEndpoint(endpoint) {
    const namespace = await ConversationModel.findOne({ endpoint });
    if (namespace)
      throw new createHttpError.Conflict("we already have this namespace");
  }
}
module.exports = { NamespaceController: new NamespaceController() };
