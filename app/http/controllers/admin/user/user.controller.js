const createHttpError = require("http-errors");
const { UserModel } = require("../../../../models/users");
const {
  deleteInvalidPropertyInObject,
} = require("../../../../utils/functions");
const Controller = require("../../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");

class UserController extends Controller {
  async getAllUsers(req, res, next) {
    try {
      const { search } = req.query;
      let databaseQuery = {};
      if (search)
        databaseQuery["$text"] = {
          $search: search,
        };
      const users = await UserModel.find(databaseQuery);
      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { users } });
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req, res, next) {
    try {
      const userID = req.user._id;
      const data = req.body;
      const blackListFields = [
        "mobile",
        "otp",
        "bills",
        "discount",
        "roles",
        "courses",
      ];
      deleteInvalidPropertyInObject(data, blackListFields);
      const profileUpdateResult = await UserModel.updateOne(
        { _id: userID },
        { $set: data }
      );
      if (profileUpdateResult.modifiedCount)
        throw new createHttpError.InternalServerError(
          "profile failed to update"
        );
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: { message: "profile updated successfully" },
      });
    } catch (error) {
      next(error);
    }
  }

  async userProfile(req, res, next) {
    try {
      const user = req.user
      //bill,courses,discount
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { UserController: new UserController() };
