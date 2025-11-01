const { checkPermission } = require("../../http/middlewares/permission.guard");
const { PERMISSIONS } = require("../../utils/constants");
const { AdminApiBlogRouter } = require("./blog");
const { AdminApiCategoryRouter } = require("./category");
const { AdminApiChapterRouter } = require("./chapter");
const { AdminApiCourseRouter } = require("./course");
const { AdminApiEpisodeRouter } = require("./episode");
const { AdminApiPermissionRouter } = require("./permission");
const { AdminApiProductRouter } = require("./product");
const { AdminApiRoleRouter } = require("./role");
const { AdminApiUserRouter } = require("./user");

const router = require("express").Router();

router.use(
  "/category",
  checkPermission([PERMISSIONS.CONTENT_MANAGER]),
  AdminApiCategoryRouter
);
router.use(
  "/blogs",
  checkPermission([PERMISSIONS.TEACHER]),
  AdminApiBlogRouter
);
router.use(
  "/products",
  checkPermission([PERMISSIONS.SUPPLIER, PERMISSIONS.CONTENT_MANAGER]),
  AdminApiProductRouter
);
router.use(
  "/courses",
  checkPermission([PERMISSIONS.TEACHER]),
  AdminApiCourseRouter
);
router.use(
  "/chapters",
  checkPermission([PERMISSIONS.TEACHER]),
  AdminApiChapterRouter
);
router.use(
  "/episodes",
  checkPermission([PERMISSIONS.TEACHER]),
  AdminApiEpisodeRouter
);
router.use("/users", AdminApiUserRouter);
router.use("/roles", checkPermission([PERMISSIONS.ALL]), AdminApiRoleRouter);
router.use(
  "/permissions",
  checkPermission([PERMISSIONS.ALL]),
  AdminApiPermissionRouter
);

module.exports = { AdminRoutes: router };
