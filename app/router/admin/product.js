const {
  ProductController,
} = require("../../http/controllers/admin/product/product.controller");
const { uploadFile } = require("../../utils/multer");
const { stringToArray } = require("../../http/middlewares/stringToArray");

const router = require("express").Router();

router.post(
  "/add",
  uploadFile.array("images", 10),
  stringToArray("tags"),
  ProductController.addProduct
);

router.get("/list", ProductController.getAllProducts);

router.get("/:id", ProductController.getOneProduct);

router.delete("/remove/:id", ProductController.removeProduct);

router.patch(
  "/edit/:id",
  uploadFile.array("images", 10),
  stringToArray("tags"),
  ProductController.editProduct
);
// router.patch();
// router.delete();
// router.get();

module.exports = { AdminApiProductRouter: router };
