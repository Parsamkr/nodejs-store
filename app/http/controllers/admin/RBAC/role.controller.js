const createHttpError = require("http-errors");
const { RoleModel } = require("../../../../models/role");
const Controller = require("../../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");
const { addRoleSchema } = require("../../../validators/admin/RBAC.schema");
const { default: mongoose } = require("mongoose");
const {
  copyObject,
  deleteInvalidPropertyInObject,
} = require("../../../../utils/functions");

class RoleController extends Controller {
  async getAllRoles(req, res, next) {
    try {
      const roles = await RoleModel.find({}); //.populate([{ path: "permission" }])
      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { roles } });
    } catch (error) {
      next(error);
    }
  }

  async createNewRole(req, res, next) {
    try {
      const { title, permissions, description } =
        await addRoleSchema.validateAsync(req.body);
      await this.findRoleWithTitle(title);
      const role = await RoleModel.create({ title, permissions, description });
      if (!role)
        throw new createHttpError.InternalServerError("creating role failed");
      return res.status(httpStatus.CREATED).json({
        statusCode: httpStatus.CREATED,
        data: { message: "role created successfully" },
      });
    } catch (error) {
      next(error);
    }
  }

  async removeRole(req, res, next) {
    try {
      const { field } = req.params;
      const role = await this.findRoleWithIdOrTitle(field);
      const removeRoleResult = await RoleModel.deleteOne({ _id: role._id });
      if (!removeRoleResult.deletedCount)
        throw new createHttpError.InternalServerError("deleting role failed");
      return res.status(httpStatus.CREATED).json({
        statusCode: httpStatus.CREATED,
        data: { message: "role deleted successfully" },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRoleById(req, res, next) {
    try {
      const { id } = req.params;
      const role = await this.findRoleWithIdOrTitle(id);
      const data = copyObject(req.body);
      deleteInvalidPropertyInObject(data, []);
      const updateRoleResult = await RoleModel.updateOne(
        { _id: role._id },
        {
          $set: data,
        }
      );
      if (updateRoleResult.modifiedCount == 0)
        throw new createHttpError.InternalServerError("updating role failed");
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: { message: "role updated successfully" },
      });
    } catch (error) {
      next(error);
    }
  }

  async findRoleWithTitle(title) {
    const role = await RoleModel.findOne({ title });
    if (role) throw new createHttpError.BadRequest("we already have this role");
  }

  async findRoleWithIdOrTitle(field) {
    let findQuery = mongoose.isValidObjectId(field)
      ? { _id: field }
      : { title: field };

    const role = await RoleModel.findOne(findQuery);
    if (!role) throw new createHttpError.NotFound("didn't find a role");
    return role;
  }
}

module.exports = { RoleController: new RoleController() };
