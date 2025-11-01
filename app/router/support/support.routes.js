const {
  SupportController,
} = require("../../http/controllers/suppport/support.controller");
const { namespaceRoutes } = require("./namespace.routes");
const { roomRoutes } = require("./room.routes");
const router = require("express").Router();

router.use("/namespace", namespaceRoutes);
router.use("/room", roomRoutes);
router.get("/", SupportController.renderChatRoom);

module.exports = { supportRoutes: router };
