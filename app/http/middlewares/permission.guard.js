const createHttpError = require("http-errors");
const { PermissionModel } = require("../../models/permission");
const { RoleModel } = require("../../models/role");
const { PERMISSIONS } = require("../../utils/constants");

function checkPermission(requiredPermissions = []) {
  return async function (req, res, next) {
    try {
      const allPermissions = requiredPermissions.flat(2);
      const user = req.user;
      const role = await RoleModel.findOne({ title: user.role });
      if (!role)
        throw new createHttpError.Forbidden(
          "you don't have access to this page"
        );
      const permissions = await PermissionModel.find({
        _id: { $in: role.permissions },
      });
      console.log(permissions, requiredPermissions);
      const userPermissions = permissions.map((item) => item.name);
      const hasPermission = allPermissions.every((permission) => {
        return userPermissions.includes(permission);
      });
      if (userPermissions.includes(PERMISSIONS.ALL)) return next();
      if (userPermissions.includes(PERMISSIONS.ALL)) return next();
      if (allPermissions.length == 0 || hasPermission) return next();
      throw createHttpError.Forbidden("you don't have access to this page");
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { checkPermission };
