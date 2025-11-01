const { ProductModel } = require("../../../../models/products");
const {
  deleteFileInPublic,
  ListOfImagesFromRequest,
  copyObject,
  setFeatures,
  deleteInvalidPropertyInObject,
} = require("../../../../utils/functions");
const path = require("path");
const {
  createProductSchema,
  updateProductSchema,
} = require("../../../validators/admin/product.schema");
const Controller = require("../../controller");
const { ObjectIdValidator } = require("../../../validators/public.validator");
const createHttpError = require("http-errors");
const { StatusCodes: httpStatus } = require("http-status-codes");

const ProductBlackList = {
  BOOKMARKS: "bookmarks",
  LIKES: "likes",
  DISLIKES: "dislikes",
  COMMENTS: "comments",
  SUPPLIER: "supplier",
  WEIGHT: "weight",
  WIDTH: "width",
  LENGTH: "length",
  HEIGHT: "height",
  COLORS: "colors",
};
Object.freeze(ProductBlackList);

class ProductController extends Controller {
  async addProduct(req, res, next) {
    try {
      const productBody = await createProductSchema.validateAsync(req.body);

      const images = ListOfImagesFromRequest(
        req?.files || [],
        productBody.fileUploadPath
      );

      req.body.images = images;

      const {
        title,
        text,
        short_text,
        category,
        tags,
        discount,
        price,
        count,
        type,
      } = productBody;

      const supplier = req.user._id;

      const features = setFeatures(productBody);

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
        features,
      });

      return res.status(httpStatus.CREATED).json({
        data: {
          statusCode: httpStatus.CREATED,
          data: {
            message: "product created successfully",
          },
        },
      });
    } catch (error) {
      req.body.images.map((image) => {
        deleteFileInPublic(image);
      });

      next(error);
    }
  }

  async editProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id);

      const productBody = await updateProductSchema.validateAsync(
        copyObject(req.body)
      );
      productBody.images = ListOfImagesFromRequest(
        req?.files || [],
        productBody.fileUploadPath
      );

      req.body.images = [...productBody.images];
      productBody.features = setFeatures(productBody);

      let blackListFields = Object.values(ProductBlackList);
      deleteInvalidPropertyInObject(productBody, blackListFields);
      const updateProductResult = await ProductModel.updateOne(
        { _id: product._id },
        { $set: productBody }
      );
      if (updateProductResult.modifiedCount == 0)
        throw {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "خطای داخلی",
        };
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: {
          message: "به روز رسانی باموفقیت انجام شد",
        },
      });
    } catch (error) {
      req.body.images.map((image) => {
        deleteFileInPublic(image);
      });
      next(error);
    }
  }

  async removeProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id);
      const removeProsuctResult = await ProductModel.deleteOne({
        _id: product._id,
      });
      if (removeProsuctResult.deletedCount == 0)
        throw createHttpError.InternalServerError();
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: {
          message: "product deleted successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const search = req?.query?.search;
      let products = {};
      if (search) {
        products = await ProductModel.find({
          $text: { $search: new RegExp(search, "ig") },
        });
      } else {
        products = await ProductModel.find({});
      }

      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { products } });
    } catch (error) {
      next(error);
    }
  }

  async getOneProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await this.findProductById(id);
      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { product } });
    } catch (error) {
      next(error);
    }
  }

  async findProductById(productId) {
    const { id } = await ObjectIdValidator.validateAsync({ id: productId });
    const product = await ProductModel.findById(id);
    if (!product) throw createHttpError.NotFound("there is no product");
    return product;
  }
}
module.exports = { ProductController: new ProductController() };
