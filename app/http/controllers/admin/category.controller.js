const createHttpError = require("http-errors");
const { CategoryModel } = require("../../../models/categories");
const Controller = require("../controller");
const { addCategorySchema } = require("../../validators/admin/category.schema");

class CategoryController extends Controller {
  async addCategory(req, res, next) {
    try {
      await addCategorySchema.validateAsync(req.body);
      const { title, parent } = req.body;
      const category = await CategoryModel.create({ title, parent });
      if (!category)
        throw createHttpError.InternalServerError("internal error");
      return res.status(201).json({
        data: { statusCode: 201, message: "category addded successfully" },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await this.checkExistCategory(id);
      const deletedResult = await CategoryModel.deleteOne({
        _id: category._id.toString(),
      });
      console.log(deletedResult);
      if (deletedResult == 0)
        throw createHttpError.InternalServerError("deleting category failed");
      return res.status(202).json({
        data: { statusCode: 202, message: "category successfully deleted" },
      });
    } catch (error) {
      next(error);
    }
  }
  editCategory(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async getAllCategory(req, res, next) {
    try {
      // avvali ta ye laye nshun mide
      // const categories = await CategoryModel.aggregate([
      //   {
      //     $lookup: {
      //       from: "categories",
      //       localField: "_id",
      //       foreignField: "parent",
      //       as: "children",
      //     },
      //   },
      //   { $project: { __v: 0, "children.__v": 0, "children.parent": 0 } },
      //   { $match: { parent: undefined } },
      // ]);
      const categories = await CategoryModel.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parent",
            as: "children",
          },
        },
        { $project: { __v: 0, "children.__v": 0, "children.parent": 0 } },
        { $match: { parent: undefined } },
      ]);
      return res.status(200).json({ data: { statusCode: 200, categories } });
    } catch (error) {
      next(error);
    }
  }
  getCategoryById(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async getAllParents(req, res, next) {
    try {
      const parents = await CategoryModel.find(
        { parent: undefined },
        { __v: 0 }
      );
      return res.status(200).json({ data: { statusCode: 200, parents } });
    } catch (error) {
      next(error);
    }
  }
  async getChildrenOfParent(req, res, next) {
    try {
      const { parent } = req.params;
      const children = await CategoryModel.find(
        { parent },
        { __v: 0, parent: 0 }
      );
      return res.status(200).json({ data: { statusCode: 200, children } });
    } catch (error) {
      next(error);
    }
  }

  async checkExistCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category) throw createHttpError.NotFound("category didn`t found");
    return category;
  }
}

module.exports = { CategoryController: new CategoryController() };
