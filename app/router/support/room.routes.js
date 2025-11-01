const {
  RoomController,
} = require("../../http/controllers/suppport/room.controller");
const { uploadFile } = require("../../utils/multer");

const router = require("express").Router();

router.post("/", uploadFile.single("image"), RoomController.createRoom);
router.get("/", RoomController.getAllRooms);

module.exports = { roomRoutes: router };
