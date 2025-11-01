const { deleteFileInPublic } = require("../../../utils/functions");
const Controller = require("../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");
const path = require("path");
const createHttpError = require("http-errors");
const { ConversationModel } = require("../../../models/conversation");

class RoomController extends Controller {
  async createRoom(req, res, next) {
    try {
      const { name, description, fileUploadPath, fileName, namespace } =
        req.body;
      const image = path.join(fileUploadPath, fileName);
      await this.findRoomWithName(name);
      await this.findConversationWithEndpoint(namespace);
      await ConversationModel.updateOne(
        { endpoint: namespace },
        { $push: { rooms: { name, description, image } } }
      );
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: { message: "room added successfully" },
      });
    } catch (error) {
      if (req?.body?.fileUploadPath && req?.body?.fileName) {
        deleteFileInPublic(
          path.join(req.body.fileUploadPath, req.body.fileName)
        );
      }
      next(error);
    }
  }

  async getAllRooms(req, res, next) {
    try {
      const rooms = await ConversationModel.aggregate([
        { $unwind: "$rooms" },
        {
          $project: {
            _id: 0,
            namespaceTitle: "$title",
            namespaceEndpoint: "$endpoint",
            room: "$rooms",
          },
        },
      ]);
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: { rooms },
      });
    } catch (error) {
      next(error);
    }
  }

  async findRoomWithName(name) {
    const room = await ConversationModel.findOne({ "rooms.name": name });
    if (room) throw new createHttpError.Conflict("we already have this room");
  }
  async findConversationWithEndpoint(endpoint) {
    const conversation = await ConversationModel.findOne({ endpoint });
    if (!conversation)
      throw new createHttpError.NotFound("conversation not found");
    return conversation;
  }
}

module.exports = { RoomController: new RoomController() };
