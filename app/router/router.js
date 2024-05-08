const { graphqlHTTP } = require("express-graphql");
const { verifyAccessToken } = require("../http/middlewares/verifyAccessToken");
const { AdminRoutes } = require("./admin/admin.routes");
const { HomeRoutes } = require("./api");
const { DeveloperRoutes } = require("./developer.routes");
const { UserAuthRoutes } = require("./user/auth");
const { graphqlConfig } = require("../utils/graphql.config");

const router = require("express").Router();

router.use("/user", UserAuthRoutes);
router.use("/admin", verifyAccessToken, AdminRoutes);
router.use("/developer", DeveloperRoutes);
router.use("/", HomeRoutes);
router.use("/graphql", graphqlHTTP(graphqlConfig));

module.exports = { AllRoutes: router };
