const { ProductModel } = require("../../../models/products");
const {
  deleteFileInPublic,
  ListOfImagesFromRequest,
} = require("../../../utils/functions");
const path = require("path");
const {
  createProductSchema,
} = require("../../validators/admin/product.schema");
const Controller = require("../controller");

class ProductController extends Controller {
  async addProduct(req, res, next) {
    try {
      const productBody = await createProductSchema.validateAsync(req.body);

      const images = ListOfImagesFromRequest(
        req?.files || [],
        productBody.fileUploadPath
      );

      const {
        title,
        text,
        short_text,
        category,
        tags,
        discount,
        width,
        length,
        weight,
        height,
        price,
        count,
        colors,
      } = productBody;

      const supplier = req.user._id;

      let feature = {},
        type = "physical";
      feature.colors = colors;
      if (isNaN(width) || isNaN(height) || isNaN(length) || isNaN(weight)) {
        if (!width) feature.width = 0;
        else feature.width = width;
        if (!height) feature.height = 0;
        else feature.height = height;
        if (!length) feature.length = 0;
        else feature.length = length;
        if (!weight) feature.weight = 0;
        else feature.weight = weight;
      } else {
        type = "virtual";
      }

      const product = await ProductModel.create({
        title,
        text,
        short_text,
        category,
        tags,
        images,
        discount,
        price,
        supplier,
        count,
        type,
        feature,
      });

      return res.status(201).json({
        data: { statusCode: 201, message: "product created successfully" },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async editProduct(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async removeProduct(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async getAllProducts(req, res, next) {
    try {
      const products = await ProductModel.find({});
      return res.status(200).json({ data: { statusCode: 200, products } });
    } catch (error) {
      next(error);
    }
  }
  async getOneProduct(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}
module.exports = { ProductController: new ProductController() };
