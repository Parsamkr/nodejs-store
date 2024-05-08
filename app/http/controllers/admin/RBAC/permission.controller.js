const createHttpError = require("http-errors");
const { PermissionModel } = require("../../../../models/permission");
const {
  addPermissionSchema,
} = require("../../../validators/admin/RBAC.schema");
const Controller = require("../../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");
const { copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/functions");

class PermissionController extends Controller {
  async getAllPermissions(req, res, next) {
    try {
      const permissions = await PermissionModel.find({});
      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { permissions } });
    } catch (error) {
      next(error);
    }
  }

  async createNewPermission(req, res, next) {
    try {
      const { name, description } = await addPermissionSchema.validateAsync(
        req.body
      );
      await this.findPermissionWithName(name);
      const permission = await PermissionModel.create({ name, description });
      if (!permission)
        throw new createHttpError.InternalServerError(
          "creating permission failed"
        );
      return res.status(httpStatus.CREATED).json({
        statusCode: httpStatus.CREATED,
        data: { message: "permission created successfully" },
      });
    } catch (error) {
      next(error);
    }
  }

  async removePermission(req, res, next) {
    try {
      const { id } = req.params;

      await this.findPermissionWithId(id);
      const removePermissionResult = await PermissionModel.deleteOne({
        _id: id,
      });
      if (!removePermissionResult.deletedCount)
        throw new createHttpError.InternalServerError(
          "deleting permission failed"
        );
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: { message: "permission deleted successfully" },
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePermissionById(req, res, next) {
    try {
      const { id } = req.params;
      await this.findPermissionWithId(id);
      const data = copyObject(req.body);
      deleteInvalidPropertyInObject(data, []);
      const updatePermissionResult = await PermissionModel.updateOne(
        { _id: id },
        {
          $set: data,
        }
      );
      if (updatePermissionResult.modifiedCount == 0)
        throw new createHttpError.InternalServerError(
          "updating permission failed"
        );
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: { message: "permission updated successfully" },
      });
    } catch (error) {
      next(error);
    }
  }

  async findPermissionWithName(name) {
    const permission = await PermissionModel.findOne({ name });
    if (permission)
      throw new createHttpError.BadRequest("we already have this permission");
  }

  async findPermissionWithId(_id) {
    const permission = await PermissionModel.findOne({ _id });
    if (!permission)
      throw new createHttpError.NotFound("didn't find permission");
  }
}

module.exports = { PermissionController: new PermissionController() };
